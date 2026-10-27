import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeQuery,matches} from '../src/core.js';
test('case, whitespace and full-width filename normalization',()=>{
 assert.equal(normalizeQuery('  MSVCP140.DLL  '),'msvcp140.dll');
 assert.equal(normalizeQuery('ＭＳＶＣＰ１４０．ＤＬＬ'),'msvcp140.dll');
 assert.equal(normalizeQuery(null),'');
});
test('extract filename from an actual missing-file message',()=>{
 assert.equal(normalizeQuery('The code execution cannot proceed because VCRUNTIME140_1.dll was not found. Reinstalling the program may fix this problem.'),'vcruntime140_1.dll');
 assert.equal(normalizeQuery('找不到文件 System.Text.Json.dll。'),'system.text.json.dll');
});
test('product terms, partial names and runtime/sdk filters compose',()=>{
 assert.equal(matches('msvcp140.dll Visual C++ 14','runtime','MSVCP'),true);
 assert.equal(matches('system.text.json.dll .NET Runtime','runtime','.net runtime'),true);
 assert.equal(matches('system.text.json.dll .NET Runtime','runtime','.net missing'),false);
 assert.equal(matches('msvcp140.dll Visual C++','runtime','','sdk'),false);
 assert.equal(matches('microsoft.codeanalysis.dll .NET SDK','sdk','codeanalysis','sdk'),true);
 assert.equal(matches('anything','runtime',''),true);
});
test('bounded queries and punctuation do not become executable content',()=>{
 assert.equal(normalizeQuery('a'.repeat(1000)).length,500);
 assert.equal(matches('normal.dll','runtime','<img onerror=alert(1)>'),false);
});
