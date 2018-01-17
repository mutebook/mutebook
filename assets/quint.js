(function(){var supportsDirectProtoAccess=function(){var z=function(){}
z.prototype={p:{}}
var y=new z()
if(!(y.__proto__&&y.__proto__.p===z.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var x=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(x))return true}}catch(w){}return false}()
function map(a){a=Object.create(null)
a.x=0
delete a.x
return a}var A=map()
var B=map()
var C=map()
var D=map()
var E=map()
var F=map()
var G=map()
var H=map()
var J=map()
var K=map()
var L=map()
var M=map()
var N=map()
var O=map()
var P=map()
var Q=map()
var R=map()
var S=map()
var T=map()
var U=map()
var V=map()
var W=map()
var X=map()
var Y=map()
var Z=map()
function I(){}init()
function setupProgram(a,b){"use strict"
function generateAccessor(a9,b0,b1){var g=a9.split("-")
var f=g[0]
var e=f.length
var d=f.charCodeAt(e-1)
var c
if(g.length>1)c=true
else c=false
d=d>=60&&d<=64?d-59:d>=123&&d<=126?d-117:d>=37&&d<=43?d-27:0
if(d){var a0=d&3
var a1=d>>2
var a2=f=f.substring(0,e-1)
var a3=f.indexOf(":")
if(a3>0){a2=f.substring(0,a3)
f=f.substring(a3+1)}if(a0){var a4=a0&2?"r":""
var a5=a0&1?"this":"r"
var a6="return "+a5+"."+f
var a7=b1+".prototype.g"+a2+"="
var a8="function("+a4+"){"+a6+"}"
if(c)b0.push(a7+"$reflectable("+a8+");\n")
else b0.push(a7+a8+";\n")}if(a1){var a4=a1&2?"r,v":"v"
var a5=a1&1?"this":"r"
var a6=a5+"."+f+"=v"
var a7=b1+".prototype.s"+a2+"="
var a8="function("+a4+"){"+a6+"}"
if(c)b0.push(a7+"$reflectable("+a8+");\n")
else b0.push(a7+a8+";\n")}}return f}function defineClass(a2,a3){var g=[]
var f="function "+a2+"("
var e=""
var d=""
for(var c=0;c<a3.length;c++){if(c!=0)f+=", "
var a0=generateAccessor(a3[c],g,a2)
d+="'"+a0+"',"
var a1="p_"+a0
f+=a1
e+="this."+a0+" = "+a1+";\n"}if(supportsDirectProtoAccess)e+="this."+"$deferredAction"+"();"
f+=") {\n"+e+"}\n"
f+=a2+".builtin$cls=\""+a2+"\";\n"
f+="$desc=$collectedClasses."+a2+"[1];\n"
f+=a2+".prototype = $desc;\n"
if(typeof defineClass.name!="string")f+=a2+".name=\""+a2+"\";\n"
f+=a2+"."+"$__fields__"+"=["+d+"];\n"
f+=g.join("")
return f}init.createNewIsolate=function(){return new I()}
init.classIdExtractor=function(c){return c.constructor.name}
init.classFieldsExtractor=function(c){var g=c.constructor.$__fields__
if(!g)return[]
var f=[]
f.length=g.length
for(var e=0;e<g.length;e++)f[e]=c[g[e]]
return f}
init.instanceFromClassId=function(c){return new init.allClasses[c]()}
init.initializeEmptyInstance=function(c,d,e){init.allClasses[c].apply(d,e)
return d}
var z=supportsDirectProtoAccess?function(c,d){var g=c.prototype
g.__proto__=d.prototype
g.constructor=c
g["$is"+c.name]=c
return convertToFastObject(g)}:function(){function tmp(){}return function(a0,a1){tmp.prototype=a1.prototype
var g=new tmp()
convertToSlowObject(g)
var f=a0.prototype
var e=Object.keys(f)
for(var d=0;d<e.length;d++){var c=e[d]
g[c]=f[c]}g["$is"+a0.name]=a0
g.constructor=a0
a0.prototype=g
return g}}()
function finishClasses(a4){var g=init.allClasses
a4.combinedConstructorFunction+="return [\n"+a4.constructorsList.join(",\n  ")+"\n]"
var f=new Function("$collectedClasses",a4.combinedConstructorFunction)(a4.collected)
a4.combinedConstructorFunction=null
for(var e=0;e<f.length;e++){var d=f[e]
var c=d.name
var a0=a4.collected[c]
var a1=a0[0]
a0=a0[1]
g[c]=d
a1[c]=d}f=null
var a2=init.finishedClasses
function finishClass(c1){if(a2[c1])return
a2[c1]=true
var a5=a4.pending[c1]
if(a5&&a5.indexOf("+")>0){var a6=a5.split("+")
a5=a6[0]
var a7=a6[1]
finishClass(a7)
var a8=g[a7]
var a9=a8.prototype
var b0=g[c1].prototype
var b1=Object.keys(a9)
for(var b2=0;b2<b1.length;b2++){var b3=b1[b2]
if(!u.call(b0,b3))b0[b3]=a9[b3]}}if(!a5||typeof a5!="string"){var b4=g[c1]
var b5=b4.prototype
b5.constructor=b4
b5.$isd=b4
b5.$deferredAction=function(){}
return}finishClass(a5)
var b6=g[a5]
if(!b6)b6=existingIsolateProperties[a5]
var b4=g[c1]
var b5=z(b4,b6)
if(a9)b5.$deferredAction=mixinDeferredActionHelper(a9,b5)
if(Object.prototype.hasOwnProperty.call(b5,"%")){var b7=b5["%"].split(";")
if(b7[0]){var b8=b7[0].split("|")
for(var b2=0;b2<b8.length;b2++){init.interceptorsByTag[b8[b2]]=b4
init.leafTags[b8[b2]]=true}}if(b7[1]){b8=b7[1].split("|")
if(b7[2]){var b9=b7[2].split("|")
for(var b2=0;b2<b9.length;b2++){var c0=g[b9[b2]]
c0.$nativeSuperclassTag=b8[0]}}for(b2=0;b2<b8.length;b2++){init.interceptorsByTag[b8[b2]]=b4
init.leafTags[b8[b2]]=false}}b5.$deferredAction()}if(b5.$isl)b5.$deferredAction()}var a3=Object.keys(a4.pending)
for(var e=0;e<a3.length;e++)finishClass(a3[e])}function finishAddStubsHelper(){var g=this
while(!g.hasOwnProperty("$deferredAction"))g=g.__proto__
delete g.$deferredAction
var f=Object.keys(g)
for(var e=0;e<f.length;e++){var d=f[e]
var c=d.charCodeAt(0)
var a0
if(d!=="^"&&d!=="$reflectable"&&c!==43&&c!==42&&(a0=g[d])!=null&&a0.constructor===Array&&d!=="<>")addStubs(g,a0,d,false,[])}convertToFastObject(g)
g=g.__proto__
g.$deferredAction()}function mixinDeferredActionHelper(c,d){var g
if(d.hasOwnProperty("$deferredAction"))g=d.$deferredAction
return function foo(){if(!supportsDirectProtoAccess)return
var f=this
while(!f.hasOwnProperty("$deferredAction"))f=f.__proto__
if(g)f.$deferredAction=g
else{delete f.$deferredAction
convertToFastObject(f)}c.$deferredAction()
f.$deferredAction()}}function processClassData(b1,b2,b3){b2=convertToSlowObject(b2)
var g
var f=Object.keys(b2)
var e=false
var d=supportsDirectProtoAccess&&b1!="d"
for(var c=0;c<f.length;c++){var a0=f[c]
var a1=a0.charCodeAt(0)
if(a0==="w"){processStatics(init.statics[b1]=b2.w,b3)
delete b2.w}else if(a1===43){w[g]=a0.substring(1)
var a2=b2[a0]
if(a2>0)b2[g].$reflectable=a2}else if(a1===42){b2[g].$D=b2[a0]
var a3=b2.$methodsWithOptionalArguments
if(!a3)b2.$methodsWithOptionalArguments=a3={}
a3[a0]=g}else{var a4=b2[a0]
if(a0!=="^"&&a4!=null&&a4.constructor===Array&&a0!=="<>")if(d)e=true
else addStubs(b2,a4,a0,false,[])
else g=a0}}if(e)b2.$deferredAction=finishAddStubsHelper
var a5=b2["^"],a6,a7,a8=a5
var a9=a8.split(";")
a8=a9[1]?a9[1].split(","):[]
a7=a9[0]
a6=a7.split(":")
if(a6.length==2){a7=a6[0]
var b0=a6[1]
if(b0)b2.$S=function(b4){return function(){return init.types[b4]}}(b0)}if(a7)b3.pending[b1]=a7
b3.combinedConstructorFunction+=defineClass(b1,a8)
b3.constructorsList.push(b1)
b3.collected[b1]=[m,b2]
i.push(b1)}function processStatics(a3,a4){var g=Object.keys(a3)
for(var f=0;f<g.length;f++){var e=g[f]
if(e==="^")continue
var d=a3[e]
var c=e.charCodeAt(0)
var a0
if(c===43){v[a0]=e.substring(1)
var a1=a3[e]
if(a1>0)a3[a0].$reflectable=a1
if(d&&d.length)init.typeInformation[a0]=d}else if(c===42){m[a0].$D=d
var a2=a3.$methodsWithOptionalArguments
if(!a2)a3.$methodsWithOptionalArguments=a2={}
a2[e]=a0}else if(typeof d==="function"){m[a0=e]=d
h.push(e)
init.globalFunctions[e]=d}else if(d.constructor===Array)addStubs(m,d,e,true,h)
else{a0=e
processClassData(e,d,a4)}}}function addStubs(b6,b7,b8,b9,c0){var g=0,f=b7[g],e
if(typeof f=="string")e=b7[++g]
else{e=f
f=b8}var d=[b6[b8]=b6[f]=e]
e.$stubName=b8
c0.push(b8)
for(g++;g<b7.length;g++){e=b7[g]
if(typeof e!="function")break
if(!b9)e.$stubName=b7[++g]
d.push(e)
if(e.$stubName){b6[e.$stubName]=e
c0.push(e.$stubName)}}for(var c=0;c<d.length;g++,c++)d[c].$callName=b7[g]
var a0=b7[g]
b7=b7.slice(++g)
var a1=b7[0]
var a2=a1>>1
var a3=(a1&1)===1
var a4=a1===3
var a5=a1===1
var a6=b7[1]
var a7=a6>>1
var a8=(a6&1)===1
var a9=a2+a7!=d[0].length
var b0=b7[2]
if(typeof b0=="number")b7[2]=b0+b
var b1=2*a7+a2+3
if(a0){e=tearOff(d,b7,b9,b8,a9)
b6[b8].$getter=e
e.$getterStub=true
if(b9){init.globalFunctions[b8]=e
c0.push(a0)}b6[a0]=e
d.push(e)
e.$stubName=a0
e.$callName=null}var b2=b7.length>b1
if(b2){d[0].$reflectable=1
d[0].$reflectionInfo=b7
for(var c=1;c<d.length;c++){d[c].$reflectable=2
d[c].$reflectionInfo=b7}var b3=b9?init.mangledGlobalNames:init.mangledNames
var b4=b7[b1]
var b5=b4
if(a0)b3[a0]=b5
if(a4)b5+="="
else if(!a5)b5+=":"+(a2+a7)
b3[b8]=b5
d[0].$reflectionName=b5
d[0].$metadataIndex=b1+1
if(a7)b6[b4+"*"]=d[0]}}function tearOffGetter(c,d,e,f){return f?new Function("funcs","reflectionInfo","name","H","c","return function tearOff_"+e+y+++"(x) {"+"if (c === null) c = "+"H.cT"+"("+"this, funcs, reflectionInfo, false, [x], name);"+"return new c(this, funcs[0], x, name);"+"}")(c,d,e,H,null):new Function("funcs","reflectionInfo","name","H","c","return function tearOff_"+e+y+++"() {"+"if (c === null) c = "+"H.cT"+"("+"this, funcs, reflectionInfo, false, [], name);"+"return new c(this, funcs[0], null, name);"+"}")(c,d,e,H,null)}function tearOff(c,d,e,f,a0){var g
return e?function(){if(g===void 0)g=H.cT(this,c,d,true,[],f).prototype
return g}:tearOffGetter(c,d,f,a0)}var y=0
if(!init.libraries)init.libraries=[]
if(!init.mangledNames)init.mangledNames=map()
if(!init.mangledGlobalNames)init.mangledGlobalNames=map()
if(!init.statics)init.statics=map()
if(!init.typeInformation)init.typeInformation=map()
if(!init.globalFunctions)init.globalFunctions=map()
var x=init.libraries
var w=init.mangledNames
var v=init.mangledGlobalNames
var u=Object.prototype.hasOwnProperty
var t=a.length
var s=map()
s.collected=map()
s.pending=map()
s.constructorsList=[]
s.combinedConstructorFunction="function $reflectable(fn){fn.$reflectable=1;return fn};\n"+"var $desc;\n"
for(var r=0;r<t;r++){var q=a[r]
var p=q[0]
var o=q[1]
var n=q[2]
var m=q[3]
var l=q[4]
var k=!!q[5]
var j=l&&l["^"]
if(j instanceof Array)j=j[0]
var i=[]
var h=[]
processStatics(l,s)
x.push([p,o,i,h,n,j,k,m])}finishClasses(s)}I.Q=function(){}
var dart=[["","",,H,{"^":"",m0:{"^":"d;a"}}],["","",,J,{"^":"",
n:function(a){return void 0},
c5:function(a,b,c,d){return{i:a,p:b,e:c,x:d}},
c0:function(a){var z,y,x,w,v
z=a[init.dispatchPropertyName]
if(z==null)if($.cX==null){H.kX()
z=a[init.dispatchPropertyName]}if(z!=null){y=z.p
if(!1===y)return z.i
if(!0===y)return a
x=Object.getPrototypeOf(a)
if(y===x)return z.i
if(z.e===x)throw H.b(new P.eb("Return interceptor for "+H.j(y(a,z))))}w=a.constructor
v=w==null?null:w[$.$get$co()]
if(v!=null)return v
v=H.l6(a)
if(v!=null)return v
if(typeof a=="function")return C.x
y=Object.getPrototypeOf(a)
if(y==null)return C.m
if(y===Object.prototype)return C.m
if(typeof w=="function"){Object.defineProperty(w,$.$get$co(),{value:C.f,enumerable:false,writable:true,configurable:true})
return C.f}return C.f},
l:{"^":"d;",
C:function(a,b){return a===b},
gF:function(a){return H.ax(a)},
j:["dF",function(a){return H.bP(a)}],
bB:["dE",function(a,b){throw H.b(P.dF(a,b.gcU(),b.gd1(),b.gcY(),null))}],
"%":"Client|DOMError|FileError|MediaError|NavigatorUserMediaError|PositionError|PushMessageData|SQLError|SVGAnimatedLength|SVGAnimatedLengthList|SVGAnimatedNumber|SVGAnimatedNumberList|SVGAnimatedString|WindowClient"},
h7:{"^":"l;",
j:function(a){return String(a)},
gF:function(a){return a?519018:218159},
$iseD:1},
ha:{"^":"l;",
C:function(a,b){return null==b},
j:function(a){return"null"},
gF:function(a){return 0},
bB:function(a,b){return this.dE(a,b)}},
cp:{"^":"l;",
gF:function(a){return 0},
j:["dG",function(a){return String(a)}],
$ishb:1},
hz:{"^":"cp;"},
bu:{"^":"cp;"},
bi:{"^":"cp;",
j:function(a){var z=a[$.$get$bH()]
return z==null?this.dG(a):J.u(z)},
$iscl:1,
$S:function(){return{func:1,opt:[,,,,,,,,,,,,,,,,]}}},
bf:{"^":"l;$ti",
cD:function(a,b){if(!!a.immutable$list)throw H.b(new P.y(b))},
aE:function(a,b){if(!!a.fixed$length)throw H.b(new P.y(b))},
u:function(a,b){this.aE(a,"add")
a.push(b)},
a0:function(a,b){var z
this.aE(a,"remove")
for(z=0;z<a.length;++z)if(J.a1(a[z],b)){a.splice(z,1)
return!0}return!1},
T:function(a,b){var z
this.aE(a,"addAll")
for(z=J.aq(b);z.v();)a.push(z.gD())},
a8:function(a,b){var z,y
z=a.length
for(y=0;y<z;++y){b.$1(a[y])
if(a.length!==z)throw H.b(new P.al(a))}},
a3:function(a,b){return new H.a3(a,b,[H.B(a,0),null])},
I:function(a,b){if(b>>>0!==b||b>=a.length)return H.m(a,b)
return a[b]},
gar:function(a){if(a.length>0)return a[0]
throw H.b(H.cn())},
ax:function(a,b,c,d,e){var z,y,x
this.cD(a,"setRange")
P.dP(b,c,a.length,null,null,null)
z=c-b
if(z===0)return
if(e<0)H.A(P.Z(e,0,null,"skipCount",null))
if(e+z>d.length)throw H.b(H.h6())
if(e<b)for(y=z-1;y>=0;--y){x=e+y
if(x<0||x>=d.length)return H.m(d,x)
a[b+y]=d[x]}else for(y=0;y<z;++y){x=e+y
if(x<0||x>=d.length)return H.m(d,x)
a[b+y]=d[x]}},
gl:function(a){return a.length===0},
j:function(a){return P.bK(a,"[","]")},
N:function(a,b){var z=H.R(a.slice(0),[H.B(a,0)])
return z},
S:function(a){return this.N(a,!0)},
gH:function(a){return new J.bE(a,a.length,0,null)},
gF:function(a){return H.ax(a)},
gi:function(a){return a.length},
si:function(a,b){this.aE(a,"set length")
if(b<0)throw H.b(P.Z(b,0,null,"newLength",null))
a.length=b},
h:function(a,b){if(typeof b!=="number"||Math.floor(b)!==b)throw H.b(H.K(a,b))
if(b>=a.length||b<0)throw H.b(H.K(a,b))
return a[b]},
A:function(a,b,c){this.cD(a,"indexed set")
if(typeof b!=="number"||Math.floor(b)!==b)throw H.b(H.K(a,b))
if(b>=a.length||b<0)throw H.b(H.K(a,b))
a[b]=c},
$isN:1,
$asN:I.Q,
$isk:1,
$ask:null,
$ish:1,
$ash:null,
$ise:1,
$ase:null},
m_:{"^":"bf;$ti"},
bE:{"^":"d;a,b,c,d",
gD:function(){return this.d},
v:function(){var z,y,x
z=this.a
y=z.length
if(this.b!==y)throw H.b(H.bB(z))
x=this.c
if(x>=y){this.d=null
return!1}this.d=z[x]
this.c=x+1
return!0}},
bg:{"^":"l;",
bt:function(a,b){var z
if(typeof b!=="number")throw H.b(H.H(b))
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){z=this.gaW(b)
if(this.gaW(a)===z)return 0
if(this.gaW(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gaW:function(a){return a===0?1/a<0:a<0},
d2:function(a,b){return a%b},
aM:function(a){var z
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){z=a<0?Math.ceil(a):Math.floor(a)
return z+0}throw H.b(new P.y(""+a+".toInt()"))},
cB:function(a){var z,y
if(a>=0){if(a<=2147483647){z=a|0
return a===z?z:z+1}}else if(a>=-2147483648)return a|0
y=Math.ceil(a)
if(isFinite(y))return y
throw H.b(new P.y(""+a+".ceil()"))},
cL:function(a){var z,y
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){z=a|0
return a===z?z:z-1}y=Math.floor(a)
if(isFinite(y))return y
throw H.b(new P.y(""+a+".floor()"))},
R:function(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw H.b(new P.y(""+a+".round()"))},
cF:function(a,b,c){if(typeof b!=="number")throw H.b(H.H(b))
if(typeof c!=="number")throw H.b(H.H(c))
if(this.bt(b,c)>0)throw H.b(H.H(b))
if(this.bt(a,b)<0)return b
if(this.bt(a,c)>0)return c
return a},
J:function(a){return a},
av:function(a,b){var z
if(b>20)throw H.b(P.Z(b,0,20,"fractionDigits",null))
z=a.toFixed(b)
if(a===0&&this.gaW(a))return"-"+z
return z},
j:function(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gF:function(a){return a&0x1FFFFFFF},
ak:function(a){return-a},
m:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return a+b},
t:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return a-b},
B:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return a/b},
q:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return a*b},
dj:function(a,b){var z=a%b
if(z===0)return 0
if(z>0)return z
if(b<0)return z-b
else return z+b},
az:function(a,b){if((a|0)===a)if(b>=1||!1)return a/b|0
return this.cq(a,b)},
aU:function(a,b){return(a|0)===a?a/b|0:this.cq(a,b)},
cq:function(a,b){var z=a/b
if(z>=-2147483648&&z<=2147483647)return z|0
if(z>0){if(z!==1/0)return Math.floor(z)}else if(z>-1/0)return Math.ceil(z)
throw H.b(new P.y("Result of truncating division is "+H.j(z)+": "+H.j(a)+" ~/ "+b))},
dA:function(a,b){if(b<0)throw H.b(H.H(b))
return b>31?0:a<<b>>>0},
dB:function(a,b){var z
if(b<0)throw H.b(H.H(b))
if(a>0)z=b>31?0:a>>>b
else{z=b>31?31:b
z=a>>z>>>0}return z},
cp:function(a,b){var z
if(a>0)z=b>31?0:a>>>b
else{z=b>31?31:b
z=a>>z>>>0}return z},
dN:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return(a^b)>>>0},
L:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return a<b},
V:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return a>b},
b_:function(a,b){if(typeof b!=="number")throw H.b(H.H(b))
return a<=b},
$isaN:1},
dw:{"^":"bg;",$isaN:1,$isq:1},
h8:{"^":"bg;",$isaN:1},
bh:{"^":"l;",
cI:function(a,b){if(b<0)throw H.b(H.K(a,b))
if(b>=a.length)H.A(H.K(a,b))
return a.charCodeAt(b)},
b9:function(a,b){if(b>=a.length)throw H.b(H.K(a,b))
return a.charCodeAt(b)},
m:function(a,b){if(typeof b!=="string")throw H.b(P.cf(b,null,null))
return a+b},
b3:function(a,b,c){var z
if(typeof b!=="number"||Math.floor(b)!==b)H.A(H.H(b))
if(c==null)c=a.length
if(typeof c!=="number"||Math.floor(c)!==c)H.A(H.H(c))
z=J.w(b)
if(z.L(b,0))throw H.b(P.bo(b,null,null))
if(z.V(b,c))throw H.b(P.bo(b,null,null))
if(J.aB(c,a.length))throw H.b(P.bo(c,null,null))
return a.substring(b,c)},
dC:function(a,b){return this.b3(a,b,null)},
fv:function(a){var z,y,x,w,v
z=a.trim()
y=z.length
if(y===0)return z
if(this.b9(z,0)===133){x=J.hc(z,1)
if(x===y)return""}else x=0
w=y-1
v=this.cI(z,w)===133?J.hd(z,w):y
if(x===0&&v===y)return z
return z.substring(x,v)},
q:function(a,b){if(typeof b!=="number")return H.p(b)
if(0>=b)return""
if(a.length===0)return a
throw H.b(C.n)},
eC:function(a,b,c){if(c>a.length)throw H.b(P.Z(c,0,a.length,null,null))
return H.lg(a,b,c)},
gl:function(a){return a.length===0},
j:function(a){return a},
gF:function(a){var z,y,x
for(z=a.length,y=0,x=0;x<z;++x){y=536870911&y+a.charCodeAt(x)
y=536870911&y+((524287&y)<<10)
y^=y>>6}y=536870911&y+((67108863&y)<<3)
y^=y>>11
return 536870911&y+((16383&y)<<15)},
gi:function(a){return a.length},
h:function(a,b){if(typeof b!=="number"||Math.floor(b)!==b)throw H.b(H.K(a,b))
if(b>=a.length||b<0)throw H.b(H.K(a,b))
return a[b]},
$isN:1,
$asN:I.Q,
$isO:1,
w:{
dx:function(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
hc:function(a,b){var z,y
for(z=a.length;b<z;){y=C.a.b9(a,b)
if(y!==32&&y!==13&&!J.dx(y))break;++b}return b},
hd:function(a,b){var z,y
for(;b>0;b=z){z=b-1
y=C.a.cI(a,z)
if(y!==32&&y!==13&&!J.dx(y))break}return b}}}}],["","",,H,{"^":"",
eq:function(a){if(a<0)H.A(P.Z(a,0,null,"count",null))
return a},
cn:function(){return new P.br("No element")},
h6:function(){return new P.br("Too few elements")},
h:{"^":"e;$ti",$ash:null},
aU:{"^":"h;$ti",
gH:function(a){return new H.cs(this,this.gi(this),0,null)},
gl:function(a){return this.gi(this)===0},
gar:function(a){if(this.gi(this)===0)throw H.b(H.cn())
return this.I(0,0)},
a3:function(a,b){return new H.a3(this,b,[H.L(this,"aU",0),null])},
N:function(a,b){var z,y,x
z=H.R([],[H.L(this,"aU",0)])
C.b.si(z,this.gi(this))
for(y=0;y<this.gi(this);++y){x=this.I(0,y)
if(y>=z.length)return H.m(z,y)
z[y]=x}return z},
S:function(a){return this.N(a,!0)}},
ic:{"^":"aU;a,b,c,$ti",
ge7:function(){var z,y
z=J.W(this.a)
y=this.c
if(y==null||y>z)return z
return y},
geq:function(){var z,y
z=J.W(this.a)
y=this.b
if(y>z)return z
return y},
gi:function(a){var z,y,x
z=J.W(this.a)
y=this.b
if(y>=z)return 0
x=this.c
if(x==null||x>=z)return z-y
if(typeof x!=="number")return x.t()
return x-y},
I:function(a,b){var z,y
z=this.geq()
if(typeof b!=="number")return H.p(b)
y=z+b
if(!(b<0)){z=this.ge7()
if(typeof z!=="number")return H.p(z)
z=y>=z}else z=!0
if(z)throw H.b(P.ac(b,this,"index",null,null))
return J.aP(this.a,y)},
N:function(a,b){var z,y,x,w,v,u,t,s,r
z=this.b
y=this.a
x=J.t(y)
w=x.gi(y)
v=this.c
if(v!=null&&v<w)w=v
if(typeof w!=="number")return w.t()
u=w-z
if(u<0)u=0
t=this.$ti
if(b){s=H.R([],t)
C.b.si(s,u)}else s=H.R(new Array(u),t)
for(r=0;r<u;++r){t=x.I(y,z+r)
if(r>=s.length)return H.m(s,r)
s[r]=t
if(x.gi(y)<w)throw H.b(new P.al(this))}return s},
S:function(a){return this.N(a,!0)},
dR:function(a,b,c,d){var z,y
z=this.b
if(z<0)H.A(P.Z(z,0,null,"start",null))
y=this.c
if(y!=null){if(y<0)H.A(P.Z(y,0,null,"end",null))
if(z>y)throw H.b(P.Z(z,0,y,"start",null))}},
w:{
id:function(a,b,c,d){var z=new H.ic(a,b,c,[d])
z.dR(a,b,c,d)
return z}}},
cs:{"^":"d;a,b,c,d",
gD:function(){return this.d},
v:function(){var z,y,x,w
z=this.a
y=J.t(z)
x=y.gi(z)
if(this.b!==x)throw H.b(new P.al(z))
w=this.c
if(w>=x){this.d=null
return!1}this.d=y.I(z,w);++this.c
return!0}},
bM:{"^":"e;a,b,$ti",
gH:function(a){return new H.hs(null,J.aq(this.a),this.b,this.$ti)},
gi:function(a){return J.W(this.a)},
gl:function(a){return J.E(this.a)},
I:function(a,b){return this.b.$1(J.aP(this.a,b))},
$ase:function(a,b){return[b]},
w:{
bN:function(a,b,c,d){if(!!J.n(a).$ish)return new H.cj(a,b,[c,d])
return new H.bM(a,b,[c,d])}}},
cj:{"^":"bM;a,b,$ti",$ish:1,
$ash:function(a,b){return[b]},
$ase:function(a,b){return[b]}},
hs:{"^":"bL;a,b,c,$ti",
v:function(){var z=this.b
if(z.v()){this.a=this.c.$1(z.gD())
return!0}this.a=null
return!1},
gD:function(){return this.a}},
a3:{"^":"aU;a,b,$ti",
gi:function(a){return J.W(this.a)},
I:function(a,b){return this.b.$1(J.aP(this.a,b))},
$asaU:function(a,b){return[b]},
$ash:function(a,b){return[b]},
$ase:function(a,b){return[b]}},
is:{"^":"e;a,b,$ti",
gH:function(a){return new H.it(J.aq(this.a),this.b,this.$ti)},
a3:function(a,b){return new H.bM(this,b,[H.B(this,0),null])}},
it:{"^":"bL;a,b,$ti",
v:function(){var z,y
for(z=this.a,y=this.b;z.v();)if(y.$1(z.gD())===!0)return!0
return!1},
gD:function(){return this.a.gD()}},
dW:{"^":"e;a,b,$ti",
gH:function(a){return new H.ih(J.aq(this.a),this.b,this.$ti)},
w:{
ig:function(a,b,c){if(b<0)throw H.b(P.aD(b))
if(!!J.n(a).$ish)return new H.fA(a,b,[c])
return new H.dW(a,b,[c])}}},
fA:{"^":"dW;a,b,$ti",
gi:function(a){var z,y
z=J.W(this.a)
y=this.b
if(z>y)return y
return z},
$ish:1,
$ash:null,
$ase:null},
ih:{"^":"bL;a,b,$ti",
v:function(){if(--this.b>=0)return this.a.v()
this.b=-1
return!1},
gD:function(){if(this.b<0)return
return this.a.gD()}},
dS:{"^":"e;a,b,$ti",
gH:function(a){return new H.i2(J.aq(this.a),this.b,this.$ti)},
w:{
i1:function(a,b,c){if(!!J.n(a).$ish)return new H.fz(a,H.eq(b),[c])
return new H.dS(a,H.eq(b),[c])}}},
fz:{"^":"dS;a,b,$ti",
gi:function(a){var z=J.W(this.a)-this.b
if(z>=0)return z
return 0},
$ish:1,
$ash:null,
$ase:null},
i2:{"^":"bL;a,b,$ti",
v:function(){var z,y
for(z=this.a,y=0;y<this.b;++y)z.v()
this.b=0
return z.v()},
gD:function(){return this.a.gD()}},
dr:{"^":"d;$ti",
si:function(a,b){throw H.b(new P.y("Cannot change the length of a fixed-length list"))},
u:function(a,b){throw H.b(new P.y("Cannot add to a fixed-length list"))}},
cC:{"^":"d;eg:a<",
C:function(a,b){if(b==null)return!1
return b instanceof H.cC&&J.a1(this.a,b.a)},
gF:function(a){var z,y
z=this._hashCode
if(z!=null)return z
y=J.M(this.a)
if(typeof y!=="number")return H.p(y)
z=536870911&664597*y
this._hashCode=z
return z},
j:function(a){return'Symbol("'+H.j(this.a)+'")'}}}],["","",,H,{"^":"",
bz:function(a,b){var z=a.aI(b)
if(!init.globalState.d.cy)init.globalState.f.aL()
return z},
eP:function(a,b){var z,y,x,w,v,u
z={}
z.a=b
if(b==null){b=[]
z.a=b
y=b}else y=b
if(!J.n(y).$isk)throw H.b(P.aD("Arguments to main must be a List: "+H.j(y)))
init.globalState=new H.ji(0,0,1,null,null,null,null,null,null,null,null,null,a)
y=init.globalState
x=self.window==null
w=self.Worker
v=x&&!!self.postMessage
y.x=v
v=!v
if(v)w=w!=null&&$.$get$du()!=null
else w=!0
y.y=w
y.r=x&&v
y.f=new H.iQ(P.ct(null,H.by),0)
x=P.q
y.z=new H.at(0,null,null,null,null,null,0,[x,H.cK])
y.ch=new H.at(0,null,null,null,null,null,0,[x,null])
if(y.x===!0){w=new H.jh()
y.Q=w
self.onmessage=function(c,d){return function(e){c(d,e)}}(H.h_,w)
self.dartPrint=self.dartPrint||function(c){return function(d){if(self.console&&self.console.log)self.console.log(d)
else self.postMessage(c(d))}}(H.jj)}if(init.globalState.x===!0)return
y=init.globalState.a++
w=P.av(null,null,null,x)
v=new H.bQ(0,null,!1)
u=new H.cK(y,new H.at(0,null,null,null,null,null,0,[x,H.bQ]),w,init.createNewIsolate(),v,new H.aE(H.c7()),new H.aE(H.c7()),!1,!1,[],P.av(null,null,null,null),null,null,!1,!0,P.av(null,null,null,null))
w.u(0,0)
u.bU(0,v)
init.globalState.e=u
init.globalState.d=u
if(H.aA(a,{func:1,args:[,]}))u.aI(new H.le(z,a))
else if(H.aA(a,{func:1,args:[,,]}))u.aI(new H.lf(z,a))
else u.aI(a)
init.globalState.f.aL()},
h3:function(){var z=init.currentScript
if(z!=null)return String(z.src)
if(init.globalState.x===!0)return H.h4()
return},
h4:function(){var z,y
z=new Error().stack
if(z==null){z=function(){try{throw new Error()}catch(x){return x.stack}}()
if(z==null)throw H.b(new P.y("No stack trace"))}y=z.match(new RegExp("^ *at [^(]*\\((.*):[0-9]*:[0-9]*\\)$","m"))
if(y!=null)return y[1]
y=z.match(new RegExp("^[^@]*@(.*):[0-9]*$","m"))
if(y!=null)return y[1]
throw H.b(new P.y('Cannot extract URI from "'+z+'"'))},
h_:[function(a,b){var z,y,x,w,v,u,t,s,r,q,p,o,n
z=new H.bU(!0,[]).af(b.data)
y=J.t(z)
switch(y.h(z,"command")){case"start":init.globalState.b=y.h(z,"id")
x=y.h(z,"functionName")
w=x==null?init.globalState.cx:init.globalFunctions[x]()
v=y.h(z,"args")
u=new H.bU(!0,[]).af(y.h(z,"msg"))
t=y.h(z,"isSpawnUri")
s=y.h(z,"startPaused")
r=new H.bU(!0,[]).af(y.h(z,"replyTo"))
y=init.globalState.a++
q=P.q
p=P.av(null,null,null,q)
o=new H.bQ(0,null,!1)
n=new H.cK(y,new H.at(0,null,null,null,null,null,0,[q,H.bQ]),p,init.createNewIsolate(),o,new H.aE(H.c7()),new H.aE(H.c7()),!1,!1,[],P.av(null,null,null,null),null,null,!1,!0,P.av(null,null,null,null))
p.u(0,0)
n.bU(0,o)
init.globalState.f.a.a2(new H.by(n,new H.h0(w,v,u,t,s,r),"worker-start"))
init.globalState.d=n
init.globalState.f.aL()
break
case"spawn-worker":break
case"message":if(y.h(z,"port")!=null)y.h(z,"port").aa(y.h(z,"msg"))
init.globalState.f.aL()
break
case"close":init.globalState.ch.a0(0,$.$get$dv().h(0,a))
a.terminate()
init.globalState.f.aL()
break
case"log":H.fZ(y.h(z,"msg"))
break
case"print":if(init.globalState.x===!0){y=init.globalState.Q
q=P.J(["command","print","msg",z])
q=new H.aK(!0,P.b2(null,P.q)).W(q)
y.toString
self.postMessage(q)}else P.d_(y.h(z,"msg"))
break
case"error":throw H.b(y.h(z,"msg"))}},null,null,4,0,null,75,28],
fZ:function(a){var z,y,x,w
if(init.globalState.x===!0){y=init.globalState.Q
x=P.J(["command","log","msg",a])
x=new H.aK(!0,P.b2(null,P.q)).W(x)
y.toString
self.postMessage(x)}else try{self.console.log(a)}catch(w){H.a_(w)
z=H.a6(w)
y=P.bJ(z)
throw H.b(y)}},
h1:function(a,b,c,d,e,f){var z,y,x,w
z=init.globalState.d
y=z.a
$.dK=$.dK+("_"+y)
$.dL=$.dL+("_"+y)
y=z.e
x=init.globalState.d.a
w=z.f
f.aa(["spawned",new H.bX(y,x),w,z.r])
x=new H.h2(a,b,c,d,z)
if(e===!0){z.cv(w,w)
init.globalState.f.a.a2(new H.by(z,x,"start isolate"))}else x.$0()},
jE:function(a){return new H.bU(!0,[]).af(new H.aK(!1,P.b2(null,P.q)).W(a))},
le:{"^":"c:1;a,b",
$0:function(){this.b.$1(this.a.a)}},
lf:{"^":"c:1;a,b",
$0:function(){this.b.$2(this.a.a,null)}},
ji:{"^":"d;a,b,c,d,e,f,r,x,y,z,Q,ch,cx",w:{
jj:[function(a){var z=P.J(["command","print","msg",a])
return new H.aK(!0,P.b2(null,P.q)).W(z)},null,null,2,0,null,37]}},
cK:{"^":"d;a,b,c,f2:d<,eD:e<,f,r,eX:x?,bw:y<,eF:z<,Q,ch,cx,cy,db,dx",
cv:function(a,b){if(!this.f.C(0,a))return
if(this.Q.u(0,b)&&!this.y)this.y=!0
this.bo()},
fo:function(a){var z,y,x,w,v,u
if(!this.y)return
z=this.Q
z.a0(0,a)
if(z.a===0){for(z=this.z;y=z.length,y!==0;){if(0>=y)return H.m(z,-1)
x=z.pop()
y=init.globalState.f.a
w=y.b
v=y.a
u=v.length
w=(w-1&u-1)>>>0
y.b=w
if(w<0||w>=u)return H.m(v,w)
v[w]=x
if(w===y.c)y.c4();++y.d}this.y=!1}this.bo()},
eu:function(a,b){var z,y,x
if(this.ch==null)this.ch=[]
for(z=J.n(a),y=0;x=this.ch,y<x.length;y+=2)if(z.C(a,x[y])){z=this.ch
x=y+1
if(x>=z.length)return H.m(z,x)
z[x]=b
return}x.push(a)
this.ch.push(b)},
fn:function(a){var z,y,x
if(this.ch==null)return
for(z=J.n(a),y=0;x=this.ch,y<x.length;y+=2)if(z.C(a,x[y])){z=this.ch
x=y+2
z.toString
if(typeof z!=="object"||z===null||!!z.fixed$length)H.A(new P.y("removeRange"))
P.dP(y,x,z.length,null,null,null)
z.splice(y,x-y)
return}},
dv:function(a,b){if(!this.r.C(0,a))return
this.db=b},
eR:function(a,b,c){var z=J.n(b)
if(!z.C(b,0))z=z.C(b,1)&&!this.cy
else z=!0
if(z){a.aa(c)
return}z=this.cx
if(z==null){z=P.ct(null,null)
this.cx=z}z.a2(new H.jc(a,c))},
eQ:function(a,b){var z
if(!this.r.C(0,a))return
z=J.n(b)
if(!z.C(b,0))z=z.C(b,1)&&!this.cy
else z=!0
if(z){this.by()
return}z=this.cx
if(z==null){z=P.ct(null,null)
this.cx=z}z.a2(this.gf3())},
eS:function(a,b){var z,y,x
z=this.dx
if(z.a===0){if(this.db===!0&&this===init.globalState.e)return
if(self.console&&self.console.error)self.console.error(a,b)
else{P.d_(a)
if(b!=null)P.d_(b)}return}y=new Array(2)
y.fixed$length=Array
y[0]=J.u(a)
y[1]=b==null?null:J.u(b)
for(x=new P.b1(z,z.r,null,null),x.c=z.e;x.v();)x.d.aa(y)},
aI:function(a){var z,y,x,w,v,u,t
z=init.globalState.d
init.globalState.d=this
$=this.d
y=null
x=this.cy
this.cy=!0
try{y=a.$0()}catch(u){w=H.a_(u)
v=H.a6(u)
this.eS(w,v)
if(this.db===!0){this.by()
if(this===init.globalState.e)throw u}}finally{this.cy=x
init.globalState.d=z
if(z!=null)$=z.gf2()
if(this.cx!=null)for(;t=this.cx,!t.gl(t);)this.cx.d3().$0()}return y},
eO:function(a){var z=J.t(a)
switch(z.h(a,0)){case"pause":this.cv(z.h(a,1),z.h(a,2))
break
case"resume":this.fo(z.h(a,1))
break
case"add-ondone":this.eu(z.h(a,1),z.h(a,2))
break
case"remove-ondone":this.fn(z.h(a,1))
break
case"set-errors-fatal":this.dv(z.h(a,1),z.h(a,2))
break
case"ping":this.eR(z.h(a,1),z.h(a,2),z.h(a,3))
break
case"kill":this.eQ(z.h(a,1),z.h(a,2))
break
case"getErrors":this.dx.u(0,z.h(a,1))
break
case"stopErrors":this.dx.a0(0,z.h(a,1))
break}},
bA:function(a){return this.b.h(0,a)},
bU:function(a,b){var z=this.b
if(z.ap(a))throw H.b(P.bJ("Registry: ports must be registered only once."))
z.A(0,a,b)},
bo:function(){var z=this.b
if(z.gi(z)-this.c.a>0||this.y||!this.x)init.globalState.z.A(0,this.a,this)
else this.by()},
by:[function(){var z,y,x,w,v
z=this.cx
if(z!=null)z.ao(0)
for(z=this.b,y=z.gdh(z),y=y.gH(y);y.v();)y.gD().e2()
z.ao(0)
this.c.ao(0)
init.globalState.z.a0(0,this.a)
this.dx.ao(0)
if(this.ch!=null){for(x=0;z=this.ch,y=z.length,x<y;x+=2){w=z[x]
v=x+1
if(v>=y)return H.m(z,v)
w.aa(z[v])}this.ch=null}},"$0","gf3",0,0,2]},
jc:{"^":"c:2;a,b",
$0:[function(){this.a.aa(this.b)},null,null,0,0,null,"call"]},
iQ:{"^":"d;a,b",
eG:function(){var z=this.a
if(z.b===z.c)return
return z.d3()},
d8:function(){var z,y,x
z=this.eG()
if(z==null){if(init.globalState.e!=null)if(init.globalState.z.ap(init.globalState.e.a))if(init.globalState.r===!0){y=init.globalState.e.b
y=y.gl(y)}else y=!1
else y=!1
else y=!1
if(y)H.A(P.bJ("Program exited with open ReceivePorts."))
y=init.globalState
if(y.x===!0){x=y.z
x=x.gl(x)&&y.f.b===0}else x=!1
if(x){y=y.Q
x=P.J(["command","close"])
x=new H.aK(!0,new P.en(0,null,null,null,null,null,0,[null,P.q])).W(x)
y.toString
self.postMessage(x)}return!1}z.fj()
return!0},
ck:function(){if(self.window!=null)new H.iR(this).$0()
else for(;this.d8(););},
aL:function(){var z,y,x,w,v
if(init.globalState.x!==!0)this.ck()
else try{this.ck()}catch(x){z=H.a_(x)
y=H.a6(x)
w=init.globalState.Q
v=P.J(["command","error","msg",H.j(z)+"\n"+H.j(y)])
v=new H.aK(!0,P.b2(null,P.q)).W(v)
w.toString
self.postMessage(v)}}},
iR:{"^":"c:2;a",
$0:function(){if(!this.a.d8())return
P.io(C.h,this)}},
by:{"^":"d;a,b,c",
fj:function(){var z=this.a
if(z.gbw()){z.geF().push(this)
return}z.aI(this.b)}},
jh:{"^":"d;"},
h0:{"^":"c:1;a,b,c,d,e,f",
$0:function(){H.h1(this.a,this.b,this.c,this.d,this.e,this.f)}},
h2:{"^":"c:2;a,b,c,d,e",
$0:function(){var z,y
z=this.e
z.seX(!0)
if(this.d!==!0)this.a.$1(this.c)
else{y=this.a
if(H.aA(y,{func:1,args:[,,]}))y.$2(this.b,this.c)
else if(H.aA(y,{func:1,args:[,]}))y.$1(this.b)
else y.$0()}z.bo()}},
eg:{"^":"d;"},
bX:{"^":"eg;b,a",
aa:function(a){var z,y,x
z=init.globalState.z.h(0,this.a)
if(z==null)return
y=this.b
if(y.gc8())return
x=H.jE(a)
if(z.geD()===y){z.eO(x)
return}init.globalState.f.a.a2(new H.by(z,new H.jl(this,x),"receive"))},
C:function(a,b){if(b==null)return!1
return b instanceof H.bX&&J.a1(this.b,b.b)},
gF:function(a){return this.b.gbh()}},
jl:{"^":"c:1;a,b",
$0:function(){var z=this.a.b
if(!z.gc8())z.dX(this.b)}},
cL:{"^":"eg;b,c,a",
aa:function(a){var z,y,x
z=P.J(["command","message","port",this,"msg",a])
y=new H.aK(!0,P.b2(null,P.q)).W(z)
if(init.globalState.x===!0){init.globalState.Q.toString
self.postMessage(y)}else{x=init.globalState.ch.h(0,this.b)
if(x!=null)x.postMessage(y)}},
C:function(a,b){if(b==null)return!1
return b instanceof H.cL&&J.a1(this.b,b.b)&&J.a1(this.a,b.a)&&J.a1(this.c,b.c)},
gF:function(a){var z,y,x
z=J.d1(this.b,16)
y=J.d1(this.a,8)
x=this.c
if(typeof x!=="number")return H.p(x)
return(z^y^x)>>>0}},
bQ:{"^":"d;bh:a<,b,c8:c<",
e2:function(){this.c=!0
this.b=null},
dX:function(a){if(this.c)return
this.b.$1(a)},
$ishK:1},
ij:{"^":"d;a,b,c",
dS:function(a,b){var z,y
if(a===0)z=self.setTimeout==null||init.globalState.x===!0
else z=!1
if(z){this.c=1
z=init.globalState.f
y=init.globalState.d
z.a.a2(new H.by(y,new H.il(this,b),"timer"))
this.b=!0}else if(self.setTimeout!=null){++init.globalState.f.b
this.c=self.setTimeout(H.b8(new H.im(this,b),0),a)}else throw H.b(new P.y("Timer greater than 0."))},
w:{
ik:function(a,b){var z=new H.ij(!0,!1,null)
z.dS(a,b)
return z}}},
il:{"^":"c:2;a,b",
$0:function(){this.a.c=null
this.b.$0()}},
im:{"^":"c:2;a,b",
$0:[function(){this.a.c=null;--init.globalState.f.b
this.b.$0()},null,null,0,0,null,"call"]},
aE:{"^":"d;bh:a<",
gF:function(a){var z,y,x
z=this.a
y=J.w(z)
x=y.dB(z,0)
y=y.az(z,4294967296)
if(typeof y!=="number")return H.p(y)
z=x^y
z=(~z>>>0)+(z<<15>>>0)&4294967295
z=((z^z>>>12)>>>0)*5&4294967295
z=((z^z>>>4)>>>0)*2057&4294967295
return(z^z>>>16)>>>0},
C:function(a,b){var z,y
if(b==null)return!1
if(b===this)return!0
if(b instanceof H.aE){z=this.a
y=b.a
return z==null?y==null:z===y}return!1}},
aK:{"^":"d;a,b",
W:[function(a){var z,y,x,w,v
if(a==null||typeof a==="string"||typeof a==="number"||typeof a==="boolean")return a
z=this.b
y=z.h(0,a)
if(y!=null)return["ref",y]
z.A(0,a,z.gi(z))
z=J.n(a)
if(!!z.$isdA)return["buffer",a]
if(!!z.$isbO)return["typed",a]
if(!!z.$isN)return this.dq(a)
if(!!z.$isfY){x=this.gdl()
w=a.gZ()
w=H.bN(w,x,H.L(w,"e",0),null)
w=P.aj(w,!0,H.L(w,"e",0))
z=z.gdh(a)
z=H.bN(z,x,H.L(z,"e",0),null)
return["map",w,P.aj(z,!0,H.L(z,"e",0))]}if(!!z.$ishb)return this.dr(a)
if(!!z.$isl)this.df(a)
if(!!z.$ishK)this.aN(a,"RawReceivePorts can't be transmitted:")
if(!!z.$isbX)return this.ds(a)
if(!!z.$iscL)return this.dt(a)
if(!!z.$isc){v=a.$static_name
if(v==null)this.aN(a,"Closures can't be transmitted:")
return["function",v]}if(!!z.$isaE)return["capability",a.a]
if(!(a instanceof P.d))this.df(a)
return["dart",init.classIdExtractor(a),this.dn(init.classFieldsExtractor(a))]},"$1","gdl",2,0,0,5],
aN:function(a,b){throw H.b(new P.y((b==null?"Can't transmit:":b)+" "+H.j(a)))},
df:function(a){return this.aN(a,null)},
dq:function(a){var z=this.dm(a)
if(!!a.fixed$length)return["fixed",z]
if(!a.fixed$length)return["extendable",z]
if(!a.immutable$list)return["mutable",z]
if(a.constructor===Array)return["const",z]
this.aN(a,"Can't serialize indexable: ")},
dm:function(a){var z,y,x
z=[]
C.b.si(z,a.length)
for(y=0;y<a.length;++y){x=this.W(a[y])
if(y>=z.length)return H.m(z,y)
z[y]=x}return z},
dn:function(a){var z
for(z=0;z<a.length;++z)C.b.A(a,z,this.W(a[z]))
return a},
dr:function(a){var z,y,x,w
if(!!a.constructor&&a.constructor!==Object)this.aN(a,"Only plain JS Objects are supported:")
z=Object.keys(a)
y=[]
C.b.si(y,z.length)
for(x=0;x<z.length;++x){w=this.W(a[z[x]])
if(x>=y.length)return H.m(y,x)
y[x]=w}return["js-object",z,y]},
dt:function(a){if(this.a)return["sendport",a.b,a.a,a.c]
return["raw sendport",a]},
ds:function(a){if(this.a)return["sendport",init.globalState.b,a.a,a.b.gbh()]
return["raw sendport",a]}},
bU:{"^":"d;a,b",
af:[function(a){var z,y,x,w,v,u
if(a==null||typeof a==="string"||typeof a==="number"||typeof a==="boolean")return a
if(typeof a!=="object"||a===null||a.constructor!==Array)throw H.b(P.aD("Bad serialized message: "+H.j(a)))
switch(C.b.gar(a)){case"ref":if(1>=a.length)return H.m(a,1)
z=a[1]
y=this.b
if(z>>>0!==z||z>=y.length)return H.m(y,z)
return y[z]
case"buffer":if(1>=a.length)return H.m(a,1)
x=a[1]
this.b.push(x)
return x
case"typed":if(1>=a.length)return H.m(a,1)
x=a[1]
this.b.push(x)
return x
case"fixed":if(1>=a.length)return H.m(a,1)
x=a[1]
this.b.push(x)
y=H.R(this.aH(x),[null])
y.fixed$length=Array
return y
case"extendable":if(1>=a.length)return H.m(a,1)
x=a[1]
this.b.push(x)
return H.R(this.aH(x),[null])
case"mutable":if(1>=a.length)return H.m(a,1)
x=a[1]
this.b.push(x)
return this.aH(x)
case"const":if(1>=a.length)return H.m(a,1)
x=a[1]
this.b.push(x)
y=H.R(this.aH(x),[null])
y.fixed$length=Array
return y
case"map":return this.eJ(a)
case"sendport":return this.eK(a)
case"raw sendport":if(1>=a.length)return H.m(a,1)
x=a[1]
this.b.push(x)
return x
case"js-object":return this.eI(a)
case"function":if(1>=a.length)return H.m(a,1)
x=init.globalFunctions[a[1]]()
this.b.push(x)
return x
case"capability":if(1>=a.length)return H.m(a,1)
return new H.aE(a[1])
case"dart":y=a.length
if(1>=y)return H.m(a,1)
w=a[1]
if(2>=y)return H.m(a,2)
v=a[2]
u=init.instanceFromClassId(w)
this.b.push(u)
this.aH(v)
return init.initializeEmptyInstance(w,u,v)
default:throw H.b("couldn't deserialize: "+H.j(a))}},"$1","geH",2,0,0,5],
aH:function(a){var z,y,x
z=J.t(a)
y=0
while(!0){x=z.gi(a)
if(typeof x!=="number")return H.p(x)
if(!(y<x))break
z.A(a,y,this.af(z.h(a,y)));++y}return a},
eJ:function(a){var z,y,x,w,v,u
z=a.length
if(1>=z)return H.m(a,1)
y=a[1]
if(2>=z)return H.m(a,2)
x=a[2]
w=P.hp()
this.b.push(w)
y=J.aC(y,this.geH()).S(0)
for(z=J.t(y),v=J.t(x),u=0;u<z.gi(y);++u)w.A(0,z.h(y,u),this.af(v.h(x,u)))
return w},
eK:function(a){var z,y,x,w,v,u,t
z=a.length
if(1>=z)return H.m(a,1)
y=a[1]
if(2>=z)return H.m(a,2)
x=a[2]
if(3>=z)return H.m(a,3)
w=a[3]
if(J.a1(y,init.globalState.b)){v=init.globalState.z.h(0,x)
if(v==null)return
u=v.bA(w)
if(u==null)return
t=new H.bX(u,x)}else t=new H.cL(y,w,x)
this.b.push(t)
return t},
eI:function(a){var z,y,x,w,v,u,t
z=a.length
if(1>=z)return H.m(a,1)
y=a[1]
if(2>=z)return H.m(a,2)
x=a[2]
w={}
this.b.push(w)
z=J.t(y)
v=J.t(x)
u=0
while(!0){t=z.gi(y)
if(typeof t!=="number")return H.p(t)
if(!(u<t))break
w[z.h(y,u)]=this.af(v.h(x,u));++u}return w}}}],["","",,H,{"^":"",
fl:function(){throw H.b(new P.y("Cannot modify unmodifiable Map"))},
kS:function(a){return init.types[a]},
eJ:function(a,b){var z
if(b!=null){z=b.x
if(z!=null)return z}return!!J.n(a).$isU},
j:function(a){var z
if(typeof a==="string")return a
if(typeof a==="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
z=J.u(a)
if(typeof z!=="string")throw H.b(H.H(a))
return z},
ax:function(a){var z=a.$identityHash
if(z==null){z=Math.random()*0x3fffffff|0
a.$identityHash=z}return z},
cy:function(a){var z,y,x,w,v,u,t,s
z=J.n(a)
y=z.constructor
if(typeof y=="function"){x=y.name
w=typeof x==="string"?x:null}else w=null
if(w==null||z===C.p||!!J.n(a).$isbu){v=C.j(a)
if(v==="Object"){u=a.constructor
if(typeof u=="function"){t=String(u).match(/^\s*function\s*([\w$]*)\s*\(/)
s=t==null?null:t[1]
if(typeof s==="string"&&/^\w+$/.test(s))w=s}if(w==null)w=v}else w=v}w=w
if(w.length>1&&C.a.b9(w,0)===36)w=C.a.dC(w,1)
return function(b,c){return b.replace(/[^<,> ]+/g,function(d){return c[d]||d})}(w+H.eK(H.c1(a),0,null),init.mangledGlobalNames)},
bP:function(a){return"Instance of '"+H.cy(a)+"'"},
Y:function(a){if(a.date===void 0)a.date=new Date(a.a)
return a.date},
hJ:function(a){return a.b?H.Y(a).getUTCFullYear()+0:H.Y(a).getFullYear()+0},
hH:function(a){return a.b?H.Y(a).getUTCMonth()+1:H.Y(a).getMonth()+1},
hD:function(a){return a.b?H.Y(a).getUTCDate()+0:H.Y(a).getDate()+0},
hE:function(a){return a.b?H.Y(a).getUTCHours()+0:H.Y(a).getHours()+0},
hG:function(a){return a.b?H.Y(a).getUTCMinutes()+0:H.Y(a).getMinutes()+0},
hI:function(a){return a.b?H.Y(a).getUTCSeconds()+0:H.Y(a).getSeconds()+0},
hF:function(a){return a.b?H.Y(a).getUTCMilliseconds()+0:H.Y(a).getMilliseconds()+0},
cx:function(a,b){if(a==null||typeof a==="boolean"||typeof a==="number"||typeof a==="string")throw H.b(H.H(a))
return a[b]},
dM:function(a,b,c){if(a==null||typeof a==="boolean"||typeof a==="number"||typeof a==="string")throw H.b(H.H(a))
a[b]=c},
dJ:function(a,b,c){var z,y,x
z={}
z.a=0
y=[]
x=[]
z.a=b.length
C.b.T(y,b)
z.b=""
if(c!=null&&!c.gl(c))c.a8(0,new H.hC(z,y,x))
return J.f3(a,new H.h9(C.z,""+"$"+z.a+z.b,0,y,x,null))},
hB:function(a,b){var z,y
z=b instanceof Array?b:P.aj(b,!0,null)
y=z.length
if(y===0){if(!!a.$0)return a.$0()}else if(y===1){if(!!a.$1)return a.$1(z[0])}else if(y===2){if(!!a.$2)return a.$2(z[0],z[1])}else if(y===3){if(!!a.$3)return a.$3(z[0],z[1],z[2])}else if(y===4){if(!!a.$4)return a.$4(z[0],z[1],z[2],z[3])}else if(y===5)if(!!a.$5)return a.$5(z[0],z[1],z[2],z[3],z[4])
return H.hA(a,z)},
hA:function(a,b){var z,y,x,w,v,u
z=b.length
y=a[""+"$"+z]
if(y==null){y=J.n(a)["call*"]
if(y==null)return H.dJ(a,b,null)
x=H.dQ(y)
w=x.d
v=w+x.e
if(x.f||w>z||v<z)return H.dJ(a,b,null)
b=P.aj(b,!0,null)
for(u=z;u<v;++u)C.b.u(b,init.metadata[x.eE(0,u)])}return y.apply(a,b)},
p:function(a){throw H.b(H.H(a))},
m:function(a,b){if(a==null)J.W(a)
throw H.b(H.K(a,b))},
K:function(a,b){var z,y
if(typeof b!=="number"||Math.floor(b)!==b)return new P.ar(!0,b,"index",null)
z=J.W(a)
if(!(b<0)){if(typeof z!=="number")return H.p(z)
y=b>=z}else y=!0
if(y)return P.ac(b,a,"index",null,z)
return P.bo(b,"index",null)},
H:function(a){return new P.ar(!0,a,null,null)},
v:function(a){if(typeof a!=="number")throw H.b(H.H(a))
return a},
b7:function(a){if(typeof a!=="string")throw H.b(H.H(a))
return a},
b:function(a){var z
if(a==null)a=new P.dH()
z=new Error()
z.dartException=a
if("defineProperty" in Object){Object.defineProperty(z,"message",{get:H.eQ})
z.name=""}else z.toString=H.eQ
return z},
eQ:[function(){return J.u(this.dartException)},null,null,0,0,null],
A:function(a){throw H.b(a)},
bB:function(a){throw H.b(new P.al(a))},
a_:function(a){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l
z=new H.li(a)
if(a==null)return
if(typeof a!=="object")return a
if("dartException" in a)return z.$1(a.dartException)
else if(!("message" in a))return a
y=a.message
if("number" in a&&typeof a.number=="number"){x=a.number
w=x&65535
if((C.e.cp(x,16)&8191)===10)switch(w){case 438:return z.$1(H.cq(H.j(y)+" (Error "+w+")",null))
case 445:case 5007:v=H.j(y)+" (Error "+w+")"
return z.$1(new H.dG(v,null))}}if(a instanceof TypeError){u=$.$get$e_()
t=$.$get$e0()
s=$.$get$e1()
r=$.$get$e2()
q=$.$get$e6()
p=$.$get$e7()
o=$.$get$e4()
$.$get$e3()
n=$.$get$e9()
m=$.$get$e8()
l=u.a_(y)
if(l!=null)return z.$1(H.cq(y,l))
else{l=t.a_(y)
if(l!=null){l.method="call"
return z.$1(H.cq(y,l))}else{l=s.a_(y)
if(l==null){l=r.a_(y)
if(l==null){l=q.a_(y)
if(l==null){l=p.a_(y)
if(l==null){l=o.a_(y)
if(l==null){l=r.a_(y)
if(l==null){l=n.a_(y)
if(l==null){l=m.a_(y)
v=l!=null}else v=!0}else v=!0}else v=!0}else v=!0}else v=!0}else v=!0}else v=!0
if(v)return z.$1(new H.dG(y,l==null?null:l.method))}}return z.$1(new H.ir(typeof y==="string"?y:""))}if(a instanceof RangeError){if(typeof y==="string"&&y.indexOf("call stack")!==-1)return new P.dU()
y=function(b){try{return String(b)}catch(k){}return null}(a)
return z.$1(new P.ar(!1,null,null,typeof y==="string"?y.replace(/^RangeError:\s*/,""):y))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof y==="string"&&y==="too much recursion")return new P.dU()
return a},
a6:function(a){var z
if(a==null)return new H.eo(a,null)
z=a.$cachedTrace
if(z!=null)return z
return a.$cachedTrace=new H.eo(a,null)},
c6:function(a){if(a==null||typeof a!='object')return J.M(a)
else return H.ax(a)},
kQ:function(a,b){var z,y,x,w
z=a.length
for(y=0;y<z;y=w){x=y+1
w=x+1
b.A(0,a[y],a[x])}return b},
kZ:[function(a,b,c,d,e,f,g){switch(c){case 0:return H.bz(b,new H.l_(a))
case 1:return H.bz(b,new H.l0(a,d))
case 2:return H.bz(b,new H.l1(a,d,e))
case 3:return H.bz(b,new H.l2(a,d,e,f))
case 4:return H.bz(b,new H.l3(a,d,e,f,g))}throw H.b(P.bJ("Unsupported number of arguments for wrapped closure"))},null,null,14,0,null,74,67,65,64,51,35,48],
b8:function(a,b){var z
if(a==null)return
z=a.$identity
if(!!z)return z
z=function(c,d,e,f){return function(g,h,i,j){return f(c,e,d,g,h,i,j)}}(a,b,init.globalState.d,H.kZ)
a.$identity=z
return z},
fi:function(a,b,c,d,e,f){var z,y,x,w,v,u,t,s,r,q,p,o,n,m
z=b[0]
y=z.$callName
if(!!J.n(c).$isk){z.$reflectionInfo=c
x=H.dQ(z).r}else x=c
w=d?Object.create(new H.i4().constructor.prototype):Object.create(new H.ch(null,null,null,null).constructor.prototype)
w.$initialize=w.constructor
if(d)v=function(){this.$initialize()}
else{u=$.ah
$.ah=J.G(u,1)
v=new Function("a,b,c,d"+u,"this.$initialize(a,b,c,d"+u+")")}w.constructor=v
v.prototype=w
if(!d){t=e.length==1&&!0
s=H.df(a,z,t)
s.$reflectionInfo=c}else{w.$static_name=f
s=z
t=!1}if(typeof x=="number")r=function(g,h){return function(){return g(h)}}(H.kS,x)
else if(typeof x=="function")if(d)r=x
else{q=t?H.de:H.ci
r=function(g,h){return function(){return g.apply({$receiver:h(this)},arguments)}}(x,q)}else throw H.b("Error in reflectionInfo.")
w.$S=r
w[y]=s
for(u=b.length,p=1;p<u;++p){o=b[p]
n=o.$callName
if(n!=null){m=d?o:H.df(a,o,t)
w[n]=m}}w["call*"]=s
w.$R=z.$R
w.$D=z.$D
return v},
ff:function(a,b,c,d){var z=H.ci
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,z)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,z)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,z)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,z)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,z)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,z)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,z)}},
df:function(a,b,c){var z,y,x,w,v,u,t
if(c)return H.fh(a,b)
z=b.$stubName
y=b.length
x=a[z]
w=b==null?x==null:b===x
v=!w||y>=27
if(v)return H.ff(y,!w,z,b)
if(y===0){w=$.ah
$.ah=J.G(w,1)
u="self"+H.j(w)
w="return function(){var "+u+" = this."
v=$.aQ
if(v==null){v=H.bG("self")
$.aQ=v}return new Function(w+H.j(v)+";return "+u+"."+H.j(z)+"();}")()}t="abcdefghijklmnopqrstuvwxyz".split("").splice(0,y).join(",")
w=$.ah
$.ah=J.G(w,1)
t+=H.j(w)
w="return function("+t+"){return this."
v=$.aQ
if(v==null){v=H.bG("self")
$.aQ=v}return new Function(w+H.j(v)+"."+H.j(z)+"("+t+");}")()},
fg:function(a,b,c,d){var z,y
z=H.ci
y=H.de
switch(b?-1:a){case 0:throw H.b(new H.hN("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,z,y)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,z,y)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,z,y)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,z,y)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,z,y)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,z,y)
default:return function(e,f,g,h){return function(){h=[g(this)]
Array.prototype.push.apply(h,arguments)
return e.apply(f(this),h)}}(d,z,y)}},
fh:function(a,b){var z,y,x,w,v,u,t,s
z=H.fb()
y=$.dd
if(y==null){y=H.bG("receiver")
$.dd=y}x=b.$stubName
w=b.length
v=a[x]
u=b==null?v==null:b===v
t=!u||w>=28
if(t)return H.fg(w,!u,x,b)
if(w===1){y="return function(){return this."+H.j(z)+"."+H.j(x)+"(this."+H.j(y)+");"
u=$.ah
$.ah=J.G(u,1)
return new Function(y+H.j(u)+"}")()}s="abcdefghijklmnopqrstuvwxyz".split("").splice(0,w-1).join(",")
y="return function("+s+"){return this."+H.j(z)+"."+H.j(x)+"(this."+H.j(y)+", "+s+");"
u=$.ah
$.ah=J.G(u,1)
return new Function(y+H.j(u)+"}")()},
cT:function(a,b,c,d,e,f){var z
b.fixed$length=Array
if(!!J.n(c).$isk){c.fixed$length=Array
z=c}else z=c
return H.fi(a,b,z,!!d,e,f)},
ld:function(a,b){var z=J.t(b)
throw H.b(H.fe(H.cy(a),z.b3(b,3,z.gi(b))))},
bA:function(a,b){var z
if(a!=null)z=(typeof a==="object"||typeof a==="function")&&J.n(a)[b]
else z=!0
if(z)return a
H.ld(a,b)},
kO:function(a){var z=J.n(a)
return"$S" in z?z.$S():null},
aA:function(a,b){var z
if(a==null)return!1
z=H.kO(a)
return z==null?!1:H.eI(z,b)},
lh:function(a){throw H.b(new P.fr(a))},
c7:function(){return(Math.random()*0x100000000>>>0)+(Math.random()*0x100000000>>>0)*4294967296},
cV:function(a){return init.getIsolateTag(a)},
R:function(a,b){a.$ti=b
return a},
c1:function(a){if(a==null)return
return a.$ti},
eH:function(a,b){return H.d0(a["$as"+H.j(b)],H.c1(a))},
L:function(a,b,c){var z=H.eH(a,b)
return z==null?null:z[c]},
B:function(a,b){var z=H.c1(a)
return z==null?null:z[b]},
aO:function(a,b){var z
if(a==null)return"dynamic"
if(typeof a==="object"&&a!==null&&a.constructor===Array)return a[0].builtin$cls+H.eK(a,1,b)
if(typeof a=="function")return a.builtin$cls
if(typeof a==="number"&&Math.floor(a)===a)return H.j(a)
if(typeof a.func!="undefined"){z=a.typedef
if(z!=null)return H.aO(z,b)
return H.jI(a,b)}return"unknown-reified-type"},
jI:function(a,b){var z,y,x,w,v,u,t,s,r,q,p
z=!!a.v?"void":H.aO(a.ret,b)
if("args" in a){y=a.args
for(x=y.length,w="",v="",u=0;u<x;++u,v=", "){t=y[u]
w=w+v+H.aO(t,b)}}else{w=""
v=""}if("opt" in a){s=a.opt
w+=v+"["
for(x=s.length,v="",u=0;u<x;++u,v=", "){t=s[u]
w=w+v+H.aO(t,b)}w+="]"}if("named" in a){r=a.named
w+=v+"{"
for(x=H.kP(r),q=x.length,v="",u=0;u<q;++u,v=", "){p=x[u]
w=w+v+H.aO(r[p],b)+(" "+H.j(p))}w+="}"}return"("+w+") => "+z},
eK:function(a,b,c){var z,y,x,w,v,u
if(a==null)return""
z=new P.bR("")
for(y=b,x=!0,w=!0,v="";y<a.length;++y){if(x)x=!1
else z.E=v+", "
u=a[y]
if(u!=null)w=!1
v=z.E+=H.aO(u,c)}return w?"":"<"+z.j(0)+">"},
d0:function(a,b){if(a==null)return b
a=a.apply(null,b)
if(a==null)return
if(typeof a==="object"&&a!==null&&a.constructor===Array)return a
if(typeof a=="function")return a.apply(null,b)
return b},
eE:function(a,b,c,d){var z,y
if(a==null)return!1
z=H.c1(a)
y=J.n(a)
if(y[b]==null)return!1
return H.eB(H.d0(y[d],z),c)},
eB:function(a,b){var z,y
if(a==null||b==null)return!0
z=a.length
for(y=0;y<z;++y)if(!H.a7(a[y],b[y]))return!1
return!0},
eF:function(a,b,c){return a.apply(b,H.eH(b,c))},
a7:function(a,b){var z,y,x,w,v,u
if(a===b)return!0
if(a==null||b==null)return!0
if(a.builtin$cls==="aV")return!0
if('func' in b)return H.eI(a,b)
if('func' in a)return b.builtin$cls==="cl"||b.builtin$cls==="d"
z=typeof a==="object"&&a!==null&&a.constructor===Array
y=z?a[0]:a
x=typeof b==="object"&&b!==null&&b.constructor===Array
w=x?b[0]:b
if(w!==y){v=H.aO(w,null)
if(!('$is'+v in y.prototype))return!1
u=y.prototype["$as"+v]}else u=null
if(!z&&u==null||!x)return!0
z=z?a.slice(1):null
x=b.slice(1)
return H.eB(H.d0(u,z),x)},
eA:function(a,b,c){var z,y,x,w,v
z=b==null
if(z&&a==null)return!0
if(z)return c
if(a==null)return!1
y=a.length
x=b.length
if(c){if(y<x)return!1}else if(y!==x)return!1
for(w=0;w<x;++w){z=a[w]
v=b[w]
if(!(H.a7(z,v)||H.a7(v,z)))return!1}return!0},
kH:function(a,b){var z,y,x,w,v,u
if(b==null)return!0
if(a==null)return!1
z=Object.getOwnPropertyNames(b)
z.fixed$length=Array
y=z
for(z=y.length,x=0;x<z;++x){w=y[x]
if(!Object.hasOwnProperty.call(a,w))return!1
v=b[w]
u=a[w]
if(!(H.a7(v,u)||H.a7(u,v)))return!1}return!0},
eI:function(a,b){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l
if(!('func' in a))return!1
if("v" in a){if(!("v" in b)&&"ret" in b)return!1}else if(!("v" in b)){z=a.ret
y=b.ret
if(!(H.a7(z,y)||H.a7(y,z)))return!1}x=a.args
w=b.args
v=a.opt
u=b.opt
t=x!=null?x.length:0
s=w!=null?w.length:0
r=v!=null?v.length:0
q=u!=null?u.length:0
if(t>s)return!1
if(t+r<s+q)return!1
if(t===s){if(!H.eA(x,w,!1))return!1
if(!H.eA(v,u,!0))return!1}else{for(p=0;p<t;++p){o=x[p]
n=w[p]
if(!(H.a7(o,n)||H.a7(n,o)))return!1}for(m=p,l=0;m<s;++l,++m){o=v[l]
n=w[m]
if(!(H.a7(o,n)||H.a7(n,o)))return!1}for(m=0;m<q;++l,++m){o=v[l]
n=u[m]
if(!(H.a7(o,n)||H.a7(n,o)))return!1}}return H.kH(a.named,b.named)},
mV:function(a){var z=$.cW
return"Instance of "+(z==null?"<Unknown>":z.$1(a))},
mT:function(a){return H.ax(a)},
mS:function(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
l6:function(a){var z,y,x,w,v,u
z=$.cW.$1(a)
y=$.c_[z]
if(y!=null){Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}x=$.c2[z]
if(x!=null)return x
w=init.interceptorsByTag[z]
if(w==null){z=$.ez.$2(a,z)
if(z!=null){y=$.c_[z]
if(y!=null){Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}x=$.c2[z]
if(x!=null)return x
w=init.interceptorsByTag[z]}}if(w==null)return
x=w.prototype
v=z[0]
if(v==="!"){y=H.cZ(x)
$.c_[z]=y
Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}if(v==="~"){$.c2[z]=x
return x}if(v==="-"){u=H.cZ(x)
Object.defineProperty(Object.getPrototypeOf(a),init.dispatchPropertyName,{value:u,enumerable:false,writable:true,configurable:true})
return u.i}if(v==="+")return H.eM(a,x)
if(v==="*")throw H.b(new P.eb(z))
if(init.leafTags[z]===true){u=H.cZ(x)
Object.defineProperty(Object.getPrototypeOf(a),init.dispatchPropertyName,{value:u,enumerable:false,writable:true,configurable:true})
return u.i}else return H.eM(a,x)},
eM:function(a,b){var z=Object.getPrototypeOf(a)
Object.defineProperty(z,init.dispatchPropertyName,{value:J.c5(b,z,null,null),enumerable:false,writable:true,configurable:true})
return b},
cZ:function(a){return J.c5(a,!1,null,!!a.$isU)},
lb:function(a,b,c){var z=b.prototype
if(init.leafTags[a]===true)return J.c5(z,!1,null,!!z.$isU)
else return J.c5(z,c,null,null)},
kX:function(){if(!0===$.cX)return
$.cX=!0
H.kY()},
kY:function(){var z,y,x,w,v,u,t,s
$.c_=Object.create(null)
$.c2=Object.create(null)
H.kT()
z=init.interceptorsByTag
y=Object.getOwnPropertyNames(z)
if(typeof window!="undefined"){window
x=function(){}
for(w=0;w<y.length;++w){v=y[w]
u=$.eN.$1(v)
if(u!=null){t=H.lb(v,z[v],u)
if(t!=null){Object.defineProperty(u,init.dispatchPropertyName,{value:t,enumerable:false,writable:true,configurable:true})
x.prototype=u}}}}for(w=0;w<y.length;++w){v=y[w]
if(/^[A-Za-z_]/.test(v)){s=z[v]
z["!"+v]=s
z["~"+v]=s
z["-"+v]=s
z["+"+v]=s
z["*"+v]=s}}},
kT:function(){var z,y,x,w,v,u,t
z=C.u()
z=H.aM(C.q,H.aM(C.w,H.aM(C.i,H.aM(C.i,H.aM(C.v,H.aM(C.r,H.aM(C.t(C.j),z)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){y=dartNativeDispatchHooksTransformer
if(typeof y=="function")y=[y]
if(y.constructor==Array)for(x=0;x<y.length;++x){w=y[x]
if(typeof w=="function")z=w(z)||z}}v=z.getTag
u=z.getUnknownTag
t=z.prototypeForTag
$.cW=new H.kU(v)
$.ez=new H.kV(u)
$.eN=new H.kW(t)},
aM:function(a,b){return a(b)||b},
lg:function(a,b,c){var z=a.indexOf(b,c)
return z>=0},
fk:{"^":"ec;a,$ti",$asec:I.Q,$asad:I.Q,$isad:1},
fj:{"^":"d;",
gl:function(a){return this.gi(this)===0},
j:function(a){return P.dy(this)},
A:function(a,b,c){return H.fl()},
$isad:1},
fm:{"^":"fj;a,b,c,$ti",
gi:function(a){return this.a},
ap:function(a){if(typeof a!=="string")return!1
if("__proto__"===a)return!1
return this.b.hasOwnProperty(a)},
h:function(a,b){if(!this.ap(b))return
return this.c3(b)},
c3:function(a){return this.b[a]},
a8:function(a,b){var z,y,x,w
z=this.c
for(y=z.length,x=0;x<y;++x){w=z[x]
b.$2(w,this.c3(w))}},
gZ:function(){return new H.iI(this,[H.B(this,0)])}},
iI:{"^":"e;a,$ti",
gH:function(a){var z=this.a.c
return new J.bE(z,z.length,0,null)},
gi:function(a){return this.a.c.length}},
h9:{"^":"d;a,b,c,d,e,f",
gcU:function(){var z=this.a
return z},
gd1:function(){var z,y,x,w
if(this.c===1)return C.k
z=this.d
y=z.length-this.e.length
if(y===0)return C.k
x=[]
for(w=0;w<y;++w){if(w>=z.length)return H.m(z,w)
x.push(z[w])}x.fixed$length=Array
x.immutable$list=Array
return x},
gcY:function(){var z,y,x,w,v,u,t,s,r
if(this.c!==0)return C.l
z=this.e
y=z.length
x=this.d
w=x.length-y
if(y===0)return C.l
v=P.bs
u=new H.at(0,null,null,null,null,null,0,[v,null])
for(t=0;t<y;++t){if(t>=z.length)return H.m(z,t)
s=z[t]
r=w+t
if(r<0||r>=x.length)return H.m(x,r)
u.A(0,new H.cC(s),x[r])}return new H.fk(u,[v,null])}},
hM:{"^":"d;a,b,c,d,e,f,r,x",
eE:function(a,b){var z=this.d
if(typeof b!=="number")return b.L()
if(b<z)return
return this.b[3+b-z]},
w:{
dQ:function(a){var z,y,x
z=a.$reflectionInfo
if(z==null)return
z.fixed$length=Array
z=z
y=z[0]
x=z[1]
return new H.hM(a,z,(y&1)===1,y>>1,x>>1,(x&1)===1,z[2],null)}}},
hC:{"^":"c:18;a,b,c",
$2:function(a,b){var z=this.a
z.b=z.b+"$"+H.j(a)
this.c.push(a)
this.b.push(b);++z.a}},
iq:{"^":"d;a,b,c,d,e,f",
a_:function(a){var z,y,x
z=new RegExp(this.a).exec(a)
if(z==null)return
y=Object.create(null)
x=this.b
if(x!==-1)y.arguments=z[x+1]
x=this.c
if(x!==-1)y.argumentsExpr=z[x+1]
x=this.d
if(x!==-1)y.expr=z[x+1]
x=this.e
if(x!==-1)y.method=z[x+1]
x=this.f
if(x!==-1)y.receiver=z[x+1]
return y},
w:{
ak:function(a){var z,y,x,w,v,u
a=a.replace(String({}),'$receiver$').replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
z=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(z==null)z=[]
y=z.indexOf("\\$arguments\\$")
x=z.indexOf("\\$argumentsExpr\\$")
w=z.indexOf("\\$expr\\$")
v=z.indexOf("\\$method\\$")
u=z.indexOf("\\$receiver\\$")
return new H.iq(a.replace(new RegExp('\\\\\\$arguments\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$argumentsExpr\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$expr\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$method\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$receiver\\\\\\$','g'),'((?:x|[^x])*)'),y,x,w,v,u)},
bS:function(a){return function($expr$){var $argumentsExpr$='$arguments$'
try{$expr$.$method$($argumentsExpr$)}catch(z){return z.message}}(a)},
e5:function(a){return function($expr$){try{$expr$.$method$}catch(z){return z.message}}(a)}}},
dG:{"^":"P;a,b",
j:function(a){var z=this.b
if(z==null)return"NullError: "+H.j(this.a)
return"NullError: method not found: '"+H.j(z)+"' on null"}},
hi:{"^":"P;a,b,c",
j:function(a){var z,y
z=this.b
if(z==null)return"NoSuchMethodError: "+H.j(this.a)
y=this.c
if(y==null)return"NoSuchMethodError: method not found: '"+z+"' ("+H.j(this.a)+")"
return"NoSuchMethodError: method not found: '"+z+"' on '"+y+"' ("+H.j(this.a)+")"},
w:{
cq:function(a,b){var z,y
z=b==null
y=z?null:b.method
return new H.hi(a,y,z?null:b.receiver)}}},
ir:{"^":"P;a",
j:function(a){var z=this.a
return z.length===0?"Error":"Error: "+z}},
li:{"^":"c:0;a",
$1:function(a){if(!!J.n(a).$isP)if(a.$thrownJsError==null)a.$thrownJsError=this.a
return a}},
eo:{"^":"d;a,b",
j:function(a){var z,y
z=this.b
if(z!=null)return z
z=this.a
y=z!==null&&typeof z==="object"?z.stack:null
z=y==null?"":y
this.b=z
return z}},
l_:{"^":"c:1;a",
$0:function(){return this.a.$0()}},
l0:{"^":"c:1;a,b",
$0:function(){return this.a.$1(this.b)}},
l1:{"^":"c:1;a,b,c",
$0:function(){return this.a.$2(this.b,this.c)}},
l2:{"^":"c:1;a,b,c,d",
$0:function(){return this.a.$3(this.b,this.c,this.d)}},
l3:{"^":"c:1;a,b,c,d,e",
$0:function(){return this.a.$4(this.b,this.c,this.d,this.e)}},
c:{"^":"d;",
j:function(a){return"Closure '"+H.cy(this).trim()+"'"},
gdi:function(){return this},
$iscl:1,
gdi:function(){return this}},
dX:{"^":"c;"},
i4:{"^":"dX;",
j:function(a){var z=this.$static_name
if(z==null)return"Closure of unknown static method"
return"Closure '"+z+"'"}},
ch:{"^":"dX;a,b,c,d",
C:function(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof H.ch))return!1
return this.a===b.a&&this.b===b.b&&this.c===b.c},
gF:function(a){var z,y
z=this.c
if(z==null)y=H.ax(this.a)
else y=typeof z!=="object"?J.M(z):H.ax(z)
return J.eU(y,H.ax(this.b))},
j:function(a){var z=this.c
if(z==null)z=this.a
return"Closure '"+H.j(this.d)+"' of "+H.bP(z)},
w:{
ci:function(a){return a.a},
de:function(a){return a.c},
fb:function(){var z=$.aQ
if(z==null){z=H.bG("self")
$.aQ=z}return z},
bG:function(a){var z,y,x,w,v
z=new H.ch("self","target","receiver","name")
y=Object.getOwnPropertyNames(z)
y.fixed$length=Array
x=y
for(y=x.length,w=0;w<y;++w){v=x[w]
if(z[v]===a)return v}}}},
fd:{"^":"P;a",
j:function(a){return this.a},
w:{
fe:function(a,b){return new H.fd("CastError: Casting value of type '"+a+"' to incompatible type '"+b+"'")}}},
hN:{"^":"P;a",
j:function(a){return"RuntimeError: "+H.j(this.a)}},
at:{"^":"d;a,b,c,d,e,f,r,$ti",
gi:function(a){return this.a},
gl:function(a){return this.a===0},
gZ:function(){return new H.hn(this,[H.B(this,0)])},
gdh:function(a){return H.bN(this.gZ(),new H.hh(this),H.B(this,0),H.B(this,1))},
ap:function(a){var z,y
if(typeof a==="string"){z=this.b
if(z==null)return!1
return this.c1(z,a)}else if(typeof a==="number"&&(a&0x3ffffff)===a){y=this.c
if(y==null)return!1
return this.c1(y,a)}else return this.eY(a)},
eY:function(a){var z=this.d
if(z==null)return!1
return this.aK(this.aS(z,this.aJ(a)),a)>=0},
h:function(a,b){var z,y,x
if(typeof b==="string"){z=this.b
if(z==null)return
y=this.aB(z,b)
return y==null?null:y.gah()}else if(typeof b==="number"&&(b&0x3ffffff)===b){x=this.c
if(x==null)return
y=this.aB(x,b)
return y==null?null:y.gah()}else return this.eZ(b)},
eZ:function(a){var z,y,x
z=this.d
if(z==null)return
y=this.aS(z,this.aJ(a))
x=this.aK(y,a)
if(x<0)return
return y[x].gah()},
A:function(a,b,c){var z,y,x,w,v,u
if(typeof b==="string"){z=this.b
if(z==null){z=this.bk()
this.b=z}this.bT(z,b,c)}else if(typeof b==="number"&&(b&0x3ffffff)===b){y=this.c
if(y==null){y=this.bk()
this.c=y}this.bT(y,b,c)}else{x=this.d
if(x==null){x=this.bk()
this.d=x}w=this.aJ(b)
v=this.aS(x,w)
if(v==null)this.bn(x,w,[this.bl(b,c)])
else{u=this.aK(v,b)
if(u>=0)v[u].sah(c)
else v.push(this.bl(b,c))}}},
a0:function(a,b){if(typeof b==="string")return this.ci(this.b,b)
else if(typeof b==="number"&&(b&0x3ffffff)===b)return this.ci(this.c,b)
else return this.f_(b)},
f_:function(a){var z,y,x,w
z=this.d
if(z==null)return
y=this.aS(z,this.aJ(a))
x=this.aK(y,a)
if(x<0)return
w=y.splice(x,1)[0]
this.cs(w)
return w.gah()},
ao:function(a){if(this.a>0){this.f=null
this.e=null
this.d=null
this.c=null
this.b=null
this.a=0
this.r=this.r+1&67108863}},
a8:function(a,b){var z,y
z=this.e
y=this.r
for(;z!=null;){b.$2(z.a,z.b)
if(y!==this.r)throw H.b(new P.al(this))
z=z.c}},
bT:function(a,b,c){var z=this.aB(a,b)
if(z==null)this.bn(a,b,this.bl(b,c))
else z.sah(c)},
ci:function(a,b){var z
if(a==null)return
z=this.aB(a,b)
if(z==null)return
this.cs(z)
this.c2(a,b)
return z.gah()},
bl:function(a,b){var z,y
z=new H.hm(a,b,null,null)
if(this.e==null){this.f=z
this.e=z}else{y=this.f
z.d=y
y.c=z
this.f=z}++this.a
this.r=this.r+1&67108863
return z},
cs:function(a){var z,y
z=a.gei()
y=a.geh()
if(z==null)this.e=y
else z.c=y
if(y==null)this.f=z
else y.d=z;--this.a
this.r=this.r+1&67108863},
aJ:function(a){return J.M(a)&0x3ffffff},
aK:function(a,b){var z,y
if(a==null)return-1
z=a.length
for(y=0;y<z;++y)if(J.a1(a[y].gcP(),b))return y
return-1},
j:function(a){return P.dy(this)},
aB:function(a,b){return a[b]},
aS:function(a,b){return a[b]},
bn:function(a,b,c){a[b]=c},
c2:function(a,b){delete a[b]},
c1:function(a,b){return this.aB(a,b)!=null},
bk:function(){var z=Object.create(null)
this.bn(z,"<non-identifier-key>",z)
this.c2(z,"<non-identifier-key>")
return z},
$isfY:1,
$isad:1},
hh:{"^":"c:0;a",
$1:[function(a){return this.a.h(0,a)},null,null,2,0,null,47,"call"]},
hm:{"^":"d;cP:a<,ah:b@,eh:c<,ei:d<"},
hn:{"^":"h;a,$ti",
gi:function(a){return this.a.a},
gl:function(a){return this.a.a===0},
gH:function(a){var z,y
z=this.a
y=new H.ho(z,z.r,null,null)
y.c=z.e
return y}},
ho:{"^":"d;a,b,c,d",
gD:function(){return this.d},
v:function(){var z=this.a
if(this.b!==z.r)throw H.b(new P.al(z))
else{z=this.c
if(z==null){this.d=null
return!1}else{this.d=z.a
this.c=z.c
return!0}}}},
kU:{"^":"c:0;a",
$1:function(a){return this.a(a)}},
kV:{"^":"c:19;a",
$2:function(a,b){return this.a(a,b)}},
kW:{"^":"c:20;a",
$1:function(a){return this.a(a)}},
he:{"^":"d;a,b,c,d",
j:function(a){return"RegExp/"+this.a+"/"},
w:{
hf:function(a,b,c,d){var z,y,x,w
z=b?"m":""
y=c?"":"i"
x=d?"g":""
w=function(e,f){try{return new RegExp(e,f)}catch(v){return v}}(a,z+y+x)
if(w instanceof RegExp)return w
throw H.b(new P.fH("Illegal RegExp pattern ("+String(w)+")",a,null))}}}}],["","",,H,{"^":"",
kP:function(a){var z=H.R(a?Object.keys(a):[],[null])
z.fixed$length=Array
return z}}],["","",,H,{"^":"",
lc:function(a){if(typeof dartPrint=="function"){dartPrint(a)
return}if(typeof console=="object"&&typeof console.log!="undefined"){console.log(a)
return}if(typeof window=="object")return
if(typeof print=="function"){print(a)
return}throw"Unable to print message: "+String(a)}}],["","",,H,{"^":"",dA:{"^":"l;",$isdA:1,"%":"ArrayBuffer"},bO:{"^":"l;",$isbO:1,$isa8:1,"%":";ArrayBufferView;cu|dB|dD|cv|dC|dE|aw"},m7:{"^":"bO;",$isa8:1,"%":"DataView"},cu:{"^":"bO;",
gi:function(a){return a.length},
$isU:1,
$asU:I.Q,
$isN:1,
$asN:I.Q},cv:{"^":"dD;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
A:function(a,b,c){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
a[b]=c}},dB:{"^":"cu+a5;",$asU:I.Q,$asN:I.Q,
$ask:function(){return[P.a9]},
$ash:function(){return[P.a9]},
$ase:function(){return[P.a9]},
$isk:1,
$ish:1,
$ise:1},dD:{"^":"dB+dr;",$asU:I.Q,$asN:I.Q,
$ask:function(){return[P.a9]},
$ash:function(){return[P.a9]},
$ase:function(){return[P.a9]}},aw:{"^":"dE;",
A:function(a,b,c){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
a[b]=c},
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]}},dC:{"^":"cu+a5;",$asU:I.Q,$asN:I.Q,
$ask:function(){return[P.q]},
$ash:function(){return[P.q]},
$ase:function(){return[P.q]},
$isk:1,
$ish:1,
$ise:1},dE:{"^":"dC+dr;",$asU:I.Q,$asN:I.Q,
$ask:function(){return[P.q]},
$ash:function(){return[P.q]},
$ase:function(){return[P.q]}},m8:{"^":"cv;",$isa8:1,$isk:1,
$ask:function(){return[P.a9]},
$ish:1,
$ash:function(){return[P.a9]},
$ise:1,
$ase:function(){return[P.a9]},
"%":"Float32Array"},m9:{"^":"cv;",$isa8:1,$isk:1,
$ask:function(){return[P.a9]},
$ish:1,
$ash:function(){return[P.a9]},
$ise:1,
$ase:function(){return[P.a9]},
"%":"Float64Array"},ma:{"^":"aw;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
$isa8:1,
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]},
"%":"Int16Array"},mb:{"^":"aw;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
$isa8:1,
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]},
"%":"Int32Array"},mc:{"^":"aw;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
$isa8:1,
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]},
"%":"Int8Array"},md:{"^":"aw;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
$isa8:1,
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]},
"%":"Uint16Array"},me:{"^":"aw;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
$isa8:1,
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]},
"%":"Uint32Array"},mf:{"^":"aw;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
$isa8:1,
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]},
"%":"CanvasPixelArray|Uint8ClampedArray"},mg:{"^":"aw;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)H.A(H.K(a,b))
return a[b]},
$isa8:1,
$isk:1,
$ask:function(){return[P.q]},
$ish:1,
$ash:function(){return[P.q]},
$ise:1,
$ase:function(){return[P.q]},
"%":";Uint8Array"}}],["","",,P,{"^":"",
iy:function(){var z,y,x
z={}
if(self.scheduleImmediate!=null)return P.kI()
if(self.MutationObserver!=null&&self.document!=null){y=self.document.createElement("div")
x=self.document.createElement("span")
z.a=null
new self.MutationObserver(H.b8(new P.iA(z),1)).observe(y,{childList:true})
return new P.iz(z,y,x)}else if(self.setImmediate!=null)return P.kJ()
return P.kK()},
mD:[function(a){++init.globalState.f.b
self.scheduleImmediate(H.b8(new P.iB(a),0))},"$1","kI",2,0,4],
mE:[function(a){++init.globalState.f.b
self.setImmediate(H.b8(new P.iC(a),0))},"$1","kJ",2,0,4],
mF:[function(a){P.cE(C.h,a)},"$1","kK",2,0,4],
jO:function(a,b,c){if(H.aA(a,{func:1,args:[P.aV,P.aV]}))return a.$2(b,c)
else return a.$1(b)},
eu:function(a,b){if(H.aA(a,{func:1,args:[P.aV,P.aV]})){b.toString
return a}else{b.toString
return a}},
k2:function(){var z,y
for(;z=$.aL,z!=null;){$.b4=null
y=z.gat()
$.aL=y
if(y==null)$.b3=null
z.gcz().$0()}},
mR:[function(){$.cQ=!0
try{P.k2()}finally{$.b4=null
$.cQ=!1
if($.aL!=null)$.$get$cG().$1(P.eC())}},"$0","eC",0,0,2],
ey:function(a){var z=new P.ef(a,null)
if($.aL==null){$.b3=z
$.aL=z
if(!$.cQ)$.$get$cG().$1(P.eC())}else{$.b3.b=z
$.b3=z}},
kp:function(a){var z,y,x
z=$.aL
if(z==null){P.ey(a)
$.b4=$.b3
return}y=new P.ef(a,null)
x=$.b4
if(x==null){y.b=z
$.b4=y
$.aL=y}else{y.b=x.b
x.b=y
$.b4=y
if(y.b==null)$.b3=y}},
eO:function(a){var z=$.z
if(C.c===z){P.bZ(null,null,C.c,a)
return}z.toString
P.bZ(null,null,z,z.br(a,!0))},
mP:[function(a){},"$1","kL",2,0,39,24],
kb:[function(a,b){var z=$.z
z.toString
P.b5(null,null,z,a,b)},function(a){return P.kb(a,null)},"$2","$1","kN",2,2,11,1],
mQ:[function(){},"$0","kM",0,0,2],
jx:function(a,b,c){var z=a.aD()
if(!!J.n(z).$isaH&&z!==$.$get$be())z.bI(new P.jy(b,c))
else b.al(c)},
ep:function(a,b,c){$.z.toString
a.aA(b,c)},
io:function(a,b){var z=$.z
if(z===C.c){z.toString
return P.cE(a,b)}return P.cE(a,z.br(b,!0))},
cE:function(a,b){var z=C.e.aU(a.a,1000)
return H.ik(z<0?0:z,b)},
ix:function(){return $.z},
b5:function(a,b,c,d,e){var z={}
z.a=d
P.kp(new P.ko(z,e))},
ev:function(a,b,c,d){var z,y
y=$.z
if(y===c)return d.$0()
$.z=c
z=y
try{y=d.$0()
return y}finally{$.z=z}},
ex:function(a,b,c,d,e){var z,y
y=$.z
if(y===c)return d.$1(e)
$.z=c
z=y
try{y=d.$1(e)
return y}finally{$.z=z}},
ew:function(a,b,c,d,e,f){var z,y
y=$.z
if(y===c)return d.$2(e,f)
$.z=c
z=y
try{y=d.$2(e,f)
return y}finally{$.z=z}},
bZ:function(a,b,c,d){var z=C.c!==c
if(z)d=c.br(d,!(!z||!1))
P.ey(d)},
iA:{"^":"c:0;a",
$1:[function(a){var z,y;--init.globalState.f.b
z=this.a
y=z.a
z.a=null
y.$0()},null,null,2,0,null,9,"call"]},
iz:{"^":"c:23;a,b,c",
$1:function(a){var z,y;++init.globalState.f.b
this.a.a=a
z=this.b
y=this.c
z.firstChild?z.removeChild(y):z.appendChild(y)}},
iB:{"^":"c:1;a",
$0:[function(){--init.globalState.f.b
this.a.$0()},null,null,0,0,null,"call"]},
iC:{"^":"c:1;a",
$0:[function(){--init.globalState.f.b
this.a.$0()},null,null,0,0,null,"call"]},
ek:{"^":"d;a7:a@,K:b>,c,cz:d<,e",
gan:function(){return this.b.b},
gcO:function(){return(this.c&1)!==0},
geV:function(){return(this.c&2)!==0},
gcN:function(){return this.c===8},
geW:function(){return this.e!=null},
eT:function(a){return this.b.b.bF(this.d,a)},
f8:function(a){if(this.c!==6)return!0
return this.b.b.bF(this.d,J.ba(a))},
cM:function(a){var z,y,x
z=this.e
y=J.r(a)
x=this.b.b
if(H.aA(z,{func:1,args:[,,]}))return x.fs(z,y.gag(a),a.gab())
else return x.bF(z,y.gag(a))},
eU:function(){return this.b.b.d6(this.d)}},
az:{"^":"d;ae:a<,an:b<,am:c<,$ti",
ged:function(){return this.a===2},
gbi:function(){return this.a>=4},
gec:function(){return this.a===8},
em:function(a){this.a=2
this.c=a},
d9:function(a,b){var z,y
z=$.z
if(z!==C.c){z.toString
if(b!=null)b=P.eu(b,z)}y=new P.az(0,$.z,null,[null])
this.b4(new P.ek(null,y,b==null?1:3,a,b))
return y},
fu:function(a){return this.d9(a,null)},
bI:function(a){var z,y
z=$.z
y=new P.az(0,z,null,this.$ti)
if(z!==C.c)z.toString
this.b4(new P.ek(null,y,8,a,null))
return y},
eo:function(){this.a=1},
e1:function(){this.a=0},
gad:function(){return this.c},
ge0:function(){return this.c},
ep:function(a){this.a=4
this.c=a},
en:function(a){this.a=8
this.c=a},
bV:function(a){this.a=a.gae()
this.c=a.gam()},
b4:function(a){var z,y
z=this.a
if(z<=1){a.a=this.c
this.c=a}else{if(z===2){y=this.c
if(!y.gbi()){y.b4(a)
return}this.a=y.gae()
this.c=y.gam()}z=this.b
z.toString
P.bZ(null,null,z,new P.iW(this,a))}},
cg:function(a){var z,y,x,w,v
z={}
z.a=a
if(a==null)return
y=this.a
if(y<=1){x=this.c
this.c=a
if(x!=null){for(w=a;w.ga7()!=null;)w=w.ga7()
w.sa7(x)}}else{if(y===2){v=this.c
if(!v.gbi()){v.cg(a)
return}this.a=v.gae()
this.c=v.gam()}z.a=this.cj(a)
y=this.b
y.toString
P.bZ(null,null,y,new P.j0(z,this))}},
aC:function(){var z=this.c
this.c=null
return this.cj(z)},
cj:function(a){var z,y,x
for(z=a,y=null;z!=null;y=z,z=x){x=z.ga7()
z.sa7(y)}return y},
al:function(a){var z,y
z=this.$ti
if(H.eE(a,"$isaH",z,"$asaH"))if(H.eE(a,"$isaz",z,null))P.el(a,this)
else P.iX(a,this)
else{y=this.aC()
this.a=4
this.c=a
P.b_(this,y)}},
bc:[function(a,b){var z=this.aC()
this.a=8
this.c=new P.bF(a,b)
P.b_(this,z)},function(a){return this.bc(a,null)},"fA","$2","$1","gbb",2,2,11,1,13,14],
dW:function(a,b){this.a=4
this.c=a},
$isaH:1,
w:{
iX:function(a,b){var z,y,x
b.eo()
try{a.d9(new P.iY(b),new P.iZ(b))}catch(x){z=H.a_(x)
y=H.a6(x)
P.eO(new P.j_(b,z,y))}},
el:function(a,b){var z
for(;a.ged();)a=a.ge0()
if(a.gbi()){z=b.aC()
b.bV(a)
P.b_(b,z)}else{z=b.gam()
b.em(a)
a.cg(z)}},
b_:function(a,b){var z,y,x,w,v,u,t,s,r,q,p,o
z={}
z.a=a
for(y=a;!0;){x={}
w=y.gec()
if(b==null){if(w){v=z.a.gad()
y=z.a.gan()
u=J.ba(v)
t=v.gab()
y.toString
P.b5(null,null,y,u,t)}return}for(;b.ga7()!=null;b=s){s=b.ga7()
b.sa7(null)
P.b_(z.a,b)}r=z.a.gam()
x.a=w
x.b=r
y=!w
if(!y||b.gcO()||b.gcN()){q=b.gan()
if(w){u=z.a.gan()
u.toString
u=u==null?q==null:u===q
if(!u)q.toString
else u=!0
u=!u}else u=!1
if(u){v=z.a.gad()
y=z.a.gan()
u=J.ba(v)
t=v.gab()
y.toString
P.b5(null,null,y,u,t)
return}p=$.z
if(p==null?q!=null:p!==q)$.z=q
else p=null
if(b.gcN())new P.j3(z,x,w,b).$0()
else if(y){if(b.gcO())new P.j2(x,b,r).$0()}else if(b.geV())new P.j1(z,x,b).$0()
if(p!=null)$.z=p
y=x.b
if(!!J.n(y).$isaH){o=J.d6(b)
if(y.a>=4){b=o.aC()
o.bV(y)
z.a=y
continue}else P.el(y,o)
return}}o=J.d6(b)
b=o.aC()
y=x.a
u=x.b
if(!y)o.ep(u)
else o.en(u)
z.a=o
y=o}}}},
iW:{"^":"c:1;a,b",
$0:function(){P.b_(this.a,this.b)}},
j0:{"^":"c:1;a,b",
$0:function(){P.b_(this.b,this.a.a)}},
iY:{"^":"c:0;a",
$1:[function(a){var z=this.a
z.e1()
z.al(a)},null,null,2,0,null,24,"call"]},
iZ:{"^":"c:27;a",
$2:[function(a,b){this.a.bc(a,b)},function(a){return this.$2(a,null)},"$1",null,null,null,2,2,null,1,13,14,"call"]},
j_:{"^":"c:1;a,b,c",
$0:function(){this.a.bc(this.b,this.c)}},
j3:{"^":"c:2;a,b,c,d",
$0:function(){var z,y,x,w,v,u,t
z=null
try{z=this.d.eU()}catch(w){y=H.a_(w)
x=H.a6(w)
if(this.c){v=J.ba(this.a.a.gad())
u=y
u=v==null?u==null:v===u
v=u}else v=!1
u=this.b
if(v)u.b=this.a.a.gad()
else u.b=new P.bF(y,x)
u.a=!0
return}if(!!J.n(z).$isaH){if(z instanceof P.az&&z.gae()>=4){if(z.gae()===8){v=this.b
v.b=z.gam()
v.a=!0}return}t=this.a.a
v=this.b
v.b=z.fu(new P.j4(t))
v.a=!1}}},
j4:{"^":"c:0;a",
$1:[function(a){return this.a},null,null,2,0,null,9,"call"]},
j2:{"^":"c:2;a,b,c",
$0:function(){var z,y,x,w
try{this.a.b=this.b.eT(this.c)}catch(x){z=H.a_(x)
y=H.a6(x)
w=this.a
w.b=new P.bF(z,y)
w.a=!0}}},
j1:{"^":"c:2;a,b,c",
$0:function(){var z,y,x,w,v,u,t,s
try{z=this.a.a.gad()
w=this.c
if(w.f8(z)===!0&&w.geW()){v=this.b
v.b=w.cM(z)
v.a=!1}}catch(u){y=H.a_(u)
x=H.a6(u)
w=this.a
v=J.ba(w.a.gad())
t=y
s=this.b
if(v==null?t==null:v===t)s.b=w.a.gad()
else s.b=new P.bF(y,x)
s.a=!0}}},
ef:{"^":"d;cz:a<,at:b<"},
ay:{"^":"d;$ti",
a3:function(a,b){return new P.jk(b,this,[H.L(this,"ay",0),null])},
eP:function(a,b){return new P.j6(a,b,this,[H.L(this,"ay",0)])},
cM:function(a){return this.eP(a,null)},
gi:function(a){var z,y
z={}
y=new P.az(0,$.z,null,[P.q])
z.a=0
this.as(new P.i8(z),!0,new P.i9(z,y),y.gbb())
return y},
gl:function(a){var z,y
z={}
y=new P.az(0,$.z,null,[P.eD])
z.a=null
z.a=this.as(new P.i6(z,y),!0,new P.i7(y),y.gbb())
return y},
S:function(a){var z,y,x
z=H.L(this,"ay",0)
y=H.R([],[z])
x=new P.az(0,$.z,null,[[P.k,z]])
this.as(new P.ia(this,y),!0,new P.ib(y,x),x.gbb())
return x}},
i8:{"^":"c:0;a",
$1:[function(a){++this.a.a},null,null,2,0,null,9,"call"]},
i9:{"^":"c:1;a,b",
$0:[function(){this.b.al(this.a.a)},null,null,0,0,null,"call"]},
i6:{"^":"c:0;a,b",
$1:[function(a){P.jx(this.a.a,this.b,!1)},null,null,2,0,null,9,"call"]},
i7:{"^":"c:1;a",
$0:[function(){this.a.al(!0)},null,null,0,0,null,"call"]},
ia:{"^":"c;a,b",
$1:[function(a){this.b.push(a)},null,null,2,0,null,31,"call"],
$S:function(){return H.eF(function(a){return{func:1,args:[a]}},this.a,"ay")}},
ib:{"^":"c:1;a,b",
$0:[function(){this.b.al(this.a)},null,null,0,0,null,"call"]},
i5:{"^":"d;"},
bT:{"^":"d;an:d<,ae:e<,$ti",
bC:function(a,b){var z=this.e
if((z&8)!==0)return
this.e=(z+128|4)>>>0
if(z<128&&this.r!=null)this.r.cA()
if((z&4)===0&&(this.e&32)===0)this.c5(this.gcc())},
d0:function(a){return this.bC(a,null)},
d4:function(){var z=this.e
if((z&8)!==0)return
if(z>=128){z-=128
this.e=z
if(z<128){if((z&64)!==0){z=this.r
z=!z.gl(z)}else z=!1
if(z)this.r.b0(this)
else{z=(this.e&4294967291)>>>0
this.e=z
if((z&32)===0)this.c5(this.gce())}}}},
aD:function(){var z=(this.e&4294967279)>>>0
this.e=z
if((z&8)===0)this.b7()
z=this.f
return z==null?$.$get$be():z},
gbw:function(){return this.e>=128},
b7:function(){var z=(this.e|8)>>>0
this.e=z
if((z&64)!==0)this.r.cA()
if((this.e&32)===0)this.r=null
this.f=this.cb()},
b6:["dL",function(a){var z=this.e
if((z&8)!==0)return
if(z<32)this.cm(a)
else this.b5(new P.iK(a,null,[H.L(this,"bT",0)]))}],
aA:["dM",function(a,b){var z=this.e
if((z&8)!==0)return
if(z<32)this.co(a,b)
else this.b5(new P.iM(a,b,null))}],
dZ:function(){var z=this.e
if((z&8)!==0)return
z=(z|2)>>>0
this.e=z
if(z<32)this.cn()
else this.b5(C.o)},
cd:[function(){},"$0","gcc",0,0,2],
cf:[function(){},"$0","gce",0,0,2],
cb:function(){return},
b5:function(a){var z,y
z=this.r
if(z==null){z=new P.jt(null,null,0,[H.L(this,"bT",0)])
this.r=z}z.u(0,a)
y=this.e
if((y&64)===0){y=(y|64)>>>0
this.e=y
if(y<128)this.r.b0(this)}},
cm:function(a){var z=this.e
this.e=(z|32)>>>0
this.d.bG(this.a,a)
this.e=(this.e&4294967263)>>>0
this.b8((z&4)!==0)},
co:function(a,b){var z,y
z=this.e
y=new P.iF(this,a,b)
if((z&1)!==0){this.e=(z|16)>>>0
this.b7()
z=this.f
if(!!J.n(z).$isaH&&z!==$.$get$be())z.bI(y)
else y.$0()}else{y.$0()
this.b8((z&4)!==0)}},
cn:function(){var z,y
z=new P.iE(this)
this.b7()
this.e=(this.e|16)>>>0
y=this.f
if(!!J.n(y).$isaH&&y!==$.$get$be())y.bI(z)
else z.$0()},
c5:function(a){var z=this.e
this.e=(z|32)>>>0
a.$0()
this.e=(this.e&4294967263)>>>0
this.b8((z&4)!==0)},
b8:function(a){var z,y
if((this.e&64)!==0){z=this.r
z=z.gl(z)}else z=!1
if(z){z=(this.e&4294967231)>>>0
this.e=z
if((z&4)!==0)if(z<128){z=this.r
z=z==null||z.gl(z)}else z=!1
else z=!1
if(z)this.e=(this.e&4294967291)>>>0}for(;!0;a=y){z=this.e
if((z&8)!==0){this.r=null
return}y=(z&4)!==0
if(a===y)break
this.e=(z^32)>>>0
if(y)this.cd()
else this.cf()
this.e=(this.e&4294967263)>>>0}z=this.e
if((z&64)!==0&&z<128)this.r.b0(this)},
dT:function(a,b,c,d,e){var z,y
z=a==null?P.kL():a
y=this.d
y.toString
this.a=z
this.b=P.eu(b==null?P.kN():b,y)
this.c=c==null?P.kM():c}},
iF:{"^":"c:2;a,b,c",
$0:function(){var z,y,x,w,v,u
z=this.a
y=z.e
if((y&8)!==0&&(y&16)===0)return
z.e=(y|32)>>>0
y=z.b
x=H.aA(y,{func:1,args:[P.d,P.bq]})
w=z.d
v=this.b
u=z.b
if(x)w.ft(u,v,this.c)
else w.bG(u,v)
z.e=(z.e&4294967263)>>>0}},
iE:{"^":"c:2;a",
$0:function(){var z,y
z=this.a
y=z.e
if((y&16)===0)return
z.e=(y|42)>>>0
z.d.d7(z.c)
z.e=(z.e&4294967263)>>>0}},
ei:{"^":"d;at:a@"},
iK:{"^":"ei;b,a,$ti",
bD:function(a){a.cm(this.b)}},
iM:{"^":"ei;ag:b>,ab:c<,a",
bD:function(a){a.co(this.b,this.c)}},
iL:{"^":"d;",
bD:function(a){a.cn()},
gat:function(){return},
sat:function(a){throw H.b(new P.br("No events after a done."))}},
jm:{"^":"d;ae:a<",
b0:function(a){var z=this.a
if(z===1)return
if(z>=1){this.a=1
return}P.eO(new P.jn(this,a))
this.a=1},
cA:function(){if(this.a===1)this.a=3}},
jn:{"^":"c:1;a,b",
$0:function(){var z,y,x,w
z=this.a
y=z.a
z.a=0
if(y===3)return
x=z.b
w=x.gat()
z.b=w
if(w==null)z.c=null
x.bD(this.b)}},
jt:{"^":"jm;b,c,a,$ti",
gl:function(a){return this.c==null},
u:function(a,b){var z=this.c
if(z==null){this.c=b
this.b=b}else{z.sat(b)
this.c=b}}},
jy:{"^":"c:1;a,b",
$0:function(){return this.a.al(this.b)}},
bx:{"^":"ay;$ti",
as:function(a,b,c,d){return this.e6(a,d,c,!0===b)},
cT:function(a,b,c){return this.as(a,null,b,c)},
e6:function(a,b,c,d){return P.iV(this,a,b,c,d,H.L(this,"bx",0),H.L(this,"bx",1))},
c6:function(a,b){b.b6(a)},
c7:function(a,b,c){c.aA(a,b)},
$asay:function(a,b){return[b]}},
ej:{"^":"bT;x,y,a,b,c,d,e,f,r,$ti",
b6:function(a){if((this.e&2)!==0)return
this.dL(a)},
aA:function(a,b){if((this.e&2)!==0)return
this.dM(a,b)},
cd:[function(){var z=this.y
if(z==null)return
z.d0(0)},"$0","gcc",0,0,2],
cf:[function(){var z=this.y
if(z==null)return
z.d4()},"$0","gce",0,0,2],
cb:function(){var z=this.y
if(z!=null){this.y=null
return z.aD()}return},
fB:[function(a){this.x.c6(a,this)},"$1","ge9",2,0,function(){return H.eF(function(a,b){return{func:1,v:true,args:[a]}},this.$receiver,"ej")},31],
fD:[function(a,b){this.x.c7(a,b,this)},"$2","geb",4,0,38,13,14],
fC:[function(){this.dZ()},"$0","gea",0,0,2],
dV:function(a,b,c,d,e,f,g){this.y=this.x.a.cT(this.ge9(),this.gea(),this.geb())},
$asbT:function(a,b){return[b]},
w:{
iV:function(a,b,c,d,e,f,g){var z,y
z=$.z
y=e?1:0
y=new P.ej(a,null,null,null,null,z,y,null,null,[f,g])
y.dT(b,c,d,e,g)
y.dV(a,b,c,d,e,f,g)
return y}}},
jk:{"^":"bx;b,a,$ti",
c6:function(a,b){var z,y,x,w
z=null
try{z=this.b.$1(a)}catch(w){y=H.a_(w)
x=H.a6(w)
P.ep(b,y,x)
return}b.b6(z)}},
j6:{"^":"bx;b,c,a,$ti",
c7:function(a,b,c){var z,y,x,w,v
z=!0
if(z===!0)try{P.jO(this.b,a,b)}catch(w){y=H.a_(w)
x=H.a6(w)
v=y
if(v==null?a==null:v===a)c.aA(a,b)
else P.ep(c,y,x)
return}else c.aA(a,b)},
$asbx:function(a){return[a,a]},
$asay:null},
bF:{"^":"d;ag:a>,ab:b<",
j:function(a){return H.j(this.a)},
$isP:1},
jv:{"^":"d;"},
ko:{"^":"c:1;a,b",
$0:function(){var z,y,x
z=this.a
y=z.a
if(y==null){x=new P.dH()
z.a=x
z=x}else z=y
y=this.b
if(y==null)throw H.b(z)
x=H.b(z)
x.stack=J.u(y)
throw x}},
jp:{"^":"jv;",
ga9:function(a){return},
d7:function(a){var z,y,x,w
try{if(C.c===$.z){x=a.$0()
return x}x=P.ev(null,null,this,a)
return x}catch(w){z=H.a_(w)
y=H.a6(w)
x=P.b5(null,null,this,z,y)
return x}},
bG:function(a,b){var z,y,x,w
try{if(C.c===$.z){x=a.$1(b)
return x}x=P.ex(null,null,this,a,b)
return x}catch(w){z=H.a_(w)
y=H.a6(w)
x=P.b5(null,null,this,z,y)
return x}},
ft:function(a,b,c){var z,y,x,w
try{if(C.c===$.z){x=a.$2(b,c)
return x}x=P.ew(null,null,this,a,b,c)
return x}catch(w){z=H.a_(w)
y=H.a6(w)
x=P.b5(null,null,this,z,y)
return x}},
br:function(a,b){if(b)return new P.jq(this,a)
else return new P.jr(this,a)},
eA:function(a,b){return new P.js(this,a)},
h:function(a,b){return},
d6:function(a){if($.z===C.c)return a.$0()
return P.ev(null,null,this,a)},
bF:function(a,b){if($.z===C.c)return a.$1(b)
return P.ex(null,null,this,a,b)},
fs:function(a,b,c){if($.z===C.c)return a.$2(b,c)
return P.ew(null,null,this,a,b,c)}},
jq:{"^":"c:1;a,b",
$0:function(){return this.a.d7(this.b)}},
jr:{"^":"c:1;a,b",
$0:function(){return this.a.d6(this.b)}},
js:{"^":"c:0;a,b",
$1:[function(a){return this.a.bG(this.b,a)},null,null,2,0,null,46,"call"]}}],["","",,P,{"^":"",
cJ:function(a,b,c){if(c==null)a[b]=a
else a[b]=c},
cI:function(){var z=Object.create(null)
P.cJ(z,"<non-identifier-key>",z)
delete z["<non-identifier-key>"]
return z},
hp:function(){return new H.at(0,null,null,null,null,null,0,[null,null])},
J:function(a){return H.kQ(a,new H.at(0,null,null,null,null,null,0,[null,null]))},
h5:function(a,b,c){var z,y
if(P.cR(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}z=[]
y=$.$get$b6()
y.push(a)
try{P.jP(a,z)}finally{if(0>=y.length)return H.m(y,-1)
y.pop()}y=P.dV(b,z,", ")+c
return y.charCodeAt(0)==0?y:y},
bK:function(a,b,c){var z,y,x
if(P.cR(a))return b+"..."+c
z=new P.bR(b)
y=$.$get$b6()
y.push(a)
try{x=z
x.sE(P.dV(x.gE(),a,", "))}finally{if(0>=y.length)return H.m(y,-1)
y.pop()}y=z
y.sE(y.gE()+c)
y=z.gE()
return y.charCodeAt(0)==0?y:y},
cR:function(a){var z,y
for(z=0;y=$.$get$b6(),z<y.length;++z)if(a===y[z])return!0
return!1},
jP:function(a,b){var z,y,x,w,v,u,t,s,r,q
z=a.gH(a)
y=0
x=0
while(!0){if(!(y<80||x<3))break
if(!z.v())return
w=H.j(z.gD())
b.push(w)
y+=w.length+2;++x}if(!z.v()){if(x<=5)return
if(0>=b.length)return H.m(b,-1)
v=b.pop()
if(0>=b.length)return H.m(b,-1)
u=b.pop()}else{t=z.gD();++x
if(!z.v()){if(x<=4){b.push(H.j(t))
return}v=H.j(t)
if(0>=b.length)return H.m(b,-1)
u=b.pop()
y+=v.length+2}else{s=z.gD();++x
for(;z.v();t=s,s=r){r=z.gD();++x
if(x>100){while(!0){if(!(y>75&&x>3))break
if(0>=b.length)return H.m(b,-1)
y-=b.pop().length+2;--x}b.push("...")
return}}u=H.j(t)
v=H.j(s)
y+=v.length+u.length+4}}if(x>b.length+2){y+=5
q="..."}else q=null
while(!0){if(!(y>80&&b.length>3))break
if(0>=b.length)return H.m(b,-1)
y-=b.pop().length+2
if(q==null){y+=5
q="..."}}if(q!=null)b.push(q)
b.push(u)
b.push(v)},
av:function(a,b,c,d){return new P.jd(0,null,null,null,null,null,0,[d])},
dy:function(a){var z,y,x
z={}
if(P.cR(a))return"{...}"
y=new P.bR("")
try{$.$get$b6().push(a)
x=y
x.sE(x.gE()+"{")
z.a=!0
a.a8(0,new P.ht(z,y))
z=y
z.sE(z.gE()+"}")}finally{z=$.$get$b6()
if(0>=z.length)return H.m(z,-1)
z.pop()}z=y.gE()
return z.charCodeAt(0)==0?z:z},
j7:{"^":"d;$ti",
gi:function(a){return this.a},
gl:function(a){return this.a===0},
gZ:function(){return new P.j8(this,[H.B(this,0)])},
ap:function(a){var z,y
if(typeof a==="string"&&a!=="__proto__"){z=this.b
return z==null?!1:z[a]!=null}else if(typeof a==="number"&&(a&0x3ffffff)===a){y=this.c
return y==null?!1:y[a]!=null}else return this.e5(a)},
e5:function(a){var z=this.d
if(z==null)return!1
return this.a5(z[H.c6(a)&0x3ffffff],a)>=0},
h:function(a,b){var z,y,x,w
if(typeof b==="string"&&b!=="__proto__"){z=this.b
if(z==null)y=null
else{x=z[b]
y=x===z?null:x}return y}else if(typeof b==="number"&&(b&0x3ffffff)===b){w=this.c
if(w==null)y=null
else{x=w[b]
y=x===w?null:x}return y}else return this.e8(b)},
e8:function(a){var z,y,x
z=this.d
if(z==null)return
y=z[H.c6(a)&0x3ffffff]
x=this.a5(y,a)
return x<0?null:y[x+1]},
A:function(a,b,c){var z,y,x,w,v,u
if(typeof b==="string"&&b!=="__proto__"){z=this.b
if(z==null){z=P.cI()
this.b=z}this.bX(z,b,c)}else if(typeof b==="number"&&(b&0x3ffffff)===b){y=this.c
if(y==null){y=P.cI()
this.c=y}this.bX(y,b,c)}else{x=this.d
if(x==null){x=P.cI()
this.d=x}w=H.c6(b)&0x3ffffff
v=x[w]
if(v==null){P.cJ(x,w,[b,c]);++this.a
this.e=null}else{u=this.a5(v,b)
if(u>=0)v[u+1]=c
else{v.push(b,c);++this.a
this.e=null}}}},
e3:function(){var z,y,x,w,v,u,t,s,r,q,p,o
z=this.e
if(z!=null)return z
y=new Array(this.a)
y.fixed$length=Array
x=this.b
if(x!=null){w=Object.getOwnPropertyNames(x)
v=w.length
for(u=0,t=0;t<v;++t){y[u]=w[t];++u}}else u=0
s=this.c
if(s!=null){w=Object.getOwnPropertyNames(s)
v=w.length
for(t=0;t<v;++t){y[u]=+w[t];++u}}r=this.d
if(r!=null){w=Object.getOwnPropertyNames(r)
v=w.length
for(t=0;t<v;++t){q=r[w[t]]
p=q.length
for(o=0;o<p;o+=2){y[u]=q[o];++u}}}this.e=y
return y},
bX:function(a,b,c){if(a[b]==null){++this.a
this.e=null}P.cJ(a,b,c)},
$isad:1},
jb:{"^":"j7;a,b,c,d,e,$ti",
a5:function(a,b){var z,y,x
if(a==null)return-1
z=a.length
for(y=0;y<z;y+=2){x=a[y]
if(x==null?b==null:x===b)return y}return-1}},
j8:{"^":"h;a,$ti",
gi:function(a){return this.a.a},
gl:function(a){return this.a.a===0},
gH:function(a){var z=this.a
return new P.j9(z,z.e3(),0,null)}},
j9:{"^":"d;a,b,c,d",
gD:function(){return this.d},
v:function(){var z,y,x
z=this.b
y=this.c
x=this.a
if(z!==x.e)throw H.b(new P.al(x))
else if(y>=z.length){this.d=null
return!1}else{this.d=z[y]
this.c=y+1
return!0}}},
en:{"^":"at;a,b,c,d,e,f,r,$ti",
aJ:function(a){return H.c6(a)&0x3ffffff},
aK:function(a,b){var z,y,x
if(a==null)return-1
z=a.length
for(y=0;y<z;++y){x=a[y].gcP()
if(x==null?b==null:x===b)return y}return-1},
w:{
b2:function(a,b){return new P.en(0,null,null,null,null,null,0,[a,b])}}},
jd:{"^":"ja;a,b,c,d,e,f,r,$ti",
gH:function(a){var z=new P.b1(this,this.r,null,null)
z.c=this.e
return z},
gi:function(a){return this.a},
gl:function(a){return this.a===0},
aG:function(a,b){var z,y
if(typeof b==="string"&&b!=="__proto__"){z=this.b
if(z==null)return!1
return z[b]!=null}else if(typeof b==="number"&&(b&0x3ffffff)===b){y=this.c
if(y==null)return!1
return y[b]!=null}else return this.e4(b)},
e4:function(a){var z=this.d
if(z==null)return!1
return this.a5(z[this.aR(a)],a)>=0},
bA:function(a){var z
if(!(typeof a==="string"&&a!=="__proto__"))z=typeof a==="number"&&(a&0x3ffffff)===a
else z=!0
if(z)return this.aG(0,a)?a:null
else return this.ee(a)},
ee:function(a){var z,y,x
z=this.d
if(z==null)return
y=z[this.aR(a)]
x=this.a5(y,a)
if(x<0)return
return J.d2(y,x).gbe()},
u:function(a,b){var z,y,x
if(typeof b==="string"&&b!=="__proto__"){z=this.b
if(z==null){y=Object.create(null)
y["<non-identifier-key>"]=y
delete y["<non-identifier-key>"]
this.b=y
z=y}return this.bW(z,b)}else if(typeof b==="number"&&(b&0x3ffffff)===b){x=this.c
if(x==null){y=Object.create(null)
y["<non-identifier-key>"]=y
delete y["<non-identifier-key>"]
this.c=y
x=y}return this.bW(x,b)}else return this.a2(b)},
a2:function(a){var z,y,x
z=this.d
if(z==null){z=P.jf()
this.d=z}y=this.aR(a)
x=z[y]
if(x==null)z[y]=[this.ba(a)]
else{if(this.a5(x,a)>=0)return!1
x.push(this.ba(a))}return!0},
a0:function(a,b){if(typeof b==="string"&&b!=="__proto__")return this.c_(this.b,b)
else if(typeof b==="number"&&(b&0x3ffffff)===b)return this.c_(this.c,b)
else return this.ej(b)},
ej:function(a){var z,y,x
z=this.d
if(z==null)return!1
y=z[this.aR(a)]
x=this.a5(y,a)
if(x<0)return!1
this.c0(y.splice(x,1)[0])
return!0},
ao:function(a){if(this.a>0){this.f=null
this.e=null
this.d=null
this.c=null
this.b=null
this.a=0
this.r=this.r+1&67108863}},
bW:function(a,b){if(a[b]!=null)return!1
a[b]=this.ba(b)
return!0},
c_:function(a,b){var z
if(a==null)return!1
z=a[b]
if(z==null)return!1
this.c0(z)
delete a[b]
return!0},
ba:function(a){var z,y
z=new P.je(a,null,null)
if(this.e==null){this.f=z
this.e=z}else{y=this.f
z.c=y
y.b=z
this.f=z}++this.a
this.r=this.r+1&67108863
return z},
c0:function(a){var z,y
z=a.gbZ()
y=a.gbY()
if(z==null)this.e=y
else z.b=y
if(y==null)this.f=z
else y.sbZ(z);--this.a
this.r=this.r+1&67108863},
aR:function(a){return J.M(a)&0x3ffffff},
a5:function(a,b){var z,y
if(a==null)return-1
z=a.length
for(y=0;y<z;++y)if(J.a1(a[y].gbe(),b))return y
return-1},
$ish:1,
$ash:null,
$ise:1,
$ase:null,
w:{
jf:function(){var z=Object.create(null)
z["<non-identifier-key>"]=z
delete z["<non-identifier-key>"]
return z}}},
je:{"^":"d;be:a<,bY:b<,bZ:c@"},
b1:{"^":"d;a,b,c,d",
gD:function(){return this.d},
v:function(){var z=this.a
if(this.b!==z.r)throw H.b(new P.al(z))
else{z=this.c
if(z==null){this.d=null
return!1}else{this.d=z.gbe()
this.c=this.c.gbY()
return!0}}}},
ja:{"^":"hR;$ti"},
aT:{"^":"hx;$ti"},
hx:{"^":"d+a5;",$ask:null,$ash:null,$ase:null,$isk:1,$ish:1,$ise:1},
a5:{"^":"d;$ti",
gH:function(a){return new H.cs(a,this.gi(a),0,null)},
I:function(a,b){return this.h(a,b)},
gl:function(a){return this.gi(a)===0},
a3:function(a,b){return new H.a3(a,b,[H.L(a,"a5",0),null])},
N:function(a,b){var z,y,x
z=H.R([],[H.L(a,"a5",0)])
C.b.si(z,this.gi(a))
for(y=0;y<this.gi(a);++y){x=this.h(a,y)
if(y>=z.length)return H.m(z,y)
z[y]=x}return z},
S:function(a){return this.N(a,!0)},
u:function(a,b){var z=this.gi(a)
this.si(a,z+1)
this.A(a,z,b)},
j:function(a){return P.bK(a,"[","]")},
$isk:1,
$ask:null,
$ish:1,
$ash:null,
$ise:1,
$ase:null},
ju:{"^":"d;",
A:function(a,b,c){throw H.b(new P.y("Cannot modify unmodifiable map"))},
$isad:1},
hr:{"^":"d;",
h:function(a,b){return this.a.h(0,b)},
A:function(a,b,c){this.a.A(0,b,c)},
a8:function(a,b){this.a.a8(0,b)},
gl:function(a){var z=this.a
return z.gl(z)},
gi:function(a){var z=this.a
return z.gi(z)},
gZ:function(){return this.a.gZ()},
j:function(a){return this.a.j(0)},
$isad:1},
ec:{"^":"hr+ju;$ti",$asad:null,$isad:1},
ht:{"^":"c:16;a,b",
$2:function(a,b){var z,y
z=this.a
if(!z.a)this.b.E+=", "
z.a=!1
z=this.b
y=z.E+=H.j(a)
z.E=y+": "
z.E+=H.j(b)}},
hq:{"^":"aU;a,b,c,d,$ti",
gH:function(a){return new P.jg(this,this.c,this.d,this.b,null)},
gl:function(a){return this.b===this.c},
gi:function(a){return(this.c-this.b&this.a.length-1)>>>0},
I:function(a,b){var z,y,x,w
z=(this.c-this.b&this.a.length-1)>>>0
if(typeof b!=="number")return H.p(b)
if(0>b||b>=z)H.A(P.ac(b,this,"index",null,z))
y=this.a
x=y.length
w=(this.b+b&x-1)>>>0
if(w<0||w>=x)return H.m(y,w)
return y[w]},
N:function(a,b){var z=H.R([],this.$ti)
C.b.si(z,this.gi(this))
this.er(z)
return z},
S:function(a){return this.N(a,!0)},
u:function(a,b){this.a2(b)},
ao:function(a){var z,y,x,w,v
z=this.b
y=this.c
if(z!==y){for(x=this.a,w=x.length,v=w-1;z!==y;z=(z+1&v)>>>0){if(z<0||z>=w)return H.m(x,z)
x[z]=null}this.c=0
this.b=0;++this.d}},
j:function(a){return P.bK(this,"{","}")},
d3:function(){var z,y,x,w
z=this.b
if(z===this.c)throw H.b(H.cn());++this.d
y=this.a
x=y.length
if(z>=x)return H.m(y,z)
w=y[z]
y[z]=null
this.b=(z+1&x-1)>>>0
return w},
a2:function(a){var z,y,x
z=this.a
y=this.c
x=z.length
if(y<0||y>=x)return H.m(z,y)
z[y]=a
x=(y+1&x-1)>>>0
this.c=x
if(this.b===x)this.c4();++this.d},
c4:function(){var z,y,x,w
z=new Array(this.a.length*2)
z.fixed$length=Array
y=H.R(z,this.$ti)
z=this.a
x=this.b
w=z.length-x
C.b.ax(y,0,w,z,x)
C.b.ax(y,w,w+this.b,this.a,0)
this.b=0
this.c=this.a.length
this.a=y},
er:function(a){var z,y,x,w,v
z=this.b
y=this.c
x=this.a
if(z<=y){w=y-z
C.b.ax(a,0,w,x,z)
return w}else{v=x.length-z
C.b.ax(a,0,v,x,z)
C.b.ax(a,v,v+this.c,this.a,0)
return this.c+v}},
dP:function(a,b){var z=new Array(8)
z.fixed$length=Array
this.a=H.R(z,[b])},
$ash:null,
$ase:null,
w:{
ct:function(a,b){var z=new P.hq(null,0,0,0,[b])
z.dP(a,b)
return z}}},
jg:{"^":"d;a,b,c,d,e",
gD:function(){return this.e},
v:function(){var z,y,x
z=this.a
if(this.c!==z.d)H.A(new P.al(z))
y=this.d
if(y===this.b){this.e=null
return!1}z=z.a
x=z.length
if(y>=x)return H.m(z,y)
this.e=z[y]
this.d=(y+1&x-1)>>>0
return!0}},
hS:{"^":"d;$ti",
gl:function(a){return this.a===0},
N:function(a,b){var z,y,x,w,v
z=H.R([],this.$ti)
C.b.si(z,this.a)
for(y=new P.b1(this,this.r,null,null),y.c=this.e,x=0;y.v();x=v){w=y.d
v=x+1
if(x>=z.length)return H.m(z,x)
z[x]=w}return z},
S:function(a){return this.N(a,!0)},
a3:function(a,b){return new H.cj(this,b,[H.B(this,0),null])},
j:function(a){return P.bK(this,"{","}")},
bx:function(a,b){var z,y
z=new P.b1(this,this.r,null,null)
z.c=this.e
if(!z.v())return""
if(b===""){y=""
do y+=H.j(z.d)
while(z.v())}else{y=H.j(z.d)
for(;z.v();)y=y+b+H.j(z.d)}return y.charCodeAt(0)==0?y:y},
I:function(a,b){var z,y,x
if(typeof b!=="number"||Math.floor(b)!==b)throw H.b(P.dc("index"))
if(b<0)H.A(P.Z(b,0,null,"index",null))
for(z=new P.b1(this,this.r,null,null),z.c=this.e,y=0;z.v();){x=z.d
if(b===y)return x;++y}throw H.b(P.ac(b,this,"index",null,y))},
$ish:1,
$ash:null,
$ise:1,
$ase:null},
hR:{"^":"hS;$ti"}}],["","",,P,{"^":"",
bd:function(a){if(typeof a==="number"||typeof a==="boolean"||null==a)return J.u(a)
if(typeof a==="string")return JSON.stringify(a)
return P.fB(a)},
fB:function(a){var z=J.n(a)
if(!!z.$isc)return z.j(a)
return H.bP(a)},
bJ:function(a){return new P.iU(a)},
aj:function(a,b,c){var z,y
z=H.R([],[c])
for(y=J.aq(a);y.v();)z.push(y.gD())
if(b)return z
z.fixed$length=Array
return z},
d_:function(a){H.lc(H.j(a))},
aZ:function(a,b,c){return new H.he(a,H.hf(a,!1,!0,!1),null,null)},
hw:{"^":"c:17;a,b",
$2:function(a,b){var z,y,x
z=this.b
y=this.a
z.E+=y.a
x=z.E+=H.j(a.geg())
z.E=x+": "
z.E+=H.j(P.bd(b))
y.a=", "}},
eD:{"^":"d;"},
"+bool":0,
bI:{"^":"d;a,b",
C:function(a,b){if(b==null)return!1
if(!(b instanceof P.bI))return!1
return this.a===b.a&&this.b===b.b},
gF:function(a){var z=this.a
return(z^C.d.cp(z,30))&1073741823},
j:function(a){var z,y,x,w,v,u,t
z=P.ft(H.hJ(this))
y=P.bc(H.hH(this))
x=P.bc(H.hD(this))
w=P.bc(H.hE(this))
v=P.bc(H.hG(this))
u=P.bc(H.hI(this))
t=P.fu(H.hF(this))
if(this.b)return z+"-"+y+"-"+x+" "+w+":"+v+":"+u+"."+t+"Z"
else return z+"-"+y+"-"+x+" "+w+":"+v+":"+u+"."+t},
u:function(a,b){return P.fs(C.d.m(this.a,b.gfE()),this.b)},
gf9:function(){return this.a},
bQ:function(a,b){var z
if(!(Math.abs(this.a)>864e13))z=!1
else z=!0
if(z)throw H.b(P.aD(this.gf9()))},
w:{
fs:function(a,b){var z=new P.bI(a,b)
z.bQ(a,b)
return z},
ft:function(a){var z,y
z=Math.abs(a)
y=a<0?"-":""
if(z>=1000)return""+a
if(z>=100)return y+"0"+H.j(z)
if(z>=10)return y+"00"+H.j(z)
return y+"000"+H.j(z)},
fu:function(a){if(a>=100)return""+a
if(a>=10)return"0"+a
return"00"+a},
bc:function(a){if(a>=10)return""+a
return"0"+a}}},
a9:{"^":"aN;"},
"+double":0,
aF:{"^":"d;bd:a<",
m:function(a,b){return new P.aF(this.a+b.gbd())},
t:function(a,b){return new P.aF(this.a-b.gbd())},
q:function(a,b){if(typeof b!=="number")return H.p(b)
return new P.aF(C.d.R(this.a*b))},
az:function(a,b){if(b===0)throw H.b(new P.fK())
return new P.aF(C.e.az(this.a,b))},
L:function(a,b){return C.e.L(this.a,b.gbd())},
C:function(a,b){if(b==null)return!1
if(!(b instanceof P.aF))return!1
return this.a===b.a},
gF:function(a){return this.a&0x1FFFFFFF},
j:function(a){var z,y,x,w,v
z=new P.fy()
y=this.a
if(y<0)return"-"+new P.aF(0-y).j(0)
x=z.$1(C.e.aU(y,6e7)%60)
w=z.$1(C.e.aU(y,1e6)%60)
v=new P.fx().$1(y%1e6)
return""+C.e.aU(y,36e8)+":"+H.j(x)+":"+H.j(w)+"."+H.j(v)}},
fx:{"^":"c:10;",
$1:function(a){if(a>=1e5)return""+a
if(a>=1e4)return"0"+a
if(a>=1000)return"00"+a
if(a>=100)return"000"+a
if(a>=10)return"0000"+a
return"00000"+a}},
fy:{"^":"c:10;",
$1:function(a){if(a>=10)return""+a
return"0"+a}},
P:{"^":"d;",
gab:function(){return H.a6(this.$thrownJsError)}},
dH:{"^":"P;",
j:function(a){return"Throw of null."}},
ar:{"^":"P;a,b,c,d",
gbg:function(){return"Invalid argument"+(!this.a?"(s)":"")},
gbf:function(){return""},
j:function(a){var z,y,x,w,v,u
z=this.c
y=z!=null?" ("+z+")":""
z=this.d
x=z==null?"":": "+H.j(z)
w=this.gbg()+y+x
if(!this.a)return w
v=this.gbf()
u=P.bd(this.b)
return w+v+": "+H.j(u)},
w:{
aD:function(a){return new P.ar(!1,null,null,a)},
cf:function(a,b,c){return new P.ar(!0,a,b,c)},
dc:function(a){return new P.ar(!1,null,a,"Must not be null")}}},
dO:{"^":"ar;e,f,a,b,c,d",
gbg:function(){return"RangeError"},
gbf:function(){var z,y,x
z=this.e
if(z==null){z=this.f
y=z!=null?": Not less than or equal to "+H.j(z):""}else{x=this.f
if(x==null)y=": Not greater than or equal to "+H.j(z)
else if(x>z)y=": Not in range "+H.j(z)+".."+H.j(x)+", inclusive"
else y=x<z?": Valid value range is empty":": Only valid value is "+H.j(z)}return y},
w:{
bo:function(a,b,c){return new P.dO(null,null,!0,a,b,"Value not in range")},
Z:function(a,b,c,d,e){return new P.dO(b,c,!0,a,d,"Invalid value")},
dP:function(a,b,c,d,e,f){if(0>a||a>c)throw H.b(P.Z(a,0,c,"start",f))
if(a>b||b>c)throw H.b(P.Z(b,a,c,"end",f))
return b}}},
fJ:{"^":"ar;e,i:f>,a,b,c,d",
gbg:function(){return"RangeError"},
gbf:function(){if(J.b9(this.b,0))return": index must not be negative"
var z=this.f
if(z===0)return": no indices are valid"
return": index should be less than "+H.j(z)},
w:{
ac:function(a,b,c,d,e){var z=e!=null?e:J.W(b)
return new P.fJ(b,z,!0,a,c,"Index out of range")}}},
hv:{"^":"P;a,b,c,d,e",
j:function(a){var z,y,x,w,v,u,t,s
z={}
y=new P.bR("")
z.a=""
for(x=this.c,w=x.length,v=0;v<w;++v){u=x[v]
y.E+=z.a
y.E+=H.j(P.bd(u))
z.a=", "}this.d.a8(0,new P.hw(z,y))
t=P.bd(this.a)
s=y.j(0)
x="NoSuchMethodError: method not found: '"+H.j(this.b.a)+"'\nReceiver: "+H.j(t)+"\nArguments: ["+s+"]"
return x},
w:{
dF:function(a,b,c,d,e){return new P.hv(a,b,c,d,e)}}},
y:{"^":"P;a",
j:function(a){return"Unsupported operation: "+this.a}},
eb:{"^":"P;a",
j:function(a){var z=this.a
return z!=null?"UnimplementedError: "+H.j(z):"UnimplementedError"}},
br:{"^":"P;a",
j:function(a){return"Bad state: "+this.a}},
al:{"^":"P;a",
j:function(a){var z=this.a
if(z==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+H.j(P.bd(z))+"."}},
hy:{"^":"d;",
j:function(a){return"Out of Memory"},
gab:function(){return},
$isP:1},
dU:{"^":"d;",
j:function(a){return"Stack Overflow"},
gab:function(){return},
$isP:1},
fr:{"^":"P;a",
j:function(a){var z=this.a
return z==null?"Reading static variable during its initialization":"Reading static variable '"+H.j(z)+"' during its initialization"}},
iU:{"^":"d;a",
j:function(a){var z=this.a
if(z==null)return"Exception"
return"Exception: "+H.j(z)}},
fH:{"^":"d;a,b,c",
j:function(a){var z,y,x
z=this.a
y=""!==z?"FormatException: "+z:"FormatException"
x=this.b
if(x.length>78)x=C.a.b3(x,0,75)+"..."
return y+"\n"+x}},
fK:{"^":"d;",
j:function(a){return"IntegerDivisionByZeroException"}},
fC:{"^":"d;a,c9",
j:function(a){return"Expando:"+H.j(this.a)},
h:function(a,b){var z,y
z=this.c9
if(typeof z!=="string"){if(b==null||typeof b==="boolean"||typeof b==="number"||typeof b==="string")H.A(P.cf(b,"Expandos are not allowed on strings, numbers, booleans or null",null))
return z.get(b)}y=H.cx(b,"expando$values")
return y==null?null:H.cx(y,z)},
A:function(a,b,c){var z,y
z=this.c9
if(typeof z!=="string")z.set(b,c)
else{y=H.cx(b,"expando$values")
if(y==null){y=new P.d()
H.dM(b,"expando$values",y)}H.dM(y,z,c)}}},
q:{"^":"aN;"},
"+int":0,
e:{"^":"d;$ti",
a3:function(a,b){return H.bN(this,b,H.L(this,"e",0),null)},
N:function(a,b){return P.aj(this,!0,H.L(this,"e",0))},
S:function(a){return this.N(a,!0)},
gi:function(a){var z,y
z=this.gH(this)
for(y=0;z.v();)++y
return y},
gl:function(a){return!this.gH(this).v()},
I:function(a,b){var z,y,x
if(typeof b!=="number"||Math.floor(b)!==b)throw H.b(P.dc("index"))
if(b<0)H.A(P.Z(b,0,null,"index",null))
for(z=this.gH(this),y=0;z.v();){x=z.gD()
if(b===y)return x;++y}throw H.b(P.ac(b,this,"index",null,y))},
j:function(a){return P.h5(this,"(",")")},
$ase:null},
bL:{"^":"d;"},
k:{"^":"d;$ti",$ask:null,$ish:1,$ash:null,$ise:1,$ase:null},
"+List":0,
aV:{"^":"d;",
gF:function(a){return P.d.prototype.gF.call(this,this)},
j:function(a){return"null"}},
"+Null":0,
aN:{"^":"d;"},
"+num":0,
d:{"^":";",
C:function(a,b){return this===b},
gF:function(a){return H.ax(this)},
j:["dI",function(a){return H.bP(this)}],
bB:function(a,b){throw H.b(P.dF(this,b.gcU(),b.gd1(),b.gcY(),null))},
toString:function(){return this.j(this)}},
bq:{"^":"d;"},
O:{"^":"d;"},
"+String":0,
bR:{"^":"d;E@",
gi:function(a){return this.E.length},
gl:function(a){return this.E.length===0},
j:function(a){var z=this.E
return z.charCodeAt(0)==0?z:z},
w:{
dV:function(a,b,c){var z=J.aq(b)
if(!z.v())return a
if(c.length===0){do a+=H.j(z.gD())
while(z.v())}else{a+=H.j(z.gD())
for(;z.v();)a=a+c+H.j(z.gD())}return a}}},
bs:{"^":"d;"}}],["","",,W,{"^":"",
fq:function(a){return a.replace(/^-ms-/,"ms-").replace(/-([\da-z])/ig,function(b,c){return c.toUpperCase()})},
bW:function(a,b){a=536870911&a+b
a=536870911&a+((524287&a)<<10)
return a^a>>>6},
jF:function(a){if(a==null)return
return W.eh(a)},
kG:function(a){var z=$.z
if(z===C.c)return a
return z.eA(a,!0)},
F:{"^":"X;","%":"HTMLBRElement|HTMLBaseElement|HTMLContentElement|HTMLDListElement|HTMLDataListElement|HTMLDetailsElement|HTMLDialogElement|HTMLDirectoryElement|HTMLFontElement|HTMLFrameElement|HTMLHeadElement|HTMLHeadingElement|HTMLHtmlElement|HTMLLIElement|HTMLLabelElement|HTMLLegendElement|HTMLLinkElement|HTMLMarqueeElement|HTMLMenuElement|HTMLMenuItemElement|HTMLMeterElement|HTMLModElement|HTMLOListElement|HTMLOptGroupElement|HTMLOptionElement|HTMLParagraphElement|HTMLPictureElement|HTMLPreElement|HTMLProgressElement|HTMLQuoteElement|HTMLScriptElement|HTMLShadowElement|HTMLSourceElement|HTMLSpanElement|HTMLStyleElement|HTMLTableCaptionElement|HTMLTableCellElement|HTMLTableColElement|HTMLTableDataCellElement|HTMLTableElement|HTMLTableHeaderCellElement|HTMLTableRowElement|HTMLTableSectionElement|HTMLTemplateElement|HTMLTitleElement|HTMLTrackElement|HTMLUListElement|HTMLUnknownElement;HTMLElement"},
lk:{"^":"F;",
j:function(a){return String(a)},
$isl:1,
"%":"HTMLAnchorElement"},
lm:{"^":"F;",
j:function(a){return String(a)},
$isl:1,
"%":"HTMLAreaElement"},
cg:{"^":"l;",$iscg:1,"%":"Blob|File"},
ln:{"^":"F;",$isl:1,"%":"HTMLBodyElement"},
lo:{"^":"F;M:name=","%":"HTMLButtonElement"},
lp:{"^":"F;O:width}","%":"HTMLCanvasElement"},
lq:{"^":"o;i:length=",$isl:1,"%":"CDATASection|CharacterData|Comment|ProcessingInstruction|Text"},
ls:{"^":"fL;i:length=",
aQ:function(a,b){var z,y
z=$.$get$di()
y=z[b]
if(typeof y==="string")return y
y=W.fq(b) in a?b:P.fv()+b
z[b]=y
return y},
aT:function(a,b,c,d){if(c==null)c=""
a.setProperty(b,c,d)},
saF:function(a,b){a.color=b==null?"":b},
sbv:function(a,b){a.font=b},
sO:function(a,b){a.width=b==null?"":b},
"%":"CSS2Properties|CSSStyleDeclaration|MSStyleCSSProperties"},
fL:{"^":"l+fp;"},
fp:{"^":"d;",
saF:function(a,b){this.aT(a,this.aQ(a,"color"),b,"")},
sbv:function(a,b){this.aT(a,this.aQ(a,"font"),b,"")},
saO:function(a,b){this.aT(a,this.aQ(a,"size"),b,"")},
sO:function(a,b){this.aT(a,this.aQ(a,"width"),b,"")}},
dp:{"^":"F;",$isdp:1,"%":"HTMLDivElement"},
lt:{"^":"o;",$isl:1,"%":"DocumentFragment|ShadowRoot"},
lu:{"^":"l;",
j:function(a){return String(a)},
"%":"DOMException"},
lv:{"^":"l;i:length=",
u:function(a,b){return a.add(b)},
"%":"DOMTokenList"},
iH:{"^":"aT;a,b",
gl:function(a){return this.a.firstElementChild==null},
gi:function(a){return this.b.length},
h:function(a,b){var z=this.b
if(b>>>0!==b||b>=z.length)return H.m(z,b)
return z[b]},
A:function(a,b,c){var z=this.b
if(b>>>0!==b||b>=z.length)return H.m(z,b)
this.a.replaceChild(c,z[b])},
si:function(a,b){throw H.b(new P.y("Cannot resize element lists"))},
u:function(a,b){this.a.appendChild(b)
return b},
gH:function(a){var z=this.S(this)
return new J.bE(z,z.length,0,null)},
Y:function(a,b,c){var z,y,x
z=this.b
y=z.length
if(b>y)throw H.b(P.Z(b,0,this.gi(this),null,null))
x=this.a
if(b===y)x.appendChild(c)
else{if(b>=y)return H.m(z,b)
x.insertBefore(c,z[b])}},
$asaT:function(){return[W.X]},
$ask:function(){return[W.X]},
$ash:function(){return[W.X]},
$ase:function(){return[W.X]}},
X:{"^":"o;ca:namespaceURI=",
gcE:function(a){return new W.iH(a,a.children)},
gcG:function(a){return new W.iO(a)},
j:function(a){return a.localName},
gcZ:function(a){return new W.bV(a,"mousedown",!1,[W.bm])},
gd_:function(a){return new W.bV(a,"touchstart",!1,[W.bt])},
$isX:1,
$isd:1,
$isl:1,
"%":";Element"},
lw:{"^":"F;M:name=,O:width}","%":"HTMLEmbedElement"},
lx:{"^":"aG;ag:error=","%":"ErrorEvent"},
aG:{"^":"l;",
fi:function(a){return a.preventDefault()},
$isaG:1,
"%":"AnimationEvent|AnimationPlayerEvent|ApplicationCacheErrorEvent|AudioProcessingEvent|AutocompleteErrorEvent|BeforeInstallPromptEvent|BeforeUnloadEvent|BlobEvent|ClipboardEvent|CloseEvent|CustomEvent|DeviceLightEvent|DeviceMotionEvent|DeviceOrientationEvent|ExtendableEvent|ExtendableMessageEvent|FetchEvent|FontFaceSetLoadEvent|GamepadEvent|GeofencingEvent|HashChangeEvent|IDBVersionChangeEvent|InstallEvent|MIDIConnectionEvent|MIDIMessageEvent|MediaEncryptedEvent|MediaKeyMessageEvent|MediaQueryListEvent|MediaStreamEvent|MediaStreamTrackEvent|MessageEvent|NotificationEvent|OfflineAudioCompletionEvent|PageTransitionEvent|PopStateEvent|PresentationConnectionAvailableEvent|PresentationConnectionCloseEvent|ProgressEvent|PromiseRejectionEvent|PushEvent|RTCDTMFToneChangeEvent|RTCDataChannelEvent|RTCIceCandidateEvent|RTCPeerConnectionIceEvent|RelatedEvent|ResourceProgressEvent|SecurityPolicyViolationEvent|ServicePortConnectEvent|ServiceWorkerMessageEvent|SpeechRecognitionEvent|SpeechSynthesisEvent|StorageEvent|SyncEvent|TrackEvent|TransitionEvent|USBConnectionEvent|WebGLContextEvent|WebKitTransitionEvent;Event|InputEvent"},
ck:{"^":"l;",
dY:function(a,b,c,d){return a.addEventListener(b,H.b8(c,1),!1)},
ek:function(a,b,c,d){return a.removeEventListener(b,H.b8(c,1),!1)},
"%":"MediaStream|MessagePort;EventTarget"},
lQ:{"^":"F;M:name=","%":"HTMLFieldSetElement"},
lT:{"^":"F;i:length=,M:name=","%":"HTMLFormElement"},
lU:{"^":"F;aF:color}","%":"HTMLHRElement"},
lV:{"^":"fS;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)throw H.b(P.ac(b,a,null,null,null))
return a[b]},
A:function(a,b,c){throw H.b(new P.y("Cannot assign element of immutable List."))},
si:function(a,b){throw H.b(new P.y("Cannot resize immutable List."))},
I:function(a,b){if(b>>>0!==b||b>=a.length)return H.m(a,b)
return a[b]},
$isk:1,
$ask:function(){return[W.o]},
$ish:1,
$ash:function(){return[W.o]},
$ise:1,
$ase:function(){return[W.o]},
$isU:1,
$asU:function(){return[W.o]},
$isN:1,
$asN:function(){return[W.o]},
"%":"HTMLCollection|HTMLFormControlsCollection|HTMLOptionsCollection"},
fM:{"^":"l+a5;",
$ask:function(){return[W.o]},
$ash:function(){return[W.o]},
$ase:function(){return[W.o]},
$isk:1,
$ish:1,
$ise:1},
fS:{"^":"fM+aR;",
$ask:function(){return[W.o]},
$ash:function(){return[W.o]},
$ase:function(){return[W.o]},
$isk:1,
$ish:1,
$ise:1},
lW:{"^":"F;M:name=,O:width}","%":"HTMLIFrameElement"},
cm:{"^":"l;",$iscm:1,"%":"ImageData"},
lX:{"^":"F;O:width}","%":"HTMLImageElement"},
lZ:{"^":"F;M:name=,aO:size},O:width}",$isX:1,$isl:1,$iso:1,"%":"HTMLInputElement"},
m1:{"^":"F;M:name=","%":"HTMLKeygenElement"},
m3:{"^":"F;M:name=","%":"HTMLMapElement"},
hu:{"^":"F;ag:error=","%":"HTMLAudioElement;HTMLMediaElement"},
m6:{"^":"F;M:name=","%":"HTMLMetaElement"},
bm:{"^":"ea;",$isbm:1,"%":"DragEvent|MouseEvent|PointerEvent|WheelEvent"},
mh:{"^":"l;",$isl:1,"%":"Navigator"},
iG:{"^":"aT;a",
u:function(a,b){this.a.appendChild(b)},
A:function(a,b,c){var z,y
z=this.a
y=z.childNodes
if(b>>>0!==b||b>=y.length)return H.m(y,b)
z.replaceChild(c,y[b])},
gH:function(a){var z=this.a.childNodes
return new W.ds(z,z.length,-1,null)},
gi:function(a){return this.a.childNodes.length},
si:function(a,b){throw H.b(new P.y("Cannot set length on immutable List."))},
h:function(a,b){var z=this.a.childNodes
if(b>>>0!==b||b>=z.length)return H.m(z,b)
return z[b]},
$asaT:function(){return[W.o]},
$ask:function(){return[W.o]},
$ash:function(){return[W.o]},
$ase:function(){return[W.o]}},
o:{"^":"ck;a9:parentElement=,fg:parentNode=",
fm:function(a){var z=a.parentNode
if(z!=null)z.removeChild(a)},
fq:function(a,b){var z,y
try{z=a.parentNode
J.eY(z,b,a)}catch(y){H.a_(y)}return a},
j:function(a){var z=a.nodeValue
return z==null?this.dF(a):z},
el:function(a,b,c){return a.replaceChild(b,c)},
$iso:1,
$isd:1,
"%":"Document|HTMLDocument|XMLDocument;Node"},
mi:{"^":"fT;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)throw H.b(P.ac(b,a,null,null,null))
return a[b]},
A:function(a,b,c){throw H.b(new P.y("Cannot assign element of immutable List."))},
si:function(a,b){throw H.b(new P.y("Cannot resize immutable List."))},
I:function(a,b){if(b>>>0!==b||b>=a.length)return H.m(a,b)
return a[b]},
$isk:1,
$ask:function(){return[W.o]},
$ish:1,
$ash:function(){return[W.o]},
$ise:1,
$ase:function(){return[W.o]},
$isU:1,
$asU:function(){return[W.o]},
$isN:1,
$asN:function(){return[W.o]},
"%":"NodeList|RadioNodeList"},
fN:{"^":"l+a5;",
$ask:function(){return[W.o]},
$ash:function(){return[W.o]},
$ase:function(){return[W.o]},
$isk:1,
$ish:1,
$ise:1},
fT:{"^":"fN+aR;",
$ask:function(){return[W.o]},
$ash:function(){return[W.o]},
$ase:function(){return[W.o]},
$isk:1,
$ish:1,
$ise:1},
mk:{"^":"F;M:name=,O:width}","%":"HTMLObjectElement"},
ml:{"^":"F;M:name=","%":"HTMLOutputElement"},
mm:{"^":"F;M:name=","%":"HTMLParamElement"},
ms:{"^":"F;i:length=,M:name=,aO:size}","%":"HTMLSelectElement"},
mt:{"^":"F;M:name=","%":"HTMLSlotElement"},
mu:{"^":"aG;ag:error=","%":"SpeechRecognitionError"},
mx:{"^":"F;M:name=","%":"HTMLTextAreaElement"},
af:{"^":"l;",$isd:1,"%":"Touch"},
bt:{"^":"ea;",$isbt:1,"%":"TouchEvent"},
ip:{"^":"fU;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)throw H.b(P.ac(b,a,null,null,null))
return a[b]},
A:function(a,b,c){throw H.b(new P.y("Cannot assign element of immutable List."))},
si:function(a,b){throw H.b(new P.y("Cannot resize immutable List."))},
gar:function(a){if(a.length>0)return a[0]
throw H.b(new P.br("No elements"))},
I:function(a,b){if(b>>>0!==b||b>=a.length)return H.m(a,b)
return a[b]},
$isk:1,
$ask:function(){return[W.af]},
$ish:1,
$ash:function(){return[W.af]},
$ise:1,
$ase:function(){return[W.af]},
$isU:1,
$asU:function(){return[W.af]},
$isN:1,
$asN:function(){return[W.af]},
"%":"TouchList"},
fO:{"^":"l+a5;",
$ask:function(){return[W.af]},
$ash:function(){return[W.af]},
$ase:function(){return[W.af]},
$isk:1,
$ish:1,
$ise:1},
fU:{"^":"fO+aR;",
$ask:function(){return[W.af]},
$ash:function(){return[W.af]},
$ase:function(){return[W.af]},
$isk:1,
$ish:1,
$ise:1},
ea:{"^":"aG;","%":"CompositionEvent|FocusEvent|KeyboardEvent|SVGZoomEvent|TextEvent;UIEvent"},
mA:{"^":"hu;O:width}","%":"HTMLVideoElement"},
cF:{"^":"ck;",
ga9:function(a){return W.jF(a.parent)},
cW:function(a,b){a.moveTo(b.a,b.b)},
$iscF:1,
$isl:1,
"%":"DOMWindow|Window"},
mG:{"^":"o;M:name=,ca:namespaceURI=","%":"Attr"},
mH:{"^":"l;cw:bottom=,cQ:height=,bz:left=,d5:right=,bH:top=,O:width=",
j:function(a){return"Rectangle ("+H.j(a.left)+", "+H.j(a.top)+") "+H.j(a.width)+" x "+H.j(a.height)},
C:function(a,b){var z,y,x
if(b==null)return!1
z=J.n(b)
if(!z.$isaY)return!1
y=a.left
x=z.gbz(b)
if(y==null?x==null:y===x){y=a.top
x=z.gbH(b)
if(y==null?x==null:y===x){y=a.width
x=z.gO(b)
if(y==null?x==null:y===x){y=a.height
z=z.gcQ(b)
z=y==null?z==null:y===z}else z=!1}else z=!1}else z=!1
return z},
gF:function(a){var z,y,x,w,v
z=J.M(a.left)
y=J.M(a.top)
x=J.M(a.width)
w=J.M(a.height)
w=W.bW(W.bW(W.bW(W.bW(0,z),y),x),w)
v=536870911&w+((67108863&w)<<3)
v^=v>>>11
return 536870911&v+((16383&v)<<15)},
$isaY:1,
$asaY:I.Q,
"%":"ClientRect"},
mI:{"^":"o;",$isl:1,"%":"DocumentType"},
mJ:{"^":"F;",$isl:1,"%":"HTMLFrameSetElement"},
mK:{"^":"fV;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)throw H.b(P.ac(b,a,null,null,null))
return a[b]},
A:function(a,b,c){throw H.b(new P.y("Cannot assign element of immutable List."))},
si:function(a,b){throw H.b(new P.y("Cannot resize immutable List."))},
I:function(a,b){if(b>>>0!==b||b>=a.length)return H.m(a,b)
return a[b]},
$isk:1,
$ask:function(){return[W.o]},
$ish:1,
$ash:function(){return[W.o]},
$ise:1,
$ase:function(){return[W.o]},
$isU:1,
$asU:function(){return[W.o]},
$isN:1,
$asN:function(){return[W.o]},
"%":"MozNamedAttrMap|NamedNodeMap"},
fP:{"^":"l+a5;",
$ask:function(){return[W.o]},
$ash:function(){return[W.o]},
$ase:function(){return[W.o]},
$isk:1,
$ish:1,
$ise:1},
fV:{"^":"fP+aR;",
$ask:function(){return[W.o]},
$ash:function(){return[W.o]},
$ase:function(){return[W.o]},
$isk:1,
$ish:1,
$ise:1},
mO:{"^":"ck;",$isl:1,"%":"ServiceWorker"},
iD:{"^":"d;",
gZ:function(){var z,y,x,w,v,u
z=this.a.attributes
y=H.R([],[P.O])
for(x=z.length,w=0;w<x;++w){if(w>=z.length)return H.m(z,w)
v=z[w]
u=J.r(v)
if(u.gca(v)==null)y.push(u.gM(v))}return y},
gl:function(a){return this.gZ().length===0},
$isad:1,
$asad:function(){return[P.O,P.O]}},
iN:{"^":"iD;a",
h:function(a,b){return this.a.getAttribute(b)},
A:function(a,b,c){this.a.setAttribute(b,c)},
a0:function(a,b){var z,y
z=this.a
y=z.getAttribute(b)
z.removeAttribute(b)
return y},
gi:function(a){return this.gZ().length}},
iO:{"^":"dg;a",
U:function(){var z,y,x,w,v
z=P.av(null,null,null,P.O)
for(y=this.a.className.split(" "),x=y.length,w=0;w<y.length;y.length===x||(0,H.bB)(y),++w){v=J.db(y[w])
if(v.length!==0)z.u(0,v)}return z},
bJ:function(a){this.a.className=a.bx(0," ")},
gi:function(a){return this.a.classList.length},
gl:function(a){return this.a.classList.length===0},
aG:function(a,b){return typeof b==="string"&&this.a.classList.contains(b)},
u:function(a,b){var z,y
z=this.a.classList
y=z.contains(b)
z.add(b)
return!y},
dc:function(a,b,c){var z=W.iP(this.a,b,c)
return z},
w:{
iP:function(a,b,c){var z=a.classList
if(c){z.add(b)
return!0}else{z.remove(b)
return!1}}}},
bv:{"^":"ay;a,b,c,$ti",
as:function(a,b,c,d){return W.bw(this.a,this.b,a,!1,H.B(this,0))},
cT:function(a,b,c){return this.as(a,null,b,c)}},
bV:{"^":"bv;a,b,c,$ti"},
iS:{"^":"i5;a,b,c,d,e,$ti",
aD:function(){if(this.b==null)return
this.ct()
this.b=null
this.d=null
return},
bC:function(a,b){if(this.b==null)return;++this.a
this.ct()},
d0:function(a){return this.bC(a,null)},
gbw:function(){return this.a>0},
d4:function(){if(this.b==null||this.a<=0)return;--this.a
this.cr()},
cr:function(){var z,y,x
z=this.d
y=z!=null
if(y&&this.a<=0){x=this.b
x.toString
if(y)J.eW(x,this.c,z,!1)}},
ct:function(){var z,y,x
z=this.d
y=z!=null
if(y){x=this.b
x.toString
if(y)J.eX(x,this.c,z,!1)}},
dU:function(a,b,c,d,e){this.cr()},
w:{
bw:function(a,b,c,d,e){var z=c==null?null:W.kG(new W.iT(c))
z=new W.iS(0,a,b,z,!1,[e])
z.dU(a,b,c,!1,e)
return z}}},
iT:{"^":"c:0;a",
$1:[function(a){return this.a.$1(a)},null,null,2,0,null,28,"call"]},
aR:{"^":"d;$ti",
gH:function(a){return new W.ds(a,this.gi(a),-1,null)},
u:function(a,b){throw H.b(new P.y("Cannot add to immutable List."))},
$isk:1,
$ask:null,
$ish:1,
$ash:null,
$ise:1,
$ase:null},
ds:{"^":"d;a,b,c,d",
v:function(){var z,y
z=this.c+1
y=this.b
if(z<y){this.d=J.d2(this.a,z)
this.c=z
return!0}this.d=null
this.c=y
return!1},
gD:function(){return this.d}},
iJ:{"^":"d;a",
ga9:function(a){return W.eh(this.a.parent)},
$isl:1,
w:{
eh:function(a){if(a===window)return a
else return new W.iJ(a)}}}}],["","",,P,{"^":"",
dn:function(){var z=$.dm
if(z==null){z=J.ca(window.navigator.userAgent,"Opera",0)
$.dm=z}return z},
fv:function(){var z,y
z=$.dj
if(z!=null)return z
y=$.dk
if(y==null){y=J.ca(window.navigator.userAgent,"Firefox",0)
$.dk=y}if(y)z="-moz-"
else{y=$.dl
if(y==null){y=P.dn()!==!0&&J.ca(window.navigator.userAgent,"Trident/",0)
$.dl=y}if(y)z="-ms-"
else z=P.dn()===!0?"-o-":"-webkit-"}$.dj=z
return z},
dg:{"^":"d;",
bp:function(a){if($.$get$dh().b.test(H.b7(a)))return a
throw H.b(P.cf(a,"value","Not a valid class token"))},
j:function(a){return this.U().bx(0," ")},
dc:function(a,b,c){var z,y
this.bp(b)
z=this.U()
if(c){z.u(0,b)
y=!0}else{z.a0(0,b)
y=!1}this.bJ(z)
return y},
gH:function(a){var z,y
z=this.U()
y=new P.b1(z,z.r,null,null)
y.c=z.e
return y},
a3:function(a,b){var z=this.U()
return new H.cj(z,b,[H.B(z,0),null])},
gl:function(a){return this.U().a===0},
gi:function(a){return this.U().a},
aG:function(a,b){if(typeof b!=="string")return!1
this.bp(b)
return this.U().aG(0,b)},
bA:function(a){return this.aG(0,a)?a:null},
u:function(a,b){this.bp(b)
return this.fa(new P.fo(b))},
N:function(a,b){return this.U().N(0,!0)},
S:function(a){return this.N(a,!0)},
I:function(a,b){return this.U().I(0,b)},
fa:function(a){var z,y
z=this.U()
y=a.$1(z)
this.bJ(z)
return y},
$ish:1,
$ash:function(){return[P.O]},
$ise:1,
$ase:function(){return[P.O]}},
fo:{"^":"c:0;a",
$1:function(a){return a.u(0,this.a)}},
fD:{"^":"aT;a,b",
ga6:function(){var z,y
z=this.b
y=H.L(z,"a5",0)
return new H.bM(new H.is(z,new P.fE(),[y]),new P.fF(),[y,null])},
A:function(a,b,c){var z=this.ga6()
J.f4(z.b.$1(J.aP(z.a,b)),c)},
si:function(a,b){var z=J.W(this.ga6().a)
if(b>=z)return
else if(b<0)throw H.b(P.aD("Invalid list length"))
this.fp(0,b,z)},
u:function(a,b){this.b.a.appendChild(b)},
fp:function(a,b,c){var z=this.ga6()
z=H.i1(z,b,H.L(z,"e",0))
C.b.a8(P.aj(H.ig(z,c-b,H.L(z,"e",0)),!0,null),new P.fG())},
Y:function(a,b,c){var z,y
if(b===J.W(this.ga6().a))this.b.a.appendChild(c)
else{z=this.ga6()
y=z.b.$1(J.aP(z.a,b))
J.f0(y).insertBefore(c,y)}},
gi:function(a){return J.W(this.ga6().a)},
h:function(a,b){var z=this.ga6()
return z.b.$1(J.aP(z.a,b))},
gH:function(a){var z=P.aj(this.ga6(),!1,W.X)
return new J.bE(z,z.length,0,null)},
$asaT:function(){return[W.X]},
$ask:function(){return[W.X]},
$ash:function(){return[W.X]},
$ase:function(){return[W.X]}},
fE:{"^":"c:0;",
$1:function(a){return!!J.n(a).$isX}},
fF:{"^":"c:0;",
$1:[function(a){return H.bA(a,"$isX")},null,null,2,0,null,34,"call"]},
fG:{"^":"c:0;",
$1:function(a){return J.cc(a)}}}],["","",,P,{"^":"",cr:{"^":"l;",$iscr:1,"%":"IDBKeyRange"}}],["","",,P,{"^":"",
jw:[function(a,b,c,d){var z,y,x
if(b===!0){z=[c]
C.b.T(z,d)
d=z}y=P.aj(J.aC(d,P.l4()),!0,null)
x=H.hB(a,y)
return P.bY(x)},null,null,8,0,null,44,42,41,39],
cO:function(a,b,c){var z
try{if(Object.isExtensible(a)&&!Object.prototype.hasOwnProperty.call(a,b)){Object.defineProperty(a,b,{value:c})
return!0}}catch(z){H.a_(z)}return!1},
es:function(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]
return},
bY:[function(a){var z
if(a==null||typeof a==="string"||typeof a==="number"||typeof a==="boolean")return a
z=J.n(a)
if(!!z.$isbj)return a.a
if(!!z.$iscg||!!z.$isaG||!!z.$iscr||!!z.$iscm||!!z.$iso||!!z.$isa8||!!z.$iscF)return a
if(!!z.$isbI)return H.Y(a)
if(!!z.$iscl)return P.er(a,"$dart_jsFunction",new P.jG())
return P.er(a,"_$dart_jsObject",new P.jH($.$get$cN()))},"$1","ag",2,0,0,17],
er:function(a,b,c){var z=P.es(a,b)
if(z==null){z=c.$1(a)
P.cO(a,b,z)}return z},
cM:[function(a){var z,y
if(a==null||typeof a=="string"||typeof a=="number"||typeof a=="boolean")return a
else{if(a instanceof Object){z=J.n(a)
z=!!z.$iscg||!!z.$isaG||!!z.$iscr||!!z.$iscm||!!z.$iso||!!z.$isa8||!!z.$iscF}else z=!1
if(z)return a
else if(a instanceof Date){z=0+a.getTime()
y=new P.bI(z,!1)
y.bQ(z,!1)
return y}else if(a.constructor===$.$get$cN())return a.o
else return P.cS(a)}},"$1","l4",2,0,40,17],
cS:function(a){if(typeof a=="function")return P.cP(a,$.$get$bH(),new P.kD())
if(a instanceof Array)return P.cP(a,$.$get$cH(),new P.kE())
return P.cP(a,$.$get$cH(),new P.kF())},
cP:function(a,b,c){var z=P.es(a,b)
if(z==null||!(a instanceof Object)){z=c.$1(a)
P.cO(a,b,z)}return z},
bj:{"^":"d;a",
h:["dH",function(a,b){if(typeof b!=="string"&&typeof b!=="number")throw H.b(P.aD("property is not a String or num"))
return P.cM(this.a[b])}],
A:["bP",function(a,b,c){if(typeof b!=="string"&&typeof b!=="number")throw H.b(P.aD("property is not a String or num"))
this.a[b]=P.bY(c)}],
gF:function(a){return 0},
C:function(a,b){if(b==null)return!1
return b instanceof P.bj&&this.a===b.a},
j:function(a){var z,y
try{z=String(this.a)
return z}catch(y){H.a_(y)
z=this.dI(this)
return z}},
eB:function(a,b){var z,y
z=this.a
y=b==null?null:P.aj(new H.a3(b,P.ag(),[H.B(b,0),null]),!0,null)
return P.cM(z[a].apply(z,y))},
w:{
a2:function(a){return P.cS(P.hk(a))},
hk:function(a){return new P.hl(new P.jb(0,null,null,null,null,[null,null])).$1(a)}}},
hl:{"^":"c:0;a",
$1:[function(a){var z,y,x,w,v
z=this.a
if(z.ap(a))return z.h(0,a)
y=J.n(a)
if(!!y.$isad){x={}
z.A(0,a,x)
for(z=J.aq(a.gZ());z.v();){w=z.gD()
x[w]=this.$1(y.h(a,w))}return x}else if(!!y.$ise){v=[]
z.A(0,a,v)
C.b.T(v,y.a3(a,this))
return v}else return P.bY(a)},null,null,2,0,null,17,"call"]},
hg:{"^":"bj;a",
ew:function(a,b){var z,y
z=P.bY(b)
y=P.aj(new H.a3(a,P.ag(),[H.B(a,0),null]),!0,null)
return P.cM(this.a.apply(z,y))},
ev:function(a){return this.ew(a,null)}},
ai:{"^":"hj;a,$ti",
h:function(a,b){var z
if(typeof b==="number"&&b===C.d.aM(b)){if(typeof b==="number"&&Math.floor(b)===b)z=b<0||b>=this.gi(this)
else z=!1
if(z)H.A(P.Z(b,0,this.gi(this),null,null))}return this.dH(0,b)},
A:function(a,b,c){var z
if(typeof b==="number"&&b===C.d.aM(b)){if(typeof b==="number"&&Math.floor(b)===b)z=b<0||b>=this.gi(this)
else z=!1
if(z)H.A(P.Z(b,0,this.gi(this),null,null))}this.bP(0,b,c)},
gi:function(a){var z=this.a.length
if(typeof z==="number"&&z>>>0===z)return z
throw H.b(new P.br("Bad JsArray length"))},
si:function(a,b){this.bP(0,"length",b)},
u:function(a,b){this.eB("push",[b])}},
hj:{"^":"bj+a5;",$ask:null,$ash:null,$ase:null,$isk:1,$ish:1,$ise:1},
jG:{"^":"c:0;",
$1:function(a){var z=function(b,c,d){return function(){return b(c,d,this,Array.prototype.slice.apply(arguments))}}(P.jw,a,!1)
P.cO(z,$.$get$bH(),a)
return z}},
jH:{"^":"c:0;a",
$1:function(a){return new this.a(a)}},
kD:{"^":"c:0;",
$1:function(a){return new P.hg(a)}},
kE:{"^":"c:0;",
$1:function(a){return new P.ai(a,[null])}},
kF:{"^":"c:0;",
$1:function(a){return new P.bj(a)}}}],["","",,P,{"^":"",
b0:function(a,b){a=536870911&a+b
a=536870911&a+((524287&a)<<10)
return a^a>>>6},
em:function(a){a=536870911&a+((67108863&a)<<3)
a^=a>>>11
return 536870911&a+((16383&a)<<15)},
aX:{"^":"d;n:a>,p:b>,$ti",
j:function(a){return"Point("+H.j(this.a)+", "+H.j(this.b)+")"},
C:function(a,b){var z,y
if(b==null)return!1
if(!(b instanceof P.aX))return!1
z=this.a
y=b.a
if(z==null?y==null:z===y){z=this.b
y=b.b
y=z==null?y==null:z===y
z=y}else z=!1
return z},
gF:function(a){var z,y
z=J.M(this.a)
y=J.M(this.b)
return P.em(P.b0(P.b0(0,z),y))},
m:function(a,b){var z,y,x,w
z=this.a
y=J.r(b)
x=y.gn(b)
if(typeof z!=="number")return z.m()
if(typeof x!=="number")return H.p(x)
w=this.b
y=y.gp(b)
if(typeof w!=="number")return w.m()
if(typeof y!=="number")return H.p(y)
return new P.aX(z+x,w+y,this.$ti)},
t:function(a,b){var z,y,x,w
z=this.a
y=J.r(b)
x=y.gn(b)
if(typeof z!=="number")return z.t()
if(typeof x!=="number")return H.p(x)
w=this.b
y=y.gp(b)
if(typeof w!=="number")return w.t()
if(typeof y!=="number")return H.p(y)
return new P.aX(z-x,w-y,this.$ti)},
q:function(a,b){var z,y
z=this.a
if(typeof z!=="number")return z.q()
if(typeof b!=="number")return H.p(b)
y=this.b
if(typeof y!=="number")return y.q()
return new P.aX(z*b,y*b,this.$ti)}},
jo:{"^":"d;$ti",
gd5:function(a){var z,y
z=this.a
y=this.c
if(typeof z!=="number")return z.m()
if(typeof y!=="number")return H.p(y)
return z+y},
gcw:function(a){var z,y
z=this.b
y=this.d
if(typeof z!=="number")return z.m()
if(typeof y!=="number")return H.p(y)
return z+y},
j:function(a){return"Rectangle ("+H.j(this.a)+", "+H.j(this.b)+") "+H.j(this.c)+" x "+H.j(this.d)},
C:function(a,b){var z,y,x,w
if(b==null)return!1
z=J.n(b)
if(!z.$isaY)return!1
y=this.a
x=z.gbz(b)
if(y==null?x==null:y===x){x=this.b
w=z.gbH(b)
if(x==null?w==null:x===w){w=this.c
if(typeof y!=="number")return y.m()
if(typeof w!=="number")return H.p(w)
if(y+w===z.gd5(b)){y=this.d
if(typeof x!=="number")return x.m()
if(typeof y!=="number")return H.p(y)
z=x+y===z.gcw(b)}else z=!1}else z=!1}else z=!1
return z},
gF:function(a){var z,y,x,w,v,u
z=this.a
y=J.M(z)
x=this.b
w=J.M(x)
v=this.c
if(typeof z!=="number")return z.m()
if(typeof v!=="number")return H.p(v)
u=this.d
if(typeof x!=="number")return x.m()
if(typeof u!=="number")return H.p(u)
return P.em(P.b0(P.b0(P.b0(P.b0(0,y),w),z+v&0x1FFFFFFF),x+u&0x1FFFFFFF))}},
aY:{"^":"jo;bz:a>,bH:b>,O:c>,cQ:d>,$ti",$asaY:null,w:{
hL:function(a,b,c,d,e){var z,y
if(typeof c!=="number")return c.L()
if(c<0)z=-c*0
else z=c
if(typeof d!=="number")return d.L()
if(d<0)y=-d*0
else y=d
return new P.aY(a,b,z,y,[e])}}}}],["","",,P,{"^":"",lj:{"^":"aI;",$isl:1,"%":"SVGAElement"},ll:{"^":"x;",$isl:1,"%":"SVGAnimateElement|SVGAnimateMotionElement|SVGAnimateTransformElement|SVGAnimationElement|SVGSetElement"},lr:{"^":"dt;au:r=","%":"SVGCircleElement"},ly:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEBlendElement"},lz:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEColorMatrixElement"},lA:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEComponentTransferElement"},lB:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFECompositeElement"},lC:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEConvolveMatrixElement"},lD:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEDiffuseLightingElement"},lE:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEDisplacementMapElement"},lF:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEFloodElement"},lG:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEGaussianBlurElement"},lH:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEImageElement"},lI:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEMergeElement"},lJ:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEMorphologyElement"},lK:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFEOffsetElement"},lL:{"^":"x;n:x=,p:y=","%":"SVGFEPointLightElement"},lM:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFESpecularLightingElement"},lN:{"^":"x;n:x=,p:y=","%":"SVGFESpotLightElement"},lO:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFETileElement"},lP:{"^":"x;K:result=,n:x=,p:y=",$isl:1,"%":"SVGFETurbulenceElement"},lR:{"^":"x;n:x=,p:y=",$isl:1,"%":"SVGFilterElement"},lS:{"^":"aI;n:x=,p:y=","%":"SVGForeignObjectElement"},dt:{"^":"aI;","%":"SVGEllipseElement|SVGLineElement|SVGPathElement|SVGPolygonElement|SVGPolylineElement;SVGGeometryElement"},aI:{"^":"x;",$isl:1,"%":"SVGClipPathElement|SVGDefsElement|SVGGElement|SVGSwitchElement;SVGGraphicsElement"},lY:{"^":"aI;n:x=,p:y=",$isl:1,"%":"SVGImageElement"},am:{"^":"l;",$isd:1,"%":"SVGLength"},m2:{"^":"fW;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)throw H.b(P.ac(b,a,null,null,null))
return a.getItem(b)},
A:function(a,b,c){throw H.b(new P.y("Cannot assign element of immutable List."))},
si:function(a,b){throw H.b(new P.y("Cannot resize immutable List."))},
I:function(a,b){return this.h(a,b)},
$isk:1,
$ask:function(){return[P.am]},
$ish:1,
$ash:function(){return[P.am]},
$ise:1,
$ase:function(){return[P.am]},
"%":"SVGLengthList"},fQ:{"^":"l+a5;",
$ask:function(){return[P.am]},
$ash:function(){return[P.am]},
$ase:function(){return[P.am]},
$isk:1,
$ish:1,
$ise:1},fW:{"^":"fQ+aR;",
$ask:function(){return[P.am]},
$ash:function(){return[P.am]},
$ase:function(){return[P.am]},
$isk:1,
$ish:1,
$ise:1},m4:{"^":"x;",$isl:1,"%":"SVGMarkerElement"},m5:{"^":"x;n:x=,p:y=",$isl:1,"%":"SVGMaskElement"},an:{"^":"l;",$isd:1,"%":"SVGNumber"},mj:{"^":"fX;",
gi:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)throw H.b(P.ac(b,a,null,null,null))
return a.getItem(b)},
A:function(a,b,c){throw H.b(new P.y("Cannot assign element of immutable List."))},
si:function(a,b){throw H.b(new P.y("Cannot resize immutable List."))},
I:function(a,b){return this.h(a,b)},
$isk:1,
$ask:function(){return[P.an]},
$ish:1,
$ash:function(){return[P.an]},
$ise:1,
$ase:function(){return[P.an]},
"%":"SVGNumberList"},fR:{"^":"l+a5;",
$ask:function(){return[P.an]},
$ash:function(){return[P.an]},
$ase:function(){return[P.an]},
$isk:1,
$ish:1,
$ise:1},fX:{"^":"fR+aR;",
$ask:function(){return[P.an]},
$ash:function(){return[P.an]},
$ase:function(){return[P.an]},
$isk:1,
$ish:1,
$ise:1},mn:{"^":"x;n:x=,p:y=",$isl:1,"%":"SVGPatternElement"},mo:{"^":"j5;au:r=","%":"SVGRadialGradientElement"},mp:{"^":"l;O:width},n:x=,p:y=","%":"SVGRect"},mq:{"^":"dt;n:x=,p:y=","%":"SVGRectElement"},mr:{"^":"x;",$isl:1,"%":"SVGScriptElement"},fa:{"^":"dg;a",
U:function(){var z,y,x,w,v,u
z=this.a.getAttribute("class")
y=P.av(null,null,null,P.O)
if(z==null)return y
for(x=z.split(" "),w=x.length,v=0;v<x.length;x.length===w||(0,H.bB)(x),++v){u=J.db(x[v])
if(u.length!==0)y.u(0,u)}return y},
bJ:function(a){this.a.setAttribute("class",a.bx(0," "))}},x:{"^":"X;",
gcG:function(a){return new P.fa(a)},
gcE:function(a){return new P.fD(a,new W.iG(a))},
gcZ:function(a){return new W.bV(a,"mousedown",!1,[W.bm])},
gd_:function(a){return new W.bV(a,"touchstart",!1,[W.bt])},
$isl:1,
"%":"SVGComponentTransferFunctionElement|SVGDescElement|SVGDiscardElement|SVGFEDistantLightElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement|SVGFEMergeNodeElement|SVGMetadataElement|SVGStopElement|SVGStyleElement|SVGTitleElement;SVGElement"},mv:{"^":"aI;n:x=,p:y=",$isl:1,"%":"SVGSVGElement"},mw:{"^":"x;",$isl:1,"%":"SVGSymbolElement"},dY:{"^":"aI;","%":";SVGTextContentElement"},cD:{"^":"ii;",$iscD:1,"%":"SVGTextElement"},my:{"^":"dY;",$isl:1,"%":"SVGTextPathElement"},ii:{"^":"dY;n:x=,p:y=","%":"SVGTSpanElement;SVGTextPositioningElement"},mz:{"^":"aI;n:x=,p:y=",$isl:1,"%":"SVGUseElement"},mB:{"^":"x;",$isl:1,"%":"SVGViewElement"},j5:{"^":"x;",$isl:1,"%":"SVGLinearGradientElement;SVGGradientElement"},mL:{"^":"x;",$isl:1,"%":"SVGCursorElement"},mM:{"^":"x;",$isl:1,"%":"SVGFEDropShadowElement"},mN:{"^":"x;",$isl:1,"%":"SVGMPathElement"}}],["","",,P,{"^":""}],["","",,P,{"^":""}],["","",,P,{"^":""}],["","",,L,{"^":"",
fc:function(){if(P.aZ("iPad|iPhone|iPod",!0,!1).b.test(H.b7(window.navigator.userAgent)))var z=1
else z=null==window.navigator.maxTouchPoints?0:window.navigator.maxTouchPoints
if(typeof z!=="number")return z.V()
return z>0}}],["","",,M,{"^":"",fn:{"^":"ee;bK:f?",
gcV:function(){return 32},
gbq:function(){return this.f.gbq()},
gbu:function(){return this.f.gbu()},
dO:function(a,b,c){var z,y,x,w,v,u,t,s,r
z=this.a
y=z.style
y.position="relative"
y=this.e
z.appendChild(y)
x=y.style
x.position="absolute"
x.width="100%"
x.height="100%"
w=this.b
v=this.c
u=this.gcV()
w=J.aB(w,u)?w:u
this.b=w
if(null==v)v=this.c
t=this.gcV()
v=J.aB(v,t)?v:t
this.c=v
x=T.a(w)
s=T.a(v)
z=z.style
x=x.j(0)+"px"
z.width=x
x=s.j(0)+"px"
z.height=x
z=new N.hO(this,null,new O.i(T.a(0),T.a(0)),0,0,null,null,null,null,[],[],new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
r=document.createElementNS("http://www.w3.org/2000/svg","g")
z.c=r
z.P()
z.b=z
z.c=y
z.P()
this.f=z}},ie:{"^":"fn;"}}],["","",,E,{"^":"",fw:{"^":"iu;"},dT:{"^":"fw;x,y,z,Q,ch,cx,d,e,f,r,a,b,c",
dg:function(){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l,k,j
z=[]
y=this.z.a
x=J.C(J.ap(J.a4(y,24)),1)
w=this.Q.a
v=J.cU(w)
u=J.G(J.c9(v.q(w,24)),1)
for(t=this.x,s=this.y,r=x;q=J.w(r),q.b_(r,u);r=q.m(r,1)){p=q.B(r,24)
if(typeof p==="number")p=new T.f(p)
else{o=J.n(p)
p=!!o.$isf?p:new T.f(o.J(p))}o=t.a
n=s.a
m=J.a0(J.C(p.a,y),v.t(w,y))
if(typeof m==="number")m=new T.f(m)
else{l=J.n(m)
m=!!l.$isf?m:new T.f(l.J(m))}o=J.G(o,J.a4(m.a,J.C(n,o)))
if(typeof o==="number")o=new T.f(o)
else{n=J.n(o)
o=!!n.$isf?o:new T.f(n.J(o))}p=new T.f(360).q(0,p).m(0,this.ch)
if(o.gcR()){o=o.ak(0)
p=p.m(0,new T.f(180))
k=o
o=p
p=k}else{k=o
o=p
p=k}j=o.a
o=J.w(j)
if(!o.L(j,0)){if(typeof j!=="number")return H.p(j)
n=360<=j}else n=!0
if(n){j=o.t(j,0)
o=J.w(j)
j=J.G(o.t(j,J.a4(J.ap(o.B(j,360)),360)),0)}if(typeof j==="number")o=new T.f(j)
else{o=J.n(j)
o=!!o.$isf?j:new T.f(o.J(j))}o=o.a
if(typeof o!=="number")return H.p(o)
o=3.141592653589793*o/180
n=Math.cos(H.v(new T.f(o).a))
n=p.q(0,new T.f(n))
o=Math.sin(H.v(new T.f(o).a))
p=p.q(0,new T.f(o))
z.push(new O.i(n,p))}y=this.cx
y.x=z
y.k("d",y.a4())}},i3:{"^":"I;x,y,z,d,e,f,r,a,b,c",
b1:function(a,b,c,d){var z,y
z=b.gf1()
y=new Q.V(a)
this.e=y
this.k("transform",y.ac())
y=this.x
J.d8(y,b.m(0,T.a(1)))
y.sb2(null!=c?c:"lightgrey")
y=this.y
J.d8(y,b)
y.sb2("none")
J.da(this.x,z)
J.da(this.y,z)},
bM:function(a,b,c){return this.b1(a,b,c,null)},
bL:function(a,b){return this.b1(a,b,null,null)}},bn:{"^":"dT;cy,db,x,y,z,Q,ch,cx,d,e,f,r,a,b,c",
fh:function(a){var z,y,x,w,v,u
z=this.z
y=T.D(z)
x=a.a
w=J.w(x)
if(w.L(x,y))z=new O.i(T.a(0),T.a(0))
else{z=z.a
y=this.Q.a
v=this.x.a
u=this.y.a
v=T.a(J.G(v,J.a4(T.a(J.a0(w.t(x,z),J.C(y,z))).a,J.C(u,v))))
u=T.a(360).q(0,a).m(0,this.ch)
u=O.cA(T.a(v),T.a(u)).da()
z=u}return z},
f5:function(a,b,c,d){var z,y,x,w,v,u,t,s,r
if(null!=c){z=this.y
y=this.x
x=this.Q
w=this.z
v=z.t(0,y).B(0,x.t(0,w)).B(0,T.a(2.4))
u=T.D(w)
t=b.a
s=J.w(t)
if(s.L(t,u))z=new O.i(T.a(0),T.a(0))
else{w=w.a
x=x.a
y=y.a
z=z.a
y=T.a(J.G(y,J.a4(T.a(J.a0(s.t(t,w),J.C(x,w))).a,J.C(z,y))))
z=T.a(360).q(0,b).m(0,this.ch)
z=O.cA(T.a(y),T.a(z)).da()}y=[]
x=new E.i3(null,null,null,y,new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
w=document
r=w.createElementNS("http://www.w3.org/2000/svg","g")
x.c=r
x.P()
u=T.a(0)
t=T.a(0)
t=new A.as(T.a(0),new O.i(u,t),null,null,null,!1,null,null,null)
r=w.createElementNS("http://www.w3.org/2000/svg","circle")
t.c=r
t.X()
t.k("r",t.y)
x.x=x.Y(0,y.length,t)
u=T.a(0)
t=T.a(0)
t=new A.as(T.a(0),new O.i(u,t),null,null,null,!1,null,null,null)
r=w.createElementNS("http://www.w3.org/2000/svg","circle")
t.c=r
t.X()
t.k("r",t.y)
x.y=x.Y(0,y.length,t)
x.b1(z,v,c,null)
J.aa(a,x)}if(null!=d){z=this.e.a
y=this.z.a
x=this.Q.a
w=this.x.a
v=this.y.a
z=new A.as(T.a(J.G(w,J.a4(T.a(J.a0(J.C(b.a,y),J.C(x,y))).a,J.C(v,w)))),z,null,null,null,!1,null,null,null)
r=document.createElementNS("http://www.w3.org/2000/svg","circle")
z.c=r
z.X()
z.k("r",z.y)
z.k("stroke",d)
z.k("fill",null)
J.aa(a,z)}}}}],["","",,Q,{"^":"",fI:{"^":"bk;x,d,e,f,r,a,b,c",
bj:function(a,b,c,d){var z,y,x,w,v,u,t,s,r,q,p,o
z=new Q.V(a)
this.e=z
this.k("transform",z.ac())
z=b.a
y=c.a
x=z.B(0,y)
w=b.b.B(0,c.b)
x=T.a(x)
v=new O.i(x,T.a(w))
y=y.a
if(typeof y!=="number")return H.p(y)
x=x.a
u=0
for(;u<=y;++u){if(typeof x!=="number")return H.p(x)
t=u*x
w=b.b
s=J.n(w)
w=!!s.$isf?w:new T.f(s.J(w))
w=new A.au(new O.i(new T.f(t),new T.f(0)),new O.i(new T.f(t),w),null,null,null,!1,null,null,null)
r=document.createElementNS("http://www.w3.org/2000/svg","line")
w.c=r
w.a1()
s=J.S(w.x)
q=null==s?"":J.u(s)
s=J.E(q)
p=w.c
if(s===!0){p.getAttribute("x1")
p.removeAttribute("x1")}else p.setAttribute("x1",q)
s=J.T(w.x)
q=null==s?"":J.u(s)
s=J.E(q)
p=w.c
if(s===!0){p.getAttribute("y1")
p.removeAttribute("y1")}else p.setAttribute("y1",q)
s=J.S(w.y)
q=null==s?"":J.u(s)
s=J.E(q)
p=w.c
if(s===!0){p.getAttribute("x2")
p.removeAttribute("x2")}else p.setAttribute("x2",q)
s=J.T(w.y)
q=null==s?"":J.u(s)
s=J.E(q)
p=w.c
if(s===!0){p.getAttribute("y2")
p.removeAttribute("y2")}else p.setAttribute("y2",q)
s=C.a.gl("")
p=w.c
if(s){p.getAttribute("stroke")
p.removeAttribute("stroke")}else p.setAttribute("stroke","")
s=C.a.gl("")
p=w.c
if(s){p.getAttribute("fill")
p.removeAttribute("fill")}else p.setAttribute("fill","")
this.u(0,w).cJ()}u=0
while(!0){y=c.b.a
if(typeof y!=="number")return H.p(y)
if(!(u<=y))break
y=v.b.a
if(typeof y!=="number")return H.p(y)
o=u*y
y=new A.au(new O.i(new T.f(0),new T.f(o)),new O.i(z,new T.f(o)),null,null,null,!1,null,null,null)
r=document.createElementNS("http://www.w3.org/2000/svg","line")
y.c=r
y.a1()
x=J.S(y.x)
q=null==x?"":J.u(x)
x=J.E(q)
w=y.c
if(x===!0){w.getAttribute("x1")
w.removeAttribute("x1")}else w.setAttribute("x1",q)
x=J.T(y.x)
q=null==x?"":J.u(x)
x=J.E(q)
w=y.c
if(x===!0){w.getAttribute("y1")
w.removeAttribute("y1")}else w.setAttribute("y1",q)
x=J.S(y.y)
q=null==x?"":J.u(x)
x=J.E(q)
w=y.c
if(x===!0){w.getAttribute("x2")
w.removeAttribute("x2")}else w.setAttribute("x2",q)
x=J.T(y.y)
q=null==x?"":J.u(x)
x=J.E(q)
w=y.c
if(x===!0){w.getAttribute("y2")
w.removeAttribute("y2")}else w.setAttribute("y2",q)
x=C.a.gl("")
w=y.c
if(x){w.getAttribute("stroke")
w.removeAttribute("stroke")}else w.setAttribute("stroke","")
x=C.a.gl("")
w=y.c
if(x){w.getAttribute("fill")
w.removeAttribute("fill")}else w.setAttribute("fill","")
this.u(0,y).cJ();++u}if(null!=d){z=$.$get$cY()
z=A.c3(this,new O.i(T.a(4),T.a(z)),d,"none","blue")
y=J.r(z)
y.sbv(z,$.l5)
y.saO(z,$.$get$cY())}}},cw:{"^":"bk;x,d,e,f,r,a,b,c",
bj:function(a,b,c,d){var z,y,x,w,v,u,t,s,r,q,p,o,n
z=new Q.V(a)
this.e=z
this.k("transform",z.ac())
for(z=c.a,y=J.w(z),x=1;!0;++x){w=J.a4(y.B(z,10),x)
if(typeof w==="number")v=new T.f(w)
else{u=J.n(w)
v=!!u.$isf?w:new T.f(u.J(w))}if(J.aB(v.a,b.a))break
w=new A.as(v,new O.i(new T.f(0),new T.f(0)),null,null,null,!1,null,null,null)
t=document.createElementNS("http://www.w3.org/2000/svg","circle")
w.c=t
w.X()
u=w.y
s=null==u?"":u.j(0)
u=C.a.gl(s)
r=w.c
if(u){r.getAttribute("r")
r.removeAttribute("r")}else r.setAttribute("r",s)
u=C.a.gl("")
r=w.c
if(u){r.getAttribute("stroke")
r.removeAttribute("stroke")}else r.setAttribute("stroke","")
u=C.a.gl("")
r=w.c
if(u){r.getAttribute("fill")
r.removeAttribute("fill")}else r.setAttribute("fill","")
q=this.u(0,w)
if(5===x)q.aq("black")
else if(10===x)q.bO("black")
else q.aq("gray")}for(x=0;x<12;++x){z=30*x
y=Math.sin(H.v(new T.f(3.141592653589793*z/180).a))
y=new T.f(y).q(0,b)
z=new T.f(z).m(0,new T.f(180)).a
if(typeof z!=="number")return H.p(z)
z=Math.cos(H.v(new T.f(3.141592653589793*z/180).a))
z=new T.f(z).q(0,b)
z=new A.au(new O.i(new T.f(0),new T.f(0)),new O.i(y,z),null,null,null,!1,null,null,null)
t=document.createElementNS("http://www.w3.org/2000/svg","line")
z.c=t
z.a1()
y=J.S(z.x)
s=null==y?"":J.u(y)
y=J.E(s)
w=z.c
if(y===!0){w.getAttribute("x1")
w.removeAttribute("x1")}else w.setAttribute("x1",s)
y=J.T(z.x)
s=null==y?"":J.u(y)
y=J.E(s)
w=z.c
if(y===!0){w.getAttribute("y1")
w.removeAttribute("y1")}else w.setAttribute("y1",s)
y=J.S(z.y)
s=null==y?"":J.u(y)
y=J.E(s)
w=z.c
if(y===!0){w.getAttribute("x2")
w.removeAttribute("x2")}else w.setAttribute("x2",s)
y=J.T(z.y)
s=null==y?"":J.u(y)
y=J.E(s)
w=z.c
if(y===!0){w.getAttribute("y2")
w.removeAttribute("y2")}else w.setAttribute("y2",s)
y=C.a.gl("")
w=z.c
if(y){w.getAttribute("stroke")
w.removeAttribute("stroke")}else w.setAttribute("stroke","")
y=C.a.gl("")
w=z.c
if(y){w.getAttribute("fill")
w.removeAttribute("fill")}else w.setAttribute("fill","")
this.u(0,z).aq("gray")}if(d===!0)for(z=[0,90,180,270],y=this.x,p=0;p<4;++p){o=z[p]
w=new T.f(o)
u=w.a
if(typeof u!=="number")return H.p(u)
u=Math.sin(H.v(new T.f(3.141592653589793*u/180).a))
u=new T.f(u).q(0,b)
w=w.m(0,new T.f(180)).a
if(typeof w!=="number")return H.p(w)
w=Math.cos(H.v(new T.f(3.141592653589793*w/180).a))
w=new T.f(w).q(0,b)
r=C.e.j(o)+"\xb0"
w=new A.aS(r,null,null,new O.i(u,w),null,null,null,!1,null,null,null)
t=document.createElementNS("http://www.w3.org/2000/svg","text")
w.c=t
w.X()
s=w.z
if(null==s)s=""
u=C.a.gl(s)
n=w.c
if(u){n.getAttribute("font-family")
n.removeAttribute("font-family")}else n.setAttribute("font-family",s)
u=w.Q
s=null==u?"":u.j(0)
u=C.a.gl(s)
n=w.c
if(u){n.getAttribute("font-size")
n.removeAttribute("font-size")}else n.setAttribute("font-size",s)
w.c.textContent=r
u=C.a.gl("black")
r=w.c
if(u){r.getAttribute("fill")
r.removeAttribute("fill")}else r.setAttribute("fill","black")
u=C.a.gl("none")
r=w.c
if(u){r.getAttribute("stroke")
r.removeAttribute("stroke")}else r.setAttribute("stroke","none")
y.push(this.u(0,w))}},
aj:function(a,b){var z,y
z=J.n(b)
z=!!z.$isf?b:new T.f(z.J(b))
z=z.a
if(typeof z!=="number")return H.p(z)
z=Math.sin(H.v(new T.f(3.141592653589793*z/180).a))
z=new T.f(z).q(0,a)
y=b.m(0,new T.f(180)).a
if(typeof y!=="number")return H.p(y)
y=Math.cos(H.v(new T.f(3.141592653589793*y/180).a))
y=new T.f(y).q(0,a)
return new O.i(z,y)}},bl:{"^":"bk;ay:y<,z,Q,ch,cx,x,d,e,f,r,a,b,c",
ef:function(a,b,a0){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
z=new Q.V(a)
this.e=z
this.k("transform",z.ac())
y=this.z
for(z=this.ch,x=this.Q,w=a0===!0,v=this.x,u=y;!0;){t=Math.log(H.v(u.a))
t=J.ap(new T.f(t*0.4342944819032518).a)
if(typeof t==="number")t=new T.f(t)
else{s=J.n(t)
t=!!s.$isf?t:new T.f(s.J(t))}t=Math.exp(H.v(J.a0(t.a,0.4342944819032518)))
r=new T.f(t)
s=J.bD(u.B(0,r).a)
if(typeof s==="number")s=new T.f(s)
else{q=J.n(s)
s=!!q.$isf?s:new T.f(q.J(s))}u=s.q(0,r)
s=u.a
q=J.w(s)
if(q.V(s,x.a))break
p=this.aj(u,z).a
o=this.y.b
n=J.n(o)
o=!!n.$isf?o:new T.f(n.J(o))
o=new A.au(new O.i(p,new T.f(0)),new O.i(p,o),null,null,null,!1,null,null,null)
n=document
m=n.createElementNS("http://www.w3.org/2000/svg","line")
o.c=m
o.a1()
l=J.S(o.x)
k=null==l?"":J.u(l)
l=J.E(k)
j=o.c
if(l===!0){j.getAttribute("x1")
j.removeAttribute("x1")}else j.setAttribute("x1",k)
l=J.T(o.x)
k=null==l?"":J.u(l)
l=J.E(k)
j=o.c
if(l===!0){j.getAttribute("y1")
j.removeAttribute("y1")}else j.setAttribute("y1",k)
l=J.S(o.y)
k=null==l?"":J.u(l)
l=J.E(k)
j=o.c
if(l===!0){j.getAttribute("x2")
j.removeAttribute("x2")}else j.setAttribute("x2",k)
l=J.T(o.y)
k=null==l?"":J.u(l)
l=J.E(k)
j=o.c
if(l===!0){j.getAttribute("y2")
j.removeAttribute("y2")}else j.setAttribute("y2",k)
l=C.a.gl("")
j=o.c
if(l){j.getAttribute("stroke")
j.removeAttribute("stroke")}else j.setAttribute("stroke","")
l=C.a.gl("")
j=o.c
if(l){j.getAttribute("fill")
j.removeAttribute("fill")}else j.setAttribute("fill","")
i=this.u(0,o)
q=q.R(s)
if(typeof q==="number")q=new T.f(q)
else{o=J.n(q)
q=!!o.$isf?q:new T.f(o.J(q))}t=C.d.R(t)
if(q.C(0,new T.f(t))){i.aq("gray")
if(w){t=this.y.b
q=J.n(t)
t=!!q.$isf?t:new T.f(q.J(t))
s=Math.log(H.v(s))
s=J.ap(new T.f(s*0.4342944819032518).a)
if(typeof s==="number")s=new T.f(s)
else{q=J.n(s)
s=!!q.$isf?s:new T.f(q.J(s))}s=Math.exp(H.v(J.a0(s.a,0.4342944819032518)))
s=C.d.R(s)
s=new T.f(s).j(0)
t=new A.aS(s,null,null,new O.i(p,t),null,null,null,!1,null,null,null)
m=n.createElementNS("http://www.w3.org/2000/svg","text")
t.c=m
t.X()
k=t.z
if(null==k)k=""
q=C.a.gl(k)
o=t.c
if(q){o.getAttribute("font-family")
o.removeAttribute("font-family")}else o.setAttribute("font-family",k)
q=t.Q
k=null==q?"":q.j(0)
q=C.a.gl(k)
o=t.c
if(q){o.getAttribute("font-size")
o.removeAttribute("font-size")}else o.setAttribute("font-size",k)
t.c.textContent=s
s=C.a.gl("black")
q=t.c
if(s){q.getAttribute("fill")
q.removeAttribute("fill")}else q.setAttribute("fill","black")
s=C.a.gl("none")
q=t.c
if(s){q.getAttribute("stroke")
q.removeAttribute("stroke")}else q.setAttribute("stroke","none")
v.push(this.u(0,t))}}else i.aV("gray")
u=u.m(0,r)}x=this.cx
h=J.cd(T.a(Math.exp(H.v(J.a0(T.a(J.ap(T.a(Math.log(H.v(x.t(0,z).a))*0.4342944819032518).a)).a,0.4342944819032518)))).a)
g=T.a(h/10)
f=T.a(J.ap(z.B(0,g).a))
e=T.a(J.c9(x.B(0,g).a))
for(d=J.cd(f.a),z=e.a,x=J.w(z),w=g.a,t=b===!0;d<x.aM(z);++d){if(typeof w!=="number")return H.p(w)
c=this.aj(y,new T.f(d*w)).b
s=J.n(c)
s=!!s.$isf?c:new T.f(s.J(c))
q=this.y.a
o=J.n(c)
o=!!o.$isf?c:new T.f(o.J(c))
o=new A.au(new O.i(new T.f(0),s),new O.i(q,o),null,null,null,!1,null,null,null)
q=document
m=q.createElementNS("http://www.w3.org/2000/svg","line")
o.c=m
o.a1()
s=J.S(o.x)
k=null==s?"":J.u(s)
s=J.E(k)
n=o.c
if(s===!0){n.getAttribute("x1")
n.removeAttribute("x1")}else n.setAttribute("x1",k)
s=J.T(o.x)
k=null==s?"":J.u(s)
s=J.E(k)
n=o.c
if(s===!0){n.getAttribute("y1")
n.removeAttribute("y1")}else n.setAttribute("y1",k)
s=J.S(o.y)
k=null==s?"":J.u(s)
s=J.E(k)
n=o.c
if(s===!0){n.getAttribute("x2")
n.removeAttribute("x2")}else n.setAttribute("x2",k)
s=J.T(o.y)
k=null==s?"":J.u(s)
s=J.E(k)
n=o.c
if(s===!0){n.getAttribute("y2")
n.removeAttribute("y2")}else n.setAttribute("y2",k)
s=C.a.gl("")
n=o.c
if(s){n.getAttribute("stroke")
n.removeAttribute("stroke")}else n.setAttribute("stroke","")
s=C.a.gl("")
n=o.c
if(s){n.getAttribute("fill")
n.removeAttribute("fill")}else n.setAttribute("fill","")
i=this.u(0,o)
if(0===C.e.dj(d,h)){i.aq("gray")
if(t){s=J.n(c)
s=!!s.$isf?c:new T.f(s.J(c))
o=C.d.R(w)
o=new T.f(o).a
if(typeof o!=="number")return H.p(o)
o=new T.f(d*o).j(0)
s=new A.aS(o,null,null,new O.i(new T.f(0),s),null,null,null,!1,null,null,null)
m=q.createElementNS("http://www.w3.org/2000/svg","text")
s.c=m
s.X()
k=s.z
if(null==k)k=""
q=C.a.gl(k)
n=s.c
if(q){n.getAttribute("font-family")
n.removeAttribute("font-family")}else n.setAttribute("font-family",k)
q=s.Q
k=null==q?"":q.j(0)
q=C.a.gl(k)
n=s.c
if(q){n.getAttribute("font-size")
n.removeAttribute("font-size")}else n.setAttribute("font-size",k)
s.c.textContent=o
q=C.a.gl("black")
o=s.c
if(q){o.getAttribute("fill")
o.removeAttribute("fill")}else o.setAttribute("fill","black")
q=C.a.gl("none")
o=s.c
if(q){o.getAttribute("stroke")
o.removeAttribute("stroke")}else o.setAttribute("stroke","none")
v.push(this.u(0,s))}}else i.aV("gray")}},
aj:function(a,b){var z,y,x
z=Math.log(H.v(a.a))
y=this.z.a
x=Math.log(H.v(y))
z=new T.f(z*0.4342944819032518).t(0,new T.f(x*0.4342944819032518))
x=Math.log(H.v(this.Q.a))
y=Math.log(H.v(y))
z=z.B(0,new T.f(x*0.4342944819032518).t(0,new T.f(y*0.4342944819032518))).q(0,this.y.a)
y=this.cx
y=y.t(0,b).B(0,y.t(0,this.ch)).q(0,this.y.b)
return new O.i(z,y)},
eN:function(a,b){var z,y,x
z=a.B(0,this.y.a)
y=T.a(Math.log(H.v(this.Q.a))*0.4342944819032518)
x=this.z.a
x=T.a(Math.exp(H.v(J.a0(z.q(0,y.t(0,T.a(Math.log(H.v(x))*0.4342944819032518))).m(0,T.a(Math.log(H.v(x))*0.4342944819032518)).a,0.4342944819032518))))
y=this.cx
y=y.t(0,b.B(0,this.y.b).q(0,y.t(0,this.ch)))
return new O.i(T.a(x),T.a(y))},
fw:function(a){var z=A.c3(this,this.aj(this.Q,this.ch),a,"black","none")
z.cS()
return z},
fz:function(a){return A.c3(this,this.aj(this.z,this.cx),a,"black","none")}}}],["","",,A,{"^":"",ed:{"^":"d;a",
gcK:function(){return this.a},
bN:function(a,b){J.d4(this.a).dc(0,"hidden",!b)},
sO:function(a,b){var z,y
z=this.a.style
y=H.j(b)+"px"
z.width=y},
saF:function(a,b){var z=this.a.style
z.toString
z.color=b==null?"":b},
cu:function(a){J.d4(this.a).u(0,a)},
gay:function(){var z,y
z=this.a
z=P.hL(z.clientLeft,z.clientTop,z.clientWidth,z.clientHeight,null)
y=T.a(z.c)
z=T.a(z.d)
return new O.i(T.a(y),T.a(z))}},ee:{"^":"ed;b,c,d,a",
bS:function(a,b){var z=null!=b
this.b=T.a(J.bD((z?b.a:T.a(this.a.clientWidth)).a)).a
this.c=T.a(J.bD((z?b.b:T.a(this.a.clientHeight)).a)).a
W.bw(window,"resize",new A.iw(this),!1,W.aG)},
w:{
iv:function(a,b){var z,y
z=a instanceof A.ed?a.a:document.querySelector(a)
y=new A.ee(null,null,null,z)
y.bS(a,b)
return y}}},iw:{"^":"c:0;a",
$1:function(a){return}}}],["","",,X,{"^":"",cz:{"^":"ie;ff:x<,y,z,e,f,r,b,c,d,a",
ex:function(){var z,y
if(null==this.y){z=new A.f8(null,null,null)
z.bR("arrowBeg")
z.k("markerUnits","strokeWidth")
z.k("markerWidth","5")
z.k("markerHeight","4")
z.k("orient","auto")
z.k("viewBox","0 0 10 10")
z.k("fill","black")
z.k("refX","5")
z.k("refY","5")
y=A.dI(null)
y.k("d","M 10 0 L 0 5 L 10 10 z")
z.c.appendChild(y.c)
this.y=z
this.e.appendChild(z.c)}if(null==this.z){z=new A.f9(null,null,null)
z.bR("arrowEnd")
z.k("markerUnits","strokeWidth")
z.k("markerWidth","5")
z.k("markerHeight","4")
z.k("orient","auto")
z.k("viewBox","0 0 10 10")
z.k("fill","black")
z.k("refX","5")
z.k("refY","5")
y=A.dI(null)
y.k("d","M 0 0 L 10 5 L 0 10 z")
z.c.appendChild(y.c)
this.z=z
this.e.appendChild(z.c)}}}}],["","",,F,{"^":"",
kj:function(){return P.a2(P.J(["$",new F.kk(),"sz",new F.kl(),"fbo",new F.km(),"arrowBegEnd",new F.kn()]))},
k3:function(){return P.a2(P.J(["color",new F.k4(),"stroke",new F.k5(),"fill",new F.k6(),"width",new F.k7(),"solidStroke",new F.k8(),"dottedStroke",new F.k9(),"dashedStroke",new F.ka()]))},
kq:function(){return P.a2(P.J(["movable",new F.ks(),"moveTo",new F.kt(),"markerBeg",new F.ku(),"markerEnd",new F.kv()]))},
jU:function(){return P.a2(P.J(["$",new F.jV(),"set",new F.jW()]))},
jz:function(){return P.a2(P.J(["$",new F.jA(),"closeTo",new F.jB(),"atr",new F.jC(),"atp",new F.jD()]))},
ky:function(){return P.a2(P.J(["$",new F.kz(),"set",new F.kA(),"sc",new F.kB(),"tr",new F.kC()]))},
jQ:function(){return P.a2(P.J(["$",new F.jR(),"center",new F.jS(),"leftCenter",new F.jT()]))},
jJ:function(){return P.a2(P.J(["$",new F.jK()]))},
kg:function(){return P.a2(P.J(["$",new F.kh(),"toXY",new F.ki()]))},
jX:function(){return P.a2(P.J(["$",new F.jY(),"toXY",new F.jZ(),"fromXY",new F.k_(),"xLegend",new F.k0(),"yLegend",new F.k1()]))},
kw:function(){return P.a2(P.J(["$",new F.kx()]))},
kc:function(){return P.a2(P.J(["$",new F.kd(),"markPitch",new F.ke(),"toXY",new F.kf()]))},
jL:function(){return P.a2(P.J(["$",new F.jN()]))},
mU:[function(){J.eV($.$get$eG(),"QuintMachine_dart$",P.a2(P.J(["degSin",new F.l7(),"degCos",new F.l8(),"toPch",new F.l9(),"toCps",new F.la(),"qm",F.kj(),"node",F.k3(),"shape",F.kq(),"line",F.jU(),"circle",F.jz(),"spline",F.ky(),"label",F.jQ(),"grid",F.jJ(),"polarGrid",F.kg(),"loglinGrid",F.jX(),"spiral",F.kw(),"pitchSpiral",F.kc(),"handle",F.jL()])))},"$0","eL",0,0,1],
kk:{"^":"c:25;",
$2:[function(a,b){var z,y,x,w,v,u,t,s,r,q
z=A.iv(C.a.m("#",a),null)
y=z.a
x=y.parentElement
w=x.clientWidth
v=x.clientHeight
u=J.bC(w,0,w)
t=J.bC(v,0,v)
u=T.a(u)
s=new O.i(u,T.a(t))
if(null!=b){t=T.a(b)
u=T.a(u.B(0,t))
s.b=u}u=document
r=u.createElementNS("http://www.w3.org/2000/svg","svg")
r.setAttribute("version","1.1")
t=new X.cz(null,null,null,r,null,!1,null,null,null,y)
t.bS(z,s)
t.dO(z,r,s)
t.cu("quint")
if(P.aZ("iPad|iPhone|iPod",!0,!1).b.test(H.b7(window.navigator.userAgent)))q=1
else q=null==window.navigator.maxTouchPoints?0:window.navigator.maxTouchPoints
if(typeof q!=="number")return q.V()
if(q>0)t.cu("touch")
u=H.bA(J.d3(y).u(0,u.createElement("div")),"$isdp")
t.x=u
u.classList.add("overlay")
return t},null,null,4,0,null,38,66,"call"]},
kl:{"^":"c:5;",
$1:[function(a){var z,y
z=a.gay()
y=J.r(z)
z=[y.gn(z).gG(),y.gp(z).gG()]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,2,0,null,18,"call"]},
km:{"^":"c:5;",
$1:[function(a){var z,y
z=[a.gbu(),a.gbq(),a.gff()]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,2,0,null,18,"call"]},
kn:{"^":"c:5;",
$1:[function(a){return a.ex()},null,null,2,0,null,18,"call"]},
k4:{"^":"c:3;",
$2:[function(a,b){J.f5(a,b)},null,null,4,0,null,4,3,"call"]},
k5:{"^":"c:3;",
$2:[function(a,b){a.sb2(b)},null,null,4,0,null,4,3,"call"]},
k6:{"^":"c:3;",
$2:[function(a,b){a.seM(b)},null,null,4,0,null,4,3,"call"]},
k7:{"^":"c:3;",
$2:[function(a,b){J.d9(a,b)},null,null,4,0,null,4,30,"call"]},
k8:{"^":"c:3;",
$2:[function(a,b){a.bO(b)},null,null,4,0,null,4,3,"call"]},
k9:{"^":"c:3;",
$2:[function(a,b){a.aV(b)},null,null,4,0,null,4,3,"call"]},
ka:{"^":"c:3;",
$2:[function(a,b){a.aq(b)},null,null,4,0,null,4,3,"call"]},
ks:{"^":"c:21;",
$2:[function(a,b){a.fb(null==b?null:new F.kr(b))},function(a){return this.$2(a,null)},"$1",null,null,null,2,2,null,1,11,36,"call"]},
kr:{"^":"c:22;a",
$3:[function(a,b,c){var z,y,x
z=J.r(a)
z=[z.gn(a).gG(),z.gp(a).gG()]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
y=this.a.ev([new P.ai(y,[null])])
if(null==y)z=null
else{z=J.t(y)
x=T.a(z.h(y,0))
y=T.a(z.h(y,1))
y=new O.i(T.a(x),T.a(y))
z=y}return z},null,null,6,0,null,0,63,49,"call"]},
kt:{"^":"c:6;",
$2:[function(a,b){var z,y
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}J.f2(a,z)},null,null,4,0,null,11,0,"call"]},
ku:{"^":"c:6;",
$2:[function(a,b){a.sf6(b)},null,null,4,0,null,11,6,"call"]},
kv:{"^":"c:6;",
$2:[function(a,b){a.sf7(b)},null,null,4,0,null,11,6,"call"]},
jV:{"^":"c:24;",
$5:[function(a,b,c,d,e){var z,y,x,w,v
z=new O.i(T.a(0),T.a(0))
if(!(null==b)){z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}y=new O.i(T.a(0),T.a(0))
if(!(null==c)){y=J.t(c)
x=T.a(y.h(c,0))
y=T.a(y.h(c,1))
y=new O.i(T.a(x),T.a(y))}y=new A.au(z,y,null,null,null,!1,null,null,null)
w=document.createElementNS("http://www.w3.org/2000/svg","line")
y.c=w
y.a1()
y.aY()
y.aZ()
y.k("stroke",d)
y.k("fill",null)
v=J.aa(a,y)
if(null!=e)J.d9(v,e)
return v},function(a,b,c){return this.$5(a,b,c,null,null)},"$3",function(a,b,c,d){return this.$5(a,b,c,d,null)},"$4",null,null,null,null,6,4,null,1,1,2,25,19,3,30,"call"]},
jW:{"^":"c:41;",
$3:[function(a,b,c){var z,y,x
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}if(null==c)y=null
else{y=J.t(c)
x=T.a(y.h(c,0))
y=T.a(y.h(c,1))
y=new O.i(T.a(x),T.a(y))}return a.bL(z,y)},null,null,6,0,null,40,25,19,"call"]},
jA:{"^":"c:26;",
$4:[function(a,b,c,d){var z,y,x
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}z=new A.as(null==c?null:T.a(c),z,null,null,null,!1,null,null,null)
x=document.createElementNS("http://www.w3.org/2000/svg","circle")
z.c=x
z.X()
z.k("r",z.y)
z.k("stroke",d)
z.k("fill",null)
return J.aa(a,z)},null,null,8,0,null,2,0,10,3,"call"]},
jB:{"^":"c:7;",
$2:[function(a,b){var z,y
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}z=a.cH(z)
y=J.r(z)
z=[y.gn(z).gG(),y.gp(z).gG()]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,4,0,null,16,0,"call"]},
jC:{"^":"c:7;",
$2:[function(a,b){var z,y
z=a.ez(null==b?null:T.a(b))
z=[z.a.a,z.b.a]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,4,0,null,16,10,"call"]},
jD:{"^":"c:7;",
$2:[function(a,b){var z,y
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}return a.ey(z).a},null,null,4,0,null,16,0,"call"]},
kz:{"^":"c:8;",
$5:[function(a,b,c,d,e){var z,y
z=J.aC(J.ce(c),O.eR()).S(0)
y=new A.cB(b,z,null,null,null,null,null,!1,null,null,null)
y.aP(z)
y.k("stroke",d)
y.k("fill",e)
return J.aa(a,y)},function(a,b,c,d){return this.$5(a,b,c,d,null)},"$4",null,null,null,8,2,null,1,2,43,20,3,45,"call"]},
kA:{"^":"c:28;",
$4:[function(a,b,c,d){var z,y,x,w
z=J.aC(J.ce(b),O.eR()).S(0)
if(null==c)y=null
else{y=J.t(c)
x=T.a(y.h(c,0))
y=T.a(y.h(c,1))
y=new O.i(T.a(x),T.a(y))}if(null==d)x=null
else{x=J.t(d)
w=T.a(x.h(d,0))
x=T.a(x.h(d,1))
x=new O.i(T.a(w),T.a(x))}a.bM(z,y,x)},function(a,b){return this.$4(a,b,null,null)},"$2",function(a,b,c){return this.$4(a,b,c,null)},"$3",null,null,null,null,4,4,null,1,1,15,20,22,21,"call"]},
kB:{"^":"c:12;",
$2:[function(a,b){var z,y
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}a.sdk(z)},null,null,4,0,null,15,22,"call"]},
kC:{"^":"c:12;",
$2:[function(a,b){var z,y
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}a.saX(z)},null,null,4,0,null,15,21,"call"]},
jR:{"^":"c:29;",
$4:[function(a,b,c,d){var z,y,x
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}x=A.c3(a,z,c,"black","none")
if(d===!0)x.bs()
return x},function(a,b,c){return this.$4(a,b,c,!1)},"$3",null,null,null,6,2,null,8,2,0,6,50,"call"]},
jS:{"^":"c:9;",
$1:[function(a){a.bs()},null,null,2,0,null,29,"call"]},
jT:{"^":"c:9;",
$1:[function(a){a.cS()},null,null,2,0,null,29,"call"]},
jK:{"^":"c:8;",
$5:[function(a,b,c,d,e){var z,y,x,w,v
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}if(null==c)y=null
else{y=J.t(c)
x=T.a(y.h(c,0))
y=T.a(y.h(c,1))
y=new O.i(T.a(x),T.a(y))}if(null==d)x=null
else{x=J.t(d)
w=T.a(x.h(d,0))
x=T.a(x.h(d,1))
x=new O.i(T.a(w),T.a(x))}w=new Q.fI([],[],new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
v=document.createElementNS("http://www.w3.org/2000/svg","g")
w.c=v
w.P()
w.bj(z,y,x,e)
return J.aa(a,w)},function(a,b,c,d){return this.$5(a,b,c,d,null)},"$4",null,null,null,8,2,null,1,2,0,23,34,53,"call"]},
kh:{"^":"c:8;",
$5:[function(a,b,c,d,e){var z,y,x,w,v
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}y=null==c?null:T.a(c)
x=null==d?null:T.a(d)
w=new Q.cw([],[],new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
v=document.createElementNS("http://www.w3.org/2000/svg","g")
w.c=v
w.P()
w.bj(z,y,x,e)
a=J.aa(a,w)
w.cC()
return a},function(a,b,c,d){return this.$5(a,b,c,d,!1)},"$4",null,null,null,8,2,null,8,2,0,10,54,55,"call"]},
ki:{"^":"c:31;",
$3:[function(a,b,c){var z,y
z=null==b?null:T.a(b)
z=a.aj(z,null==c?null:T.a(c))
z=[z.a.a,z.b.a]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,6,0,null,56,10,57,"call"]},
jY:{"^":"c:32;",
$9:[function(a,b,c,d,e,f,g,h,i){var z,y,x,w,v,u,t,s
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}if(null==c)y=null
else{y=J.t(c)
x=T.a(y.h(c,0))
y=T.a(y.h(c,1))
y=new O.i(T.a(x),T.a(y))}x=null==d?null:T.a(d)
w=null==e?null:T.a(e)
v=null==f?null:T.a(f)
u=null==g?null:T.a(g)
t=new Q.bl(y,x,w,v,u,[],[],new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
s=document.createElementNS("http://www.w3.org/2000/svg","g")
t.c=s
t.P()
t.ef(z,h,i)
a=J.aa(a,t)
t.cC()
return a},null,null,14,4,null,8,8,2,0,23,58,59,60,61,62,79,"call"]},
jZ:{"^":"c:13;",
$3:[function(a,b,c){var z,y
z=null==b?null:T.a(b)
z=a.aj(z,null==c?null:T.a(c))
z=[z.a.a,z.b.a]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,6,0,null,7,5,27,"call"]},
k_:{"^":"c:13;",
$3:[function(a,b,c){var z,y
z=null==b?null:T.a(b)
z=a.eN(z,null==c?null:T.a(c))
z=[z.a.a,z.b.a]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,6,0,null,7,5,27,"call"]},
k0:{"^":"c:14;",
$2:[function(a,b){return a.fw(b)},null,null,4,0,null,7,6,"call"]},
k1:{"^":"c:14;",
$2:[function(a,b){return a.fz(b)},null,null,4,0,null,7,6,"call"]},
kx:{"^":"c:33;",
$7:[function(a,b,c,d,e,f,g){var z,y,x,w,v,u,t,s
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}y=null==c?null:T.a(c)
x=null==d?null:T.a(d)
w=null==e?null:T.a(e)
v=null==f?null:T.a(f)
u=null==g?null:T.a(g)
t=[]
u=new E.dT(y,x,w,v,u,null,t,new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
s=document.createElementNS("http://www.w3.org/2000/svg","g")
u.c=s
u.P()
if(null==u.ch)u.ch=T.a(0)
y=new A.cB(!0,[],null,null,null,null,null,!1,null,null,null)
y.aP(null)
u.cx=y
u.Y(0,t.length,y)
u.dg()
z=new Q.V(z)
u.e=z
u.k("transform",z.ac())
return J.aa(a,u)},null,null,12,2,null,1,2,0,33,26,68,69,70,"call"]},
kd:{"^":"c:34;",
$7:[function(a,b,c,d,e,f,g){var z,y,x,w,v,u,t,s
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}y=null==c?null:T.a(c)
x=null==d?null:T.a(d)
w=null==e?null:new M.ae(T.D(e))
v=null==f?null:new M.ae(T.D(f))
u=null==g?null:new M.ae(T.D(g))
t=[]
u=new E.bn(null,new M.ae(T.D(0)),y,x,w,u,T.a(J.C(J.a4(J.c8(J.d7(v.a,1)),360),90)),null,t,new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
s=document.createElementNS("http://www.w3.org/2000/svg","g")
u.c=s
u.P()
if(null==u.ch)u.ch=T.a(0)
y=new A.cB(!0,[],null,null,null,null,null,!1,null,null,null)
y.aP(null)
u.cx=y
u.Y(0,t.length,y)
u.dg()
u.cy=v
z=new Q.V(z)
u.e=z
u.k("transform",z.ac())
return J.aa(a,u)},null,null,14,0,null,2,0,33,26,71,72,73,"call"]},
ke:{"^":"c:35;",
$4:[function(a,b,c,d){return a.f5(a,null==b?null:new M.ae(T.D(b)),c,d)},function(a,b){return this.$4(a,b,null,null)},"$2",function(a,b,c){return this.$4(a,b,c,null)},"$3",null,null,null,null,4,4,null,1,1,32,12,76,77,"call"]},
kf:{"^":"c:36;",
$2:[function(a,b){var z,y
z=a.fh(null==b?null:new M.ae(T.D(b)))
z=[z.a.a,z.b.a]
y=[]
C.b.T(y,new H.a3(z,P.ag(),[H.B(z,0),null]))
return new P.ai(y,[null])},null,null,4,0,null,32,12,"call"]},
jN:{"^":"c:37;",
$3:[function(a,b,c){var z,y,x,w
if(null==b)z=null
else{z=J.t(b)
y=T.a(z.h(b,0))
z=T.a(z.h(b,1))
z=new O.i(T.a(y),T.a(z))}y=$.$get$et()
x=null!=c?c:$.jM
z=new A.as(y,z,null,null,null,!1,null,null,null)
w=document.createElementNS("http://www.w3.org/2000/svg","circle")
z.c=w
z.X()
z.k("r",z.y)
z.k("stroke",null)
z.k("fill",x)
return J.aa(a,z)},function(a,b){return this.$3(a,b,null)},"$2",null,null,null,4,2,null,1,2,0,3,"call"]},
l7:{"^":"c:0;",
$1:[function(a){var z=(null==a?null:T.a(a)).a
if(typeof z!=="number")return H.p(z)
return T.a(Math.sin(H.v(T.a(3.141592653589793*z/180).a))).a},null,null,2,0,null,5,"call"]},
l8:{"^":"c:0;",
$1:[function(a){var z=(null==a?null:T.a(a)).a
if(typeof z!=="number")return H.p(z)
return T.a(Math.cos(H.v(T.a(3.141592653589793*z/180).a))).a},null,null,2,0,null,5,"call"]},
l9:{"^":"c:0;",
$1:[function(a){var z,y
z=T.D(a)
y=J.w(z)
return(y.V(z,0)?new M.ae(T.D(T.a(Math.log(H.v(T.D(y.B(z,T.D($.dZ/1.681792830507427)))))*1.4426950408889634).m(0,new M.ae(T.D(8))))):new M.ae(T.D(-1000))).a},null,null,2,0,null,78,"call"]},
la:{"^":"c:0;",
$1:[function(a){return T.D(T.a(Math.log(H.v(T.D(J.C(T.D(a),T.D(8)))))*1.4426950408889634).q(0,new M.bb(T.D($.dZ/1.681792830507427))))},null,null,2,0,null,12,"call"]}},1],["","",,T,{"^":"",
a:function(a){var z
if(typeof a==="number")z=new T.f(a)
else{z=J.n(a)
z=!!z.$isf?a:new T.f(z.J(a))}return z},
D:function(a){var z
if(typeof a==="number")z=a
else{z=J.n(a)
z=!!z.$isf?a.a:new T.f(z.J(a))}return z},
f:{"^":"d;G:a<",
j:function(a){return J.u(this.a)},
gF:function(a){return J.M(this.a)},
gf1:function(){return J.aB(this.a,0)},
gcR:function(){return J.b9(this.a,0)},
aM:function(a){return J.cd(this.a)},
J:function(a){return J.f7(this.a)},
av:function(a,b){return J.ab(this.a,b)},
m:function(a,b){return T.a(J.G(this.a,b.gG()))},
t:function(a,b){return T.a(J.C(this.a,b.gG()))},
q:function(a,b){return T.a(J.a4(this.a,b.gG()))},
B:function(a,b){return T.a(J.a0(this.a,b.gG()))},
ak:function(a){return T.a(J.c8(this.a))},
az:function(a,b){return T.a(J.eT(this.a,b.gG()))},
d2:function(a,b){return T.a(J.d7(this.a,b.gG()))},
C:function(a,b){var z
if(b==null)return!1
if(!(typeof b==="number"&&J.a1(this.a,b)))z=b instanceof T.f&&J.a1(this.a,b.a)
else z=!0
return z},
L:function(a,b){return J.b9(this.a,b.gG())},
b_:function(a,b){return J.eS(this.a,b.gG())},
V:function(a,b){return J.aB(this.a,b.gG())},
cL:function(a){return T.a(J.ap(this.a))},
cB:function(a){return T.a(J.c9(this.a))},
R:function(a){return T.a(J.bD(this.a))},
cF:function(a,b,c){return T.a(J.bC(this.a,b.gG(),c.gG()))}}}],["","",,O,{"^":"",dN:{"^":"d;au:a*,es:b<",
j:function(a){return"["+J.u(this.a)+"\\_"+J.u(this.b)+"]"},
gF:function(a){return J.M(this.a)*53+J.M(this.b)},
C:function(a,b){if(b==null)return!1
return b instanceof O.dN&&J.a1(b.a,this.a)&&J.a1(b.b,this.b)},
m:function(a,b){var z,y
z=this.a.m(0,J.f1(b))
y=this.b.m(0,b.ges())
return O.cA(T.a(z),T.a(y))},
da:function(){var z,y,x
z=this.a
y=this.b.a
if(typeof y!=="number")return H.p(y)
y=z.q(0,T.a(Math.cos(H.v(T.a(3.141592653589793*y/180).a))))
z=this.a
x=this.b.a
if(typeof x!=="number")return H.p(x)
x=z.q(0,T.a(Math.sin(H.v(T.a(3.141592653589793*x/180).a))))
return new O.i(T.a(y),T.a(x))},
dQ:function(a,b){var z,y,x
if(this.a.gcR()){this.a=this.a.ak(0)
this.b=this.b.m(0,T.a(180))}z=this.b.a
y=J.w(z)
if(!y.L(z,0)){if(typeof z!=="number")return H.p(z)
x=360<=z}else x=!0
if(x){z=y.t(z,0)
y=J.w(z)
z=J.G(y.t(z,J.a4(J.ap(y.B(z,360)),360)),0)}this.b=T.a(z)},
w:{
cA:function(a,b){var z=new O.dN(a,b)
z.dQ(a,b)
return z}}}}],["","",,N,{"^":"",bp:{"^":"d;a9:a*,bK:b?,cK:c<",
bm:["dJ",function(a){this.b=a}],
du:function(a,b){var z=this.c
if(null!=z)J.cc(z)
this.c=b
if(null!=b)J.d3(this.a.c).Y(0,a,this.c)},
fl:function(){var z=this.c
if(null!=z)J.cc(z)},
P:["a1",function(){}],
k:function(a,b){var z,y
b=null==b?"":J.u(b)
z=J.E(b)
y=this.c
if(z===!0){y.toString
new W.iN(y).a0(0,a)}else y.setAttribute(a,b)},
bN:function(a,b){return this.k("display",b?"":"none")},
sb2:function(a){return this.k("stroke",a)},
seM:function(a){return this.k("fill",a)},
saF:function(a,b){this.k("stroke",b)
this.k("fill",b)},
sO:function(a,b){return this.k("stroke-width",b)},
bO:function(a){this.k("stroke-dasharray",null)
if(null!=a)this.k("stroke",a)},
aV:function(a){this.k("stroke-dasharray","1,3")
if(null!=a)this.k("stroke",a)},
cJ:function(){return this.aV(null)},
aq:function(a){this.k("stroke-dasharray","3,2")
if(null!=a)this.k("stroke",a)}},I:{"^":"bp;d,e,f,r,a,b,c",
P:["dD",function(){this.a1()
this.k("transform",this.e.ac())}],
gl:function(a){return this.d.length===0},
gbq:function(){var z,y
z=this.f
if(!(null!=z)){z=new N.I([],new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
y=document.createElementNS("http://www.w3.org/2000/svg","g")
z.c=y
z.P()
z=this.Y(0,0,z)
this.f=z}return z},
gbu:function(){var z,y
z=this.r
if(!(null!=z)){z=new N.I([],new Q.V(new O.i(T.a(0),T.a(0))),null,null,null,null,null)
y=document.createElementNS("http://www.w3.org/2000/svg","g")
z.c=y
z.P()
z=this.Y(0,this.d.length,z)
this.r=z}return z},
bm:function(a){var z,y,x
this.dJ(a)
for(z=this.d,y=z.length,x=0;x<z.length;z.length===y||(0,H.bB)(z),++x)z[x].bm(a)},
Y:function(a,b,c){var z,y,x
z=J.r(c)
if(null!=z.ga9(c))z.ga9(c).fk(c)
z.sa9(c,this)
c.bm(this.b)
z=this.d
y=z.length
b=b<y?b:y
C.b.aE(z,"insert")
x=z.length
if(b>x)H.A(P.bo(b,null,null))
z.splice(b,0,c)
c.du(b,c.gcK())
return c},
u:function(a,b){return this.Y(0,this.d.length,b)},
fk:function(a){C.b.a0(this.d,a)
a.fl()
a.sbK(null)
J.f6(a,null)}},bk:{"^":"I;",
cC:function(){var z,y,x
for(z=this.x,y=z.length,x=0;x<z.length;z.length===y||(0,H.bB)(z),++x)z[x].bs()}},hO:{"^":"bk;y,z,Q,ch,cx,cy,db,dx,dy,x,d,e,f,r,a,b,c",
P:function(){this.dD()
this.k("stroke","black")
this.k("stroke-width",1)
this.k("fill","none")
this.k("stroke-linecap","round")},
bE:function(a,b){var z,y,x,w,v,u
if(b){z=T.a(0)
y=T.a(0)
x=window
x="scrollX" in x?C.d.R(x.scrollX):C.d.R(x.document.documentElement.scrollLeft)
z=z.a
if(typeof z!=="number")return H.p(z)
this.ch=x-z
z=window
z="scrollY" in z?C.d.R(z.scrollY):C.d.R(z.document.documentElement.scrollTop)
y=y.a
if(typeof y!=="number")return H.p(y)
this.cx=z-y}if(!!J.n(a).$isbm)w=new P.aX(a.clientX,a.clientY,[null])
else{v=H.bA(a,"$isbt").targetTouches
if(v.length===0)return this.Q
z=(v&&C.A).gar(v)
w=new P.aX(C.d.R(z.clientX),C.d.R(z.clientY),[null])}z=w.a
y=this.ch
if(typeof z!=="number")return z.m()
x=w.b
u=this.cx
if(typeof x!=="number")return x.m()
u=new O.i(T.a(z+y),T.a(x+u))
this.Q=u
return u},
fe:function(a,b,c,d){var z,y,x,w,v,u
b.$1(a)
this.cy=c
z=document
y=[W.bm]
x=new W.bv(z,"mousemove",!1,y)
w=[W.bt]
v=new W.bv(z,"touchmove",!1,w)
if(P.aZ("iPad|iPhone|iPod",!0,!1).b.test(H.b7(window.navigator.userAgent)))u=1
else u=null==window.navigator.maxTouchPoints?0:window.navigator.maxTouchPoints
if(typeof u!=="number")return u.V()
if(u>0)x=v
this.dx=W.bw(x.a,x.b,new N.hP(this),!1,H.B(x,0))
this.db=d
y=new W.bv(z,"mouseup",!1,y)
w=new W.bv(z,"touchend",!1,w)
if(P.aZ("iPad|iPhone|iPod",!0,!1).b.test(H.b7(window.navigator.userAgent)))z=1
else z=null==window.navigator.maxTouchPoints?0:window.navigator.maxTouchPoints
if(typeof z!=="number")return z.V()
z=z>0?w:y
this.dy=W.bw(z.a,z.b,new N.hQ(this),!1,H.B(z,0))}},hP:{"^":"c:0;a",
$1:function(a){var z,y
J.cb(a)
z=this.a
y=z.bE(a,!1)
z=z.cy
if(null!=z)z.$1(y)}},hQ:{"^":"c:0;a",
$1:function(a){var z
J.cb(a)
z=this.a
z.bE(a,!1)
z.dx.aD()
z.dy.aD()
z.db=null
z.cy=null}}}],["","",,A,{"^":"",
c3:function(a,b,c,d,e){var z,y,x,w,v,u
z=new A.aS(c,null,null,b,null,null,null,!1,null,null,null)
y=document.createElementNS("http://www.w3.org/2000/svg","text")
z.c=y
z.X()
x=z.z
if(null==x)x=""
w=C.a.gl(x)
v=z.c
if(w){v.getAttribute("font-family")
v.removeAttribute("font-family")}else v.setAttribute("font-family",x)
w=z.Q
x=null==w?"":w.j(0)
w=C.a.gl(x)
v=z.c
if(w){v.getAttribute("font-size")
v.removeAttribute("font-size")}else v.setAttribute("font-size",x)
z.c.textContent=c
w=C.a.gl(d)
v=z.c
if(w){v.getAttribute("fill")
v.removeAttribute("fill")}else v.setAttribute("fill",d)
w=C.a.gl(e)
v=z.c
if(w){v.getAttribute("stroke")
v.removeAttribute("stroke")}else v.setAttribute("stroke",e)
w=J.ao(a)
u=w.u(a,z)
if(!!w.$isbk)a.x.push(u)
return u},
aJ:{"^":"bp;",
gay:function(){return new O.i(T.a(0),T.a(0))},
dz:function(a,b,c){var z,y,x
z=J.eZ(this.c)
y=J.f_(this.c)
if(P.aZ("iPad|iPhone|iPod",!0,!1).b.test(H.b7(window.navigator.userAgent)))x=1
else x=null==window.navigator.maxTouchPoints?0:window.navigator.maxTouchPoints
if(typeof x!=="number")return x.V()
if(x>0)z=y
return W.bw(z.a,z.b,new A.i0(this,a,b,c),!1,H.B(z,0))},
dw:function(a,b){return this.dz(a,b,null)},
fc:function(a,b){var z={}
this.k("cursor","pointer")
this.e=b
this.f=a
z.a=null
this.d=this.dw(new A.hZ(z,this),new A.i_(z,this))},
fb:function(a){return this.fc(a,null)},
cX:function(a,b,c){var z,y
if(!this.r){this.r=!0
z=this.f
if(null!=z){y=z.$3(b,this,c)
if(null!=y)b=y}this.sai(b)
this.r=!1}},
cW:function(a,b){return this.cX(a,b,!1)},
sf6:function(a){return this.k("marker-start",a)},
sf7:function(a){return this.k("marker-end",a)}},
i0:{"^":"c:0;a,b,c,d",
$1:function(a){var z
J.cb(a)
z=this.a.b
z.fe(z.bE(a,!0),this.b,this.c,this.d)}},
hZ:{"^":"c:15;a,b",
$1:function(a){this.a.a=J.C(this.b.gai(),a)}},
i_:{"^":"c:15;a,b",
$1:function(a){var z,y,x
z=this.a.a
y=J.r(z)
x=a.a.m(0,y.gn(z))
z=a.b.m(0,y.gp(z))
this.b.cX(0,new O.i(T.a(x),T.a(z)),!0)}},
dR:{"^":"aJ;",
P:["X",function(){this.a1()
this.aw()}],
gai:function(){return this.x},
sai:function(a){this.x=a
this.aw()}},
hU:{"^":"dR;",
gau:function(a){return this.y},
sau:function(a,b){this.y=b
this.k("r",b)}},
hT:{"^":"aJ;",
gai:function(){return this.x},
sai:function(a){this.y=J.G(this.y,J.C(a,this.x))
this.x=a
this.aY()
this.aZ()},
gay:function(){return J.C(this.y,this.x)},
bL:function(a,b){this.x=a
this.y=b
this.aY()
this.aZ()}},
hV:{"^":"aJ;",
P:["dK",function(){this.a1()
this.k("d",this.a4())}],
gai:function(){return J.E(this.x)?new O.i(T.a(0),T.a(0)):J.d5(this.x)},
sai:function(a){var z
if(J.E(this.x))return
z=J.C(a,J.d5(this.x))
this.x=J.aC(this.x,new A.hW(z))
this.k("d",this.a4())},
sdk:function(a){this.y=a
this.k("d",this.a4())},
gaX:function(){return this.z},
saX:function(a){this.z=a
this.k("d",this.a4())},
bM:function(a,b,c){this.x=a
this.y=b
this.z=c
this.k("d",this.a4())},
gdd:function(){var z=this.x
if(null!=this.y)z=J.aC(z,new A.hX(this))
return J.ce(null!=this.z?J.aC(z,new A.hY(this)):z)}},
hW:{"^":"c:0;a",
$1:[function(a){return J.G(a,this.a)},null,null,2,0,null,0,"call"]},
hX:{"^":"c:0;a",
$1:[function(a){return a.fd(this.a.y)},null,null,2,0,null,0,"call"]},
hY:{"^":"c:0;a",
$1:[function(a){return J.G(a,this.a.z)},null,null,2,0,null,0,"call"]},
dz:{"^":"bp;",
bR:function(a){var z=document.createElementNS("http://www.w3.org/2000/svg","marker")
this.c=z
z.id=a}},
f8:{"^":"dz;a,b,c"},
f9:{"^":"dz;a,b,c"},
au:{"^":"hT;x,y,d,e,f,r,a,b,c",
aY:function(){this.k("x1",J.S(this.x))
this.k("y1",J.T(this.x))},
aZ:function(){this.k("x2",J.S(this.y))
this.k("y2",J.T(this.y))},
cH:function(a){var z,y,x,w,v
z=J.C(this.y,this.x)
y=this.x
x=J.r(y)
w=a.a.t(0,x.gn(y))
y=a.b.t(0,x.gp(y))
v=T.a(J.bC(z.eL(new O.i(T.a(w),T.a(y))).B(0,z.f4()).a,T.a(0).a,T.a(1).a))
return J.G(this.x,J.a4(z,v))}},
as:{"^":"hU;y,x,d,e,f,r,a,b,c",
gay:function(){var z=this.y.q(0,T.a(2))
return new O.i(T.a(z),T.a(z))},
aw:function(){this.k("cx",J.S(this.x))
this.k("cy",J.T(this.x))},
cH:function(a){var z,y,x,w,v
z=this.x
y=J.r(z)
x=a.a.t(0,y.gn(z))
w=a.b.t(0,y.gp(z))
w=new O.i(T.a(x),T.a(w)).de()
x=this.y
v=w.a.q(0,x)
x=w.b.q(0,x)
return y.m(z,new O.i(T.a(v),T.a(x)))},
ez:function(a){var z,y,x
z=J.S(this.x)
y=this.y
x=a.a
if(typeof x!=="number")return H.p(x)
x=3.141592653589793*x/180
y=J.G(z,y.q(0,T.a(Math.cos(H.v(T.a(x).a)))))
x=J.C(J.T(this.x),this.y.q(0,T.a(Math.sin(H.v(T.a(x).a)))))
return new O.i(T.a(y),T.a(x))},
ey:function(a){var z,y,x,w,v,u
z=this.x
y=J.r(z)
x=a.a.t(0,y.gn(z))
w=a.b.t(0,y.gp(z))
w=new O.i(T.a(x),T.a(w)).de()
x=this.y
v=w.a.q(0,x)
x=w.b.q(0,x)
a=J.a0(J.C(y.m(z,new O.i(T.a(v),T.a(x))),this.x),this.y)
x=J.r(a)
u=T.a(J.c8(T.a(J.a4(J.a0(T.a(Math.asin(H.v(x.gp(a).a))).a,3.141592653589793),180)).a))
if(J.b9(x.gn(a).a,0))u=T.a(180).t(0,u)
return J.b9(u.a,0)?u.m(0,T.a(360)):u}},
aS:{"^":"dR;y,z,Q,x,d,e,f,r,a,b,c",
bs:function(){var z,y,x,w
z=H.bA(this.c,"$iscD").getBBox()
y=this.x
x=z.width
if(typeof x!=="number")return x.B()
w=z.height
if(typeof w!=="number")return w.ak()
this.x=J.C(y,new O.i(T.a(x/2),T.a(-w/4)))
this.aw()},
cS:function(){var z,y,x,w
z=H.bA(this.c,"$iscD").getBBox()
y=this.x
x=z.width
w=z.height
if(typeof w!=="number")return w.ak()
this.x=J.C(y,new O.i(T.a(x),T.a(-w)))
this.aw()},
sbv:function(a,b){this.z=b
this.k("font-family",b)},
saO:function(a,b){this.Q=b
this.k("font-size",b)},
aw:function(){this.k("x",J.S(this.x))
this.k("y",J.T(this.x))}},
aW:{"^":"hV;x,y,z,d,e,f,r,a,b,c",
cl:function(a){var z=J.r(a)
return J.ab(z.gn(a),1)+","+J.ab(z.gp(a),1)+" "},
a4:function(){var z,y,x,w,v
if(J.W(this.x)>0){z=this.gdd()
y="M"+this.cl(C.b.gar(z))
for(x=H.id(z,1,null,H.B(z,0)),x=new H.cs(x,x.gi(x),0,null);x.v();){w=x.d
v=J.r(w)
y+="L"+(J.ab(v.gn(w),1)+","+J.ab(v.gp(w),1)+" ")}}else y=""
return y},
aP:function(a){var z=document.createElementNS("http://www.w3.org/2000/svg","path")
this.c=z
this.dK()
this.k("d",this.a4())},
w:{
dI:function(a){var z=new A.aW(null==a?[]:a,null,null,null,null,null,!1,null,null,null)
z.aP(a)
return z}}},
cB:{"^":"aW;Q,x,y,z,d,e,f,r,a,b,c",
e_:function(){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l,k,j
z=this.Q===!0?1:0
y=J.W(this.x)
if(y<3+2*z)return""
x=this.gdd()
w=x.length
if(0>=w)return H.m(x,0)
v=x[0]
if(z>=w)return H.m(x,z)
u=x[z]
t=1+z
if(t>=w)return H.m(x,t)
s=x[t]
t=2+z
if(t>=w)return H.m(x,t)
r=x[t]
q="M"+this.cl(u)
for(w=y-z,p=t;!0;v=u,u=s,s=r,r=j){t=J.w(s)
o=t.t(s,v)
n=J.a0(o,new T.f(6))
o=J.C(r,u)
m=J.a0(o,new T.f(6))
o=J.G(u,n)
l=J.r(o)
o="C"+(J.ab(l.gn(o),1)+","+J.ab(l.gp(o),1)+" ")
l=t.t(s,m)
k=J.r(l)
q+=o+(J.ab(k.gn(l),1)+","+J.ab(k.gp(l),1)+" ")+(J.ab(t.gn(s),1)+","+J.ab(t.gp(s),1)+" ");++p
if(p>w)break
t=p<y?p:p-1
if(t>=x.length)return H.m(x,t)
j=x[t]}return q},
a4:function(){return this.e_()}}}],["","",,Q,{"^":"",V:{"^":"d;aX:a@",
j:function(a){return"[("+H.j(this.a)+")]"},
ac:function(){return this.a.gf0()?"":"translate("+J.S(this.a).j(0)+" "+J.u(J.T(this.a))+") "},
m:function(a,b){return new Q.V(J.G(this.a,b.gaX()))}}}],["","",,M,{"^":"",bb:{"^":"f;a",
m:function(a,b){return new M.bb(T.D(J.G(this.a,b.gG())))},
t:function(a,b){return new M.bb(T.D(J.C(this.a,b.gG())))},
q:function(a,b){return new M.bb(T.D(J.a4(this.a,b.gG())))},
B:function(a,b){return new M.bb(T.D(J.a0(this.a,b.gG())))},
j:function(a){var z,y
z=this.a
y=J.w(z)
if(y.L(z,1))return y.av(z,4)
if(y.L(z,10))return y.av(z,3)
if(y.L(z,100))return y.av(z,2)
if(y.L(z,1000))return y.av(z,1)
return T.a(y.B(z,1000)).j(0)+"k"}},ae:{"^":"f;a",
m:function(a,b){return new M.ae(T.D(J.G(this.a,b.gG())))},
t:function(a,b){return new M.ae(T.D(J.C(this.a,b.gG())))}}}],["","",,M,{"^":"",iu:{"^":"I;"}}],["","",,O,{"^":"",i:{"^":"d;n:a>,p:b>",
j:function(a){return"["+this.a.j(0)+":"+J.u(this.b)+"]"},
gF:function(a){return J.M(this.a.a)*53+J.M(this.b)},
C:function(a,b){if(b==null)return!1
return b instanceof O.i&&b.a.C(0,this.a)&&J.a1(b.b,this.b)},
gf0:function(){return 0===this.a.a&&0===this.b.a},
m:function(a,b){var z,y
z=J.r(b)
y=this.a.m(0,z.gn(b))
z=this.b.m(0,z.gp(b))
return new O.i(T.a(y),T.a(z))},
t:function(a,b){var z,y
z=J.r(b)
y=this.a.t(0,z.gn(b))
z=this.b.t(0,z.gp(b))
return new O.i(T.a(y),T.a(z))},
q:function(a,b){var z,y
z=this.a.q(0,b)
y=this.b.q(0,b)
return new O.i(T.a(z),T.a(y))},
B:function(a,b){var z,y
z=this.a.B(0,b)
y=this.b.B(0,b)
return new O.i(T.a(z),T.a(y))},
fd:function(a){var z,y
z=this.a.q(0,a.a)
y=this.b.q(0,a.b)
return new O.i(T.a(z),T.a(y))},
f4:function(){var z,y
z=this.a
z=z.q(0,z)
y=this.b
return z.m(0,y.q(0,y))},
eL:function(a){return this.a.q(0,a.a).m(0,this.b.q(0,a.b))},
de:function(){var z,y,x,w
z=this.a
y=z.q(0,z)
x=this.b
w=T.a(Math.sqrt(H.v(y.m(0,x.q(0,x)).a)))
if(J.aB(w.a,0)){z=z.B(0,w)
y=this.b.B(0,w)
y=new O.i(T.a(z),T.a(y))
z=y}else{z=T.a(1)
y=T.a(0)
y=new O.i(T.a(z),T.a(y))
z=y}return z},
w:{
mC:[function(a){var z,y
z=J.t(a)
y=T.a(z.h(a,0))
z=T.a(z.h(a,1))
return new O.i(T.a(y),T.a(z))},"$1","eR",2,0,30,52]}}}]]
setupProgram(dart,0)
J.n=function(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.dw.prototype
return J.h8.prototype}if(typeof a=="string")return J.bh.prototype
if(a==null)return J.ha.prototype
if(typeof a=="boolean")return J.h7.prototype
if(a.constructor==Array)return J.bf.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
return a}if(a instanceof P.d)return a
return J.c0(a)}
J.t=function(a){if(typeof a=="string")return J.bh.prototype
if(a==null)return a
if(a.constructor==Array)return J.bf.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
return a}if(a instanceof P.d)return a
return J.c0(a)}
J.ao=function(a){if(a==null)return a
if(a.constructor==Array)return J.bf.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
return a}if(a instanceof P.d)return a
return J.c0(a)}
J.w=function(a){if(typeof a=="number")return J.bg.prototype
if(a==null)return a
if(!(a instanceof P.d))return J.bu.prototype
return a}
J.cU=function(a){if(typeof a=="number")return J.bg.prototype
if(typeof a=="string")return J.bh.prototype
if(a==null)return a
if(!(a instanceof P.d))return J.bu.prototype
return a}
J.kR=function(a){if(typeof a=="string")return J.bh.prototype
if(a==null)return a
if(!(a instanceof P.d))return J.bu.prototype
return a}
J.r=function(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
return a}if(a instanceof P.d)return a
return J.c0(a)}
J.G=function(a,b){if(typeof a=="number"&&typeof b=="number")return a+b
return J.cU(a).m(a,b)}
J.a0=function(a,b){if(typeof a=="number"&&typeof b=="number")return a/b
return J.w(a).B(a,b)}
J.a1=function(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.n(a).C(a,b)}
J.aB=function(a,b){if(typeof a=="number"&&typeof b=="number")return a>b
return J.w(a).V(a,b)}
J.eS=function(a,b){if(typeof a=="number"&&typeof b=="number")return a<=b
return J.w(a).b_(a,b)}
J.b9=function(a,b){if(typeof a=="number"&&typeof b=="number")return a<b
return J.w(a).L(a,b)}
J.a4=function(a,b){if(typeof a=="number"&&typeof b=="number")return a*b
return J.cU(a).q(a,b)}
J.c8=function(a){if(typeof a=="number")return-a
return J.w(a).ak(a)}
J.d1=function(a,b){return J.w(a).dA(a,b)}
J.C=function(a,b){if(typeof a=="number"&&typeof b=="number")return a-b
return J.w(a).t(a,b)}
J.eT=function(a,b){return J.w(a).az(a,b)}
J.eU=function(a,b){if(typeof a=="number"&&typeof b=="number")return(a^b)>>>0
return J.w(a).dN(a,b)}
J.d2=function(a,b){if(typeof b==="number")if(a.constructor==Array||typeof a=="string"||H.eJ(a,a[init.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.t(a).h(a,b)}
J.eV=function(a,b,c){if(typeof b==="number")if((a.constructor==Array||H.eJ(a,a[init.dispatchPropertyName]))&&!a.immutable$list&&b>>>0===b&&b<a.length)return a[b]=c
return J.ao(a).A(a,b,c)}
J.eW=function(a,b,c,d){return J.r(a).dY(a,b,c,d)}
J.eX=function(a,b,c,d){return J.r(a).ek(a,b,c,d)}
J.eY=function(a,b,c){return J.r(a).el(a,b,c)}
J.aa=function(a,b){return J.ao(a).u(a,b)}
J.c9=function(a){return J.w(a).cB(a)}
J.bC=function(a,b,c){return J.w(a).cF(a,b,c)}
J.ca=function(a,b,c){return J.t(a).eC(a,b,c)}
J.aP=function(a,b){return J.ao(a).I(a,b)}
J.ap=function(a){return J.w(a).cL(a)}
J.d3=function(a){return J.r(a).gcE(a)}
J.d4=function(a){return J.r(a).gcG(a)}
J.ba=function(a){return J.r(a).gag(a)}
J.d5=function(a){return J.ao(a).gar(a)}
J.M=function(a){return J.n(a).gF(a)}
J.E=function(a){return J.t(a).gl(a)}
J.aq=function(a){return J.ao(a).gH(a)}
J.W=function(a){return J.t(a).gi(a)}
J.eZ=function(a){return J.r(a).gcZ(a)}
J.f_=function(a){return J.r(a).gd_(a)}
J.f0=function(a){return J.r(a).gfg(a)}
J.f1=function(a){return J.r(a).gau(a)}
J.d6=function(a){return J.r(a).gK(a)}
J.S=function(a){return J.r(a).gn(a)}
J.T=function(a){return J.r(a).gp(a)}
J.aC=function(a,b){return J.ao(a).a3(a,b)}
J.f2=function(a,b){return J.r(a).cW(a,b)}
J.f3=function(a,b){return J.n(a).bB(a,b)}
J.cb=function(a){return J.r(a).fi(a)}
J.d7=function(a,b){return J.w(a).d2(a,b)}
J.cc=function(a){return J.ao(a).fm(a)}
J.f4=function(a,b){return J.r(a).fq(a,b)}
J.bD=function(a){return J.w(a).R(a)}
J.f5=function(a,b){return J.r(a).saF(a,b)}
J.f6=function(a,b){return J.r(a).sa9(a,b)}
J.d8=function(a,b){return J.r(a).sau(a,b)}
J.d9=function(a,b){return J.r(a).sO(a,b)}
J.da=function(a,b){return J.r(a).bN(a,b)}
J.f7=function(a){return J.w(a).J(a)}
J.cd=function(a){return J.w(a).aM(a)}
J.ce=function(a){return J.ao(a).S(a)}
J.u=function(a){return J.n(a).j(a)}
J.ab=function(a,b){return J.w(a).av(a,b)}
J.db=function(a){return J.kR(a).fv(a)}
I.c4=function(a){a.immutable$list=Array
a.fixed$length=Array
return a}
var $=I.p
C.p=J.l.prototype
C.b=J.bf.prototype
C.e=J.dw.prototype
C.d=J.bg.prototype
C.a=J.bh.prototype
C.x=J.bi.prototype
C.m=J.hz.prototype
C.A=W.ip.prototype
C.f=J.bu.prototype
C.n=new P.hy()
C.o=new P.iL()
C.c=new P.jp()
C.h=new P.aF(0)
C.q=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
C.r=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
C.i=function(hooks) { return hooks; }

C.t=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var ua = navigator.userAgent;
    if (ua.indexOf("DumpRenderTree") >= 0) return hooks;
    if (ua.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
C.u=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (self.HTMLElement && object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof navigator == "object";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
C.v=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
C.w=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
C.j=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
C.k=I.c4([])
C.y=H.R(I.c4([]),[P.bs])
C.l=new H.fm(0,{},C.y,[P.bs,null])
C.z=new H.cC("call")
$.dK="$cachedFunction"
$.dL="$cachedInvocation"
$.ah=0
$.aQ=null
$.dd=null
$.cW=null
$.ez=null
$.eN=null
$.c_=null
$.c2=null
$.cX=null
$.aL=null
$.b3=null
$.b4=null
$.cQ=!1
$.z=C.c
$.dq=0
$.dm=null
$.dl=null
$.dk=null
$.dj=null
$.l5="Arial"
$.jM="yellow"
$.dZ=440
$=null
init.isHunkLoaded=function(a){return!!$dart_deferred_initializers$[a]}
init.deferredInitialized=new Object(null)
init.isHunkInitialized=function(a){return init.deferredInitialized[a]}
init.initializeLoadedHunk=function(a){$dart_deferred_initializers$[a]($globals$,$)
init.deferredInitialized[a]=true}
init.deferredLibraryUris={}
init.deferredLibraryHashes={};(function(a){for(var z=0;z<a.length;){var y=a[z++]
var x=a[z++]
var w=a[z++]
I.$lazy(y,x,w)}})(["bH","$get$bH",function(){return H.cV("_$dart_dartClosure")},"co","$get$co",function(){return H.cV("_$dart_js")},"du","$get$du",function(){return H.h3()},"dv","$get$dv",function(){if(typeof WeakMap=="function")var z=new WeakMap()
else{z=$.dq
$.dq=z+1
z="expando$key$"+z}return new P.fC(null,z)},"e_","$get$e_",function(){return H.ak(H.bS({
toString:function(){return"$receiver$"}}))},"e0","$get$e0",function(){return H.ak(H.bS({$method$:null,
toString:function(){return"$receiver$"}}))},"e1","$get$e1",function(){return H.ak(H.bS(null))},"e2","$get$e2",function(){return H.ak(function(){var $argumentsExpr$='$arguments$'
try{null.$method$($argumentsExpr$)}catch(z){return z.message}}())},"e6","$get$e6",function(){return H.ak(H.bS(void 0))},"e7","$get$e7",function(){return H.ak(function(){var $argumentsExpr$='$arguments$'
try{(void 0).$method$($argumentsExpr$)}catch(z){return z.message}}())},"e4","$get$e4",function(){return H.ak(H.e5(null))},"e3","$get$e3",function(){return H.ak(function(){try{null.$method$}catch(z){return z.message}}())},"e9","$get$e9",function(){return H.ak(H.e5(void 0))},"e8","$get$e8",function(){return H.ak(function(){try{(void 0).$method$}catch(z){return z.message}}())},"cG","$get$cG",function(){return P.iy()},"be","$get$be",function(){var z,y
z=P.aV
y=new P.az(0,P.ix(),null,[z])
y.dW(null,z)
return y},"b6","$get$b6",function(){return[]},"di","$get$di",function(){return{}},"dh","$get$dh",function(){return P.aZ("^\\S+$",!0,!1)},"eG","$get$eG",function(){return P.cS(self)},"cH","$get$cH",function(){return H.cV("_$dart_dartObject")},"cN","$get$cN",function(){return function DartObject(a){this.o=a}},"cY","$get$cY",function(){return T.a(12)},"et","$get$et",function(){return T.a(L.fc()?9:6)}])
I=I.$finishIsolateConstructor(I)
$=new I()
init.metadata=["p",null,"g","color","node","x","s","llg",!1,"_","r","shape","pch","error","stackTrace","path","circle","o","qm","p2","ps","tr","sc","sz","value","p1","maxRad","y","e","label","width","data","sp","minRad","n","arg3","onMove","object","id","arguments","line","self","captureThis","stripEnds","callback","fill","arg","each","arg4","bool","center","arg2","a","l","r1","withLabels","pg","deg","minX","maxX","minY","maxY","labelsX","Shape","arg1","numberOfArguments","hwRatio","isolate","minTurn","maxTurn","aOff","minPch","ctrPch","maxPch","closure","sender","colorMark","colorRad","cps","labelsY"]
init.types=[{func:1,args:[,]},{func:1},{func:1,v:true},{func:1,args:[N.bp,,]},{func:1,v:true,args:[{func:1,v:true}]},{func:1,args:[X.cz]},{func:1,args:[A.aJ,,]},{func:1,args:[A.as,,]},{func:1,args:[N.I,,,,],opt:[,]},{func:1,args:[A.aS]},{func:1,ret:P.O,args:[P.q]},{func:1,v:true,args:[P.d],opt:[P.bq]},{func:1,args:[A.aW,,]},{func:1,args:[Q.bl,,,]},{func:1,args:[Q.bl,,]},{func:1,args:[O.i]},{func:1,args:[,,]},{func:1,args:[P.bs,,]},{func:1,args:[P.O,,]},{func:1,args:[,P.O]},{func:1,args:[P.O]},{func:1,args:[A.aJ],opt:[,]},{func:1,args:[O.i,,,]},{func:1,args:[{func:1,v:true}]},{func:1,args:[N.I,,,],opt:[,,]},{func:1,args:[P.O,P.aN]},{func:1,args:[N.I,,,,]},{func:1,args:[,],opt:[,]},{func:1,args:[A.aW,,],opt:[,,]},{func:1,args:[N.I,,,],opt:[,]},{func:1,ret:O.i,args:[,]},{func:1,args:[Q.cw,,,]},{func:1,args:[N.I,,,,,,,],opt:[,,]},{func:1,args:[N.I,,,,,,],opt:[,]},{func:1,args:[N.I,,,,,,,]},{func:1,args:[E.bn,,],opt:[,,]},{func:1,args:[E.bn,,]},{func:1,args:[N.I,,],opt:[,]},{func:1,v:true,args:[,P.bq]},{func:1,v:true,args:[P.d]},{func:1,ret:P.d,args:[,]},{func:1,args:[A.au,,,]}]
function convertToFastObject(a){function MyClass(){}MyClass.prototype=a
new MyClass()
return a}function convertToSlowObject(a){a.__MAGIC_SLOW_PROPERTY=1
delete a.__MAGIC_SLOW_PROPERTY
return a}A=convertToFastObject(A)
B=convertToFastObject(B)
C=convertToFastObject(C)
D=convertToFastObject(D)
E=convertToFastObject(E)
F=convertToFastObject(F)
G=convertToFastObject(G)
H=convertToFastObject(H)
J=convertToFastObject(J)
K=convertToFastObject(K)
L=convertToFastObject(L)
M=convertToFastObject(M)
N=convertToFastObject(N)
O=convertToFastObject(O)
P=convertToFastObject(P)
Q=convertToFastObject(Q)
R=convertToFastObject(R)
S=convertToFastObject(S)
T=convertToFastObject(T)
U=convertToFastObject(U)
V=convertToFastObject(V)
W=convertToFastObject(W)
X=convertToFastObject(X)
Y=convertToFastObject(Y)
Z=convertToFastObject(Z)
function init(){I.p=Object.create(null)
init.allClasses=map()
init.getTypeFromName=function(a){return init.allClasses[a]}
init.interceptorsByTag=map()
init.leafTags=map()
init.finishedClasses=map()
I.$lazy=function(a,b,c,d,e){if(!init.lazies)init.lazies=Object.create(null)
init.lazies[a]=b
e=e||I.p
var z={}
var y={}
e[a]=z
e[b]=function(){var x=this[a]
if(x==y)H.lh(d||a)
try{if(x===z){this[a]=y
try{x=this[a]=c()}finally{if(x===z)this[a]=null}}return x}finally{this[b]=function(){return this[a]}}}}
I.$finishIsolateConstructor=function(a){var z=a.p
function Isolate(){var y=Object.keys(z)
for(var x=0;x<y.length;x++){var w=y[x]
this[w]=z[w]}var v=init.lazies
var u=v?Object.keys(v):[]
for(var x=0;x<u.length;x++)this[v[u[x]]]=null
function ForceEfficientMap(){}ForceEfficientMap.prototype=this
new ForceEfficientMap()
for(var x=0;x<u.length;x++){var t=v[u[x]]
this[t]=z[t]}}Isolate.prototype=a.prototype
Isolate.prototype.constructor=Isolate
Isolate.p=z
Isolate.c4=a.c4
Isolate.Q=a.Q
return Isolate}}!function(){var z=function(a){var t={}
t[a]=1
return Object.keys(convertToFastObject(t))[0]}
init.getIsolateTag=function(a){return z("___dart_"+a+init.isolateTag)}
var y="___dart_isolate_tags_"
var x=Object[y]||(Object[y]=Object.create(null))
var w="_ZxYxX"
for(var v=0;;v++){var u=z(w+"_"+v+"_")
if(!(u in x)){x[u]=1
init.isolateTag=u
break}}init.dispatchPropertyName=init.getIsolateTag("dispatch_record")}();(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!='undefined'){a(document.currentScript)
return}var z=document.scripts
function onLoad(b){for(var x=0;x<z.length;++x)z[x].removeEventListener("load",onLoad,false)
a(b.target)}for(var y=0;y<z.length;++y)z[y].addEventListener("load",onLoad,false)})(function(a){init.currentScript=a
if(typeof dartMainRunner==="function")dartMainRunner(function(b){H.eP(F.eL(),b)},[])
else (function(b){H.eP(F.eL(),b)})([])})})()/* eslint-disable */

let QuintMachine;

(function () {

let mc;

class QM_Proxy {
  constructor(dObj) {
    this.dObj = dObj;
  }

  static $(self) { // copies prototype methods
    if (self)
      self = new this(self);
    return self;
  }
}

class QM_GroupNode extends QM_Proxy {
  label (p, s, center = false) {
    return QM_Label.$(mc.label.$(this.dObj, p, s, center));
  }

  line (p1, p2, color, width) {
    return QM_Line.$(mc.line.$(this.dObj, p1, p2, color, width));
  }

  spline (stripEnds, color, fill) {
    return QM_Spline.$(mc.spline.$(this.dObj, stripEnds, [], color, fill));
  }

  circle (p, r, color) {
    return QM_Circle.$(mc.circle.$(this.dObj, p, r, color));
  }

  handle (p, color) {
    return QM_Circle.$(mc.handle.$(this.dObj, p, color));
  }

  grid (p, sz, n, l) {
    return QM_GridNode.$(mc.grid.$(this.dObj, p, sz, n, l));
  }

  polarGrid (p, r, r1, withLabels) {
    return QM_PolarGridNode.$(mc.polarGrid.$(this.dObj, p, r, r1, withLabels));
  }

  loglinGrid (p, sz, minX, maxX, minY, maxY, labelsX, labelsY) {
    return QM_LoglinGridNode.$(mc.loglinGrid.$(this.dObj, p, sz, minX, maxX, minY, maxY, labelsX, labelsY));
  }

  spiral (p, minRad, maxRad, minTurn, maxTurn, aOff) {
    return QM_Spiral.$(mc.spiral.$(this.dObj, p, minRad, maxRad, minTurn, maxTurn, aOff));
  }

  pitchSpiral (p, minRad, maxRad, minPch, ctrPch, maxPch) {
    return QM_PitchSpiral.$(mc.pitchSpiral.$(this.dObj, p, minRad, maxRad, minPch, ctrPch, maxPch));
  }
}

class QM_LabelledGroupNode extends QM_GroupNode {
}

class QM_GridNode extends QM_LabelledGroupNode {
}

class QM_PolarGridNode extends QM_GridNode {
  toXY (r, deg) {
    return mc.polarGrid.toXY(this.dObj, r, deg);
  }
}

class QM_LoglinGridNode extends QM_GridNode {
  toXY (x, y) {
    return mc.loglinGrid.toXY(this.dObj, x, y);
  }

  fromXY (x, y) {
    return mc.loglinGrid.fromXY(this.dObj, x, y);
  }

  xLegend (s) {
    return mc.loglinGrid.xLegend(this.dObj, s);
  }

  yLegend (s) {
    return mc.loglinGrid.yLegend(this.dObj, s);
  }
}

class QM_SceneNode extends QM_Proxy {
  stroke (color) {
    mc.node.stroke(this.dObj, color);
    return this;
  }

  fill (color) {
    mc.node.fill(this.dObj, color);
    return this;
  }

  color (color) {
    mc.node.color(this.dObj, color);
    return this;
  }

  width (width) {
    mc.node.width(this.dObj, width);
    return this;
  }

  solidStroke (color) {
    mc.node.solidStroke(this.dObj, color);
    return this;
  }

  dottedStroke (color) {
    mc.node.dottedStroke(this.dObj, color);
    return this;
  }

  dashedStroke (color) {
    mc.node.dashedStroke(this.dObj, color);
    return this;
  }
}

class QM_Shape extends QM_SceneNode {
  movable (onMove) {
    mc.shape.movable(this.dObj, onMove);
    return this;
  }

  moveTo (p) {
    mc.shape.moveTo(this.dObj, p);
    return this;
  }

  arrowBeg () {
    mc.shape.markerBeg(this.dObj, 'url(#arrowBeg)');
    return this;
  }

  arrowEnd () {
    mc.shape.markerEnd(this.dObj, 'url(#arrowEnd)');
    return this;
  }
}

class QM_Label extends QM_Shape {
  center () {
    mc.label.center(this.dObj);
    return this;
  }

  leftCenter () {
    mc.label.leftCenter(this.dObj);
    return this;
  }
}

class QM_Line extends QM_Shape {
  set (p1, p2) {
    mc.line.set(this.dObj, p1, p2);
    return this;
  }
}

class QM_Circle extends QM_Shape {
  closeTo (p) {
    return mc.circle.closeTo(this.dObj, p);
  }

  atr (r) {
    return mc.circle.atr(this.dObj, r);
  }

  atp (p) {
    return mc.circle.atp(this.dObj, p);
  }
}

class QM_Path extends QM_SceneNode {
  set (ps, sc, tr) {
    mc.spline.set(this.dObj, ps, sc, tr);
    return this;
  }

  sc (sc) {
    mc.spline.sc(this.dObj, sc);
    return this;
  }

  tr (tr) {
    mc.spline.tr(this.dObj, tr);
    return this;
  }
}

class QM_Spline extends QM_Path {
}

class QM_Widget extends QM_GroupNode {
}

class QM_DiscWgt extends QM_Widget {
}

class QM_Spiral extends QM_DiscWgt {
}

class QM_PitchSpiral extends QM_Spiral {
  markPitch (pch, colorMark, colorRad) {
    mc.pitchSpiral.markPitch(this.dObj, pch, colorMark, colorRad);
    return this;
  }

  toXY (pch) {
    return mc.pitchSpiral.toXY(this.dObj, pch);
  }
}

class QM extends QM_Proxy {
  fbo () {
    const [fg, bg, over] = mc.qm.fbo(this.dObj);
    return [QM_GroupNode.$(fg), QM_GroupNode.$(bg), QM_Elem.$(over)];
  }

  // sizes
  sz (margin = 14) {
    const m = this.margin = margin;
    const [sx, sy] = mc.qm.sz(this.dObj);
    // adjusted for margin
    const x1 = m, x2 = sx - m, y1 = m, y2 = sy - m;
    // [sx, sy, cx, cy, x1, x2, y1, y2]
    return [x2-x1, y2-y1, sx/2, sy/2, x1, x2, y1, y2];
  }

  m () {
    return this.margin;
  }
}

class QM_Elem extends QM_Proxy {
  controls () {
    return this.qmControls || (this.qmControls = this.addChild('div', 'controls'));
  }

  addChild (type, cls) {
    let child = QM_Elem.$(this.dObj.appendChild(document.createElement(type)));
    if (cls)
      child.dObj.classList.add(cls);
    return child;
  }

  addLabel (tx) {
    let child = this.addChild('label');
    child.dObj.innerText = tx;
    return child;
  }

  addInput (type) {
    let child = this.addChild('input', type);
    child.dObj.type = type;
    return child;
  }

  addButton (tx, toggle = false, on) {
    const btn = this.addChild('button'), d = btn.dObj;
    d.innerText = tx;
    if (toggle)
      d.classList.add('toggle');
    d.onclick = on;
    btn.toggle = () => d.classList.toggle('down');
    return btn;
  }

  addRange (min, max, step, on) {
    const rge = this.addInput('range'), d = rge.dObj;
    d.min = min; d.max = max; d.step = step;
    d.onchange = d.onmousemove = on;

    rge.value = () => rge.dObj.value;
    rge.setValue = (value) => rge.dObj.value = value;

    return rge;
  }

  addRadio (name, label, on) {
    let rio = this.addInput('radio');
    if (name)
      rio.dObj.name = name;
    if (label)
      this.addLabel(label);
    if (on)
      rio.dObj.onclick = on;
    rio.check = () => rio.dObj.checked = true;
    return rio;
  }

  addCheck (name, label, on) {
    let chk = this.addInput('checkbox');
    if (name)
      chk.dObj.name = name;
    if (label)
      this.addLabel(label);
    if (on)
      chk.dObj.onchange = on;
    chk.check = () => chk.dObj.checked = true;
    return chk;
  }

  br () {
    this.addChild('br');
    return this;
  }

  centerAt (p) {
    const [x, y] = p, d = this.dObj;
    let style = d.style;
    style.position = 'absolute';
    style.left = (x - d.clientWidth/2) + 'px';
    style.top  = (y - d.clientHeight/2) + 'px';
  }
}

QuintMachine = function (divId, whRatio = 2) {
  mc = QuintMachine_dart$;
  const qm = QM.$(mc.qm.$(divId, whRatio));
  mc.qm.arrowBegEnd(qm.dObj);  // TODO on demand, or better

  // TODO better
  qm.degSin = mc.degSin;
  qm.degCos = mc.degCos;
  qm.toPch  = mc.toPch;
  qm.toCps  = mc.toCps;

  return qm;
}

})();


// eof
