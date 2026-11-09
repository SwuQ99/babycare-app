const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function app() {
 const elements = Object.fromEntries(['role','tabs','view','reset'].map(id=>[id,{innerHTML:'',handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}}]));
 let detail = 'Selesai';
 const context = {document:{querySelector:s=>elements[s.slice(1)]},prompt:()=>detail,alert:()=>{},FormData:class {constructor(form){this.get=k=>form.values[k];}},Date};
 vm.runInNewContext(source,context);
 return {elements,role(value){elements.role.handlers.change({target:{value}});},tab(value){elements.tabs.handlers.click({target:{closest:()=>({dataset:{tab:value}})}});},complete(id,text){detail=text;elements.view.handlers.click({target:{closest:()=>({dataset:{complete:String(id)}})}});},add(values){elements.view.handlers.submit({target:{id:'recordForm',values},preventDefault(){}});}};
}
test('application boots and each role renders all tabs',()=>{
 const a=app(); assert.match(a.elements.view.innerHTML,/Ringkasan pusat/);
 for(const [role,tabs] of Object.entries({manager:['home','babies','schedule'],staff:['home','add','history'],mother:['home','history','notices']})) {a.role(role);for(const tab of tabs){a.tab(tab);assert.ok(a.elements.view.innerHTML.length>0);}}
});
test('staff can complete Melur tasks only; mother sees her own records',()=>{
 const a=app(); a.role('staff'); a.complete(5,'Mawar forbidden'); a.complete(4,'Susu khas');a.tab('history');assert.match(a.elements.view.innerHTML,/Susu khas/);assert.doesNotMatch(a.elements.view.innerHTML,/Mawar forbidden|Baby Sofia/);
 a.role('mother');assert.match(a.elements.view.innerHTML,/Susu khas/);assert.doesNotMatch(a.elements.view.innerHTML,/Baby Adam|Baby Sofia/);
});
test('history is ordered by activity time and user input is escaped',()=>{
 const a=app();a.role('staff');a.complete(4,'<img src=x onerror=alert(1)>');a.tab('history');const html=a.elements.view.innerHTML;assert.ok(html.indexOf('11:00')<html.indexOf('09:15'));assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img/);
});
test('invalid or unauthorized additions are rejected and reset restores data',()=>{
 const a=app();const valid={baby:'1',type:'Susu',detail:'Unique record'};
 a.add(valid);a.role('staff');a.tab('history');assert.doesNotMatch(a.elements.view.innerHTML,/Unique record/);
 a.add({...valid,baby:'3'});a.tab('history');assert.doesNotMatch(a.elements.view.innerHTML,/Unique record/);
 a.add(valid);a.tab('history');assert.match(a.elements.view.innerHTML,/Unique record/);
 a.elements.reset.handlers.click();a.tab('history');assert.doesNotMatch(a.elements.view.innerHTML,/Unique record/);
});
