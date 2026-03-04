module.exports=[625562,a=>{"use strict";class b{static GetShadersRepository(a=0){return 0===a?b.ShadersRepository:b.ShadersRepositoryWGSL}static GetShadersStore(a=0){return 0===a?b.ShadersStore:b.ShadersStoreWGSL}static GetIncludesShadersStore(a=0){return 0===a?b.IncludesShadersStore:b.IncludesShadersStoreWGSL}}b.ShadersRepository="src/Shaders/",b.ShadersStore={},b.IncludesShadersStore={},b.ShadersRepositoryWGSL="src/ShadersWGSL/",b.ShadersStoreWGSL={},b.IncludesShadersStoreWGSL={},a.s(["ShaderStore",()=>b])},964653,a=>{"use strict";var b=a.i(625562);let c="helperFunctions",d=`const float PI=3.1415926535897932384626433832795;const float TWO_PI=6.283185307179586;const float HALF_PI=1.5707963267948966;const float RECIPROCAL_PI=0.3183098861837907;const float RECIPROCAL_PI2=0.15915494309189535;const float RECIPROCAL_PI4=0.07957747154594767;const float HALF_MIN=5.96046448e-08; 
const float LinearEncodePowerApprox=2.2;const float GammaEncodePowerApprox=1.0/LinearEncodePowerApprox;const vec3 LuminanceEncodeApprox=vec3(0.2126,0.7152,0.0722);const float Epsilon=0.0000001;
#define saturate(x) clamp(x,0.0,1.0)
#define absEps(x) abs(x)+Epsilon
#define maxEps(x) max(x,Epsilon)
#define saturateEps(x) clamp(x,Epsilon,1.0)
mat3 transposeMat3(mat3 inMatrix) {vec3 i0=inMatrix[0];vec3 i1=inMatrix[1];vec3 i2=inMatrix[2];mat3 outMatrix=mat3(
vec3(i0.x,i1.x,i2.x),
vec3(i0.y,i1.y,i2.y),
vec3(i0.z,i1.z,i2.z)
);return outMatrix;}
mat3 inverseMat3(mat3 inMatrix) {float a00=inMatrix[0][0],a01=inMatrix[0][1],a02=inMatrix[0][2];float a10=inMatrix[1][0],a11=inMatrix[1][1],a12=inMatrix[1][2];float a20=inMatrix[2][0],a21=inMatrix[2][1],a22=inMatrix[2][2];float b01=a22*a11-a12*a21;float b11=-a22*a10+a12*a20;float b21=a21*a10-a11*a20;float det=a00*b01+a01*b11+a02*b21;return mat3(b01,(-a22*a01+a02*a21),(a12*a01-a02*a11),
b11,(a22*a00-a02*a20),(-a12*a00+a02*a10),
b21,(-a21*a00+a01*a20),(a11*a00-a01*a10))/det;}
#if USE_EXACT_SRGB_CONVERSIONS
vec3 toLinearSpaceExact(vec3 color)
{vec3 nearZeroSection=0.0773993808*color;vec3 remainingSection=pow(0.947867299*(color+vec3(0.055)),vec3(2.4));
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
return mix(remainingSection,nearZeroSection,lessThanEqual(color,vec3(0.04045)));
#else
return
vec3(
color.r<=0.04045 ? nearZeroSection.r : remainingSection.r,
color.g<=0.04045 ? nearZeroSection.g : remainingSection.g,
color.b<=0.04045 ? nearZeroSection.b : remainingSection.b);
#endif
}
vec3 toGammaSpaceExact(vec3 color)
{vec3 nearZeroSection=12.92*color;vec3 remainingSection=1.055*pow(color,vec3(0.41666))-vec3(0.055);
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
return mix(remainingSection,nearZeroSection,lessThanEqual(color,vec3(0.0031308)));
#else
return
vec3(
color.r<=0.0031308 ? nearZeroSection.r : remainingSection.r,
color.g<=0.0031308 ? nearZeroSection.g : remainingSection.g,
color.b<=0.0031308 ? nearZeroSection.b : remainingSection.b);
#endif
}
#endif
float toLinearSpace(float color)
{
#if USE_EXACT_SRGB_CONVERSIONS
float nearZeroSection=0.0773993808*color;float remainingSection=pow(0.947867299*(color+0.055),2.4);return color<=0.04045 ? nearZeroSection : remainingSection;
#else
return pow(color,LinearEncodePowerApprox);
#endif
}
vec3 toLinearSpace(vec3 color)
{
#if USE_EXACT_SRGB_CONVERSIONS
return toLinearSpaceExact(color);
#else
return pow(color,vec3(LinearEncodePowerApprox));
#endif
}
vec4 toLinearSpace(vec4 color)
{
#if USE_EXACT_SRGB_CONVERSIONS
return vec4(toLinearSpaceExact(color.rgb),color.a);
#else
return vec4(pow(color.rgb,vec3(LinearEncodePowerApprox)),color.a);
#endif
}
float toGammaSpace(float color)
{
#if USE_EXACT_SRGB_CONVERSIONS
float nearZeroSection=12.92*color;float remainingSection=1.055*pow(color,0.41666)-0.055;return color<=0.0031308 ? nearZeroSection : remainingSection;
#else
return pow(color,GammaEncodePowerApprox);
#endif
}
vec3 toGammaSpace(vec3 color)
{
#if USE_EXACT_SRGB_CONVERSIONS
return toGammaSpaceExact(color);
#else
return pow(color,vec3(GammaEncodePowerApprox));
#endif
}
vec4 toGammaSpace(vec4 color)
{
#if USE_EXACT_SRGB_CONVERSIONS
return vec4(toGammaSpaceExact(color.rgb),color.a);
#else
return vec4(pow(color.rgb,vec3(GammaEncodePowerApprox)),color.a);
#endif
}
float square(float value)
{return value*value;}
vec3 square(vec3 value)
{return value*value;}
float pow5(float value) {float sq=value*value;return sq*sq*value;}
float getLuminance(vec3 color)
{return saturate(dot(color,LuminanceEncodeApprox));}
float getRand(vec2 seed) {return fract(sin(dot(seed.xy ,vec2(12.9898,78.233)))*43758.5453);}
float dither(vec2 seed,float varianceAmount) {float rand=getRand(seed);float normVariance=varianceAmount/255.0;float dither=mix(-normVariance,normVariance,rand);return dither;}
const float rgbdMaxRange=255.;vec4 toRGBD(vec3 color) {float maxRGB=maxEps(max(color.r,max(color.g,color.b)));float D =max(rgbdMaxRange/maxRGB,1.);D =saturate(floor(D)/255.);vec3 rgb=color.rgb*D;rgb=toGammaSpace(rgb);return vec4(saturate(rgb),D);}
vec3 fromRGBD(vec4 rgbd) {rgbd.rgb=toLinearSpace(rgbd.rgb);return rgbd.rgb/rgbd.a;}
vec3 parallaxCorrectNormal( vec3 vertexPos,vec3 origVec,vec3 cubeSize,vec3 cubePos ) {vec3 invOrigVec=vec3(1.)/origVec;vec3 halfSize=cubeSize*0.5;vec3 intersecAtMaxPlane=(cubePos+halfSize-vertexPos)*invOrigVec;vec3 intersecAtMinPlane=(cubePos-halfSize-vertexPos)*invOrigVec;vec3 largestIntersec=max(intersecAtMaxPlane,intersecAtMinPlane);float distance=min(min(largestIntersec.x,largestIntersec.y),largestIntersec.z);vec3 intersectPositionWS=vertexPos+origVec*distance;return intersectPositionWS-cubePos;}
vec3 equirectangularToCubemapDirection(vec2 uv) {float longitude=uv.x*TWO_PI-PI;float latitude=HALF_PI-uv.y*PI;vec3 direction;direction.x=cos(latitude)*sin(longitude);direction.y=sin(latitude);direction.z=cos(latitude)*cos(longitude);return direction;}
float sqrtClamped(float value) {return sqrt(max(value,0.));}
float avg(vec3 value) {return dot(value,vec3(0.333333333));}
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE) 
uint extractBits(uint value,int offset,int width) {return (value>>offset) & ((1u<<width)-1u);}
int onlyBitPosition(uint value) {return (floatBitsToInt(float(value))>>23)-0x7f;}
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s(["helperFunctions",0,{name:c,shader:d}])},463068,a=>{"use strict";var b=a.i(625562);let c="helperFunctions",d=`const PI: f32=3.1415926535897932384626433832795;const TWO_PI: f32=6.283185307179586;const HALF_PI: f32=1.5707963267948966;const RECIPROCAL_PI: f32=0.3183098861837907;const RECIPROCAL_PI2: f32=0.15915494309189535;const RECIPROCAL_PI4: f32=0.07957747154594767;const HALF_MIN: f32=5.96046448e-08; 
const LinearEncodePowerApprox: f32=2.2;const GammaEncodePowerApprox: f32=1.0/LinearEncodePowerApprox;const LuminanceEncodeApprox: vec3f=vec3f(0.2126,0.7152,0.0722);const Epsilon:f32=0.0000001;fn square(x: f32)->f32 {return x*x;}
fn saturate(x: f32)->f32 {return clamp(x,0.0,1.0);}
fn saturateVec3(x: vec3f)->vec3f {return clamp(x,vec3f(),vec3f(1.0));}
fn saturateEps(x: f32)->f32 {return clamp(x,Epsilon,1.0);}
fn maxEps(x: f32)->f32 {return max(x,Epsilon);}
fn maxEpsVec3(x: vec3f)->vec3f {return max(x,vec3f(Epsilon));}
fn absEps(x: f32)->f32 {return abs(x)+Epsilon;}
fn transposeMat3(inMatrix: mat3x3f)->mat3x3f {let i0: vec3f=inMatrix[0];let i1: vec3f=inMatrix[1];let i2: vec3f=inMatrix[2];let outMatrix:mat3x3f=mat3x3f(
vec3(i0.x,i1.x,i2.x),
vec3(i0.y,i1.y,i2.y),
vec3(i0.z,i1.z,i2.z)
);return outMatrix;}
fn inverseMat3(inMatrix: mat3x3f)->mat3x3f {let a00: f32=inMatrix[0][0];let a01: f32=inMatrix[0][1];let a02: f32=inMatrix[0][2];let a10: f32=inMatrix[1][0];let a11: f32=inMatrix[1][1];let a12: f32=inMatrix[1][2];let a20: f32=inMatrix[2][0];let a21: f32=inMatrix[2][1];let a22: f32=inMatrix[2][2];let b01: f32=a22*a11-a12*a21;let b11: f32=-a22*a10+a12*a20;let b21: f32=a21*a10-a11*a20;let det: f32=a00*b01+a01*b11+a02*b21;return mat3x3f(b01/det,(-a22*a01+a02*a21)/det,(a12*a01-a02*a11)/det,
b11/det,(a22*a00-a02*a20)/det,(-a12*a00+a02*a10)/det,
b21/det,(-a21*a00+a01*a20)/det,(a11*a00-a01*a10)/det);}
#if USE_EXACT_SRGB_CONVERSIONS
fn toLinearSpaceExact(color: vec3f)->vec3f
{let nearZeroSection: vec3f=0.0773993808*color;let remainingSection: vec3f=pow(0.947867299*(color+vec3f(0.055)),vec3f(2.4));return mix(remainingSection,nearZeroSection,lessThanEqual(color,vec3f(0.04045)));}
fn toGammaSpaceExact(color: vec3f)->vec3f
{let nearZeroSection: vec3f=12.92*color;let remainingSection: vec3f=1.055*pow(color,vec3f(0.41666))-vec3f(0.055);return mix(remainingSection,nearZeroSection,lessThanEqual(color,vec3f(0.0031308)));}
#endif
fn toLinearSpace(color: f32)->f32
{
#if USE_EXACT_SRGB_CONVERSIONS
var nearZeroSection=0.0773993808*color;var remainingSection=pow(0.947867299*(color+0.055),2.4);return select(remainingSection,nearZeroSection,color<=0.04045);
#else
return pow(color,LinearEncodePowerApprox);
#endif
}
fn toLinearSpaceVec3(color: vec3f)->vec3f
{
#if USE_EXACT_SRGB_CONVERSIONS
return toLinearSpaceExact(color);
#else
return pow(color,vec3f(LinearEncodePowerApprox));
#endif
}
fn toLinearSpaceVec4(color: vec4<f32>)->vec4<f32>
{
#if USE_EXACT_SRGB_CONVERSIONS
return vec4f(toLinearSpaceExact(color.rgb),color.a);
#else
return vec4f(pow(color.rgb,vec3f(LinearEncodePowerApprox)),color.a);
#endif
}
fn toGammaSpace(color: vec4<f32>)->vec4<f32>
{
#if USE_EXACT_SRGB_CONVERSIONS
return vec4<f32>(toGammaSpaceExact(color.rgb),color.a);
#else
return vec4<f32>(pow(color.rgb,vec3f(GammaEncodePowerApprox)),color.a);
#endif
}
fn toGammaSpaceVec3(color: vec3f)->vec3f
{
#if USE_EXACT_SRGB_CONVERSIONS
return toGammaSpaceExact(color);
#else
return pow(color,vec3f(GammaEncodePowerApprox));
#endif
}
fn squareVec3(value: vec3f)->vec3f
{return value*value;}
fn pow5(value: f32)->f32 {let sq: f32=value*value;return sq*sq*value;}
fn getLuminance(color: vec3f)->f32
{return saturate(dot(color,LuminanceEncodeApprox));}
fn getRand(seed: vec2<f32>)->f32 {return fract(sin(dot(seed.xy ,vec2<f32>(12.9898,78.233)))*43758.5453);}
fn dither(seed: vec2<f32>,varianceAmount: f32)->f32 {let rand: f32=getRand(seed);let normVariance: f32=varianceAmount/255.0;let dither: f32=mix(-normVariance,normVariance,rand);return dither;}
const rgbdMaxRange: f32=255.0;fn toRGBD(color: vec3f)->vec4<f32> {let maxRGB: f32=max(max(color.r,max(color.g,color.b)),Epsilon);var D: f32 =max(rgbdMaxRange/maxRGB,1.);D =clamp(floor(D)/255.0,0.,1.);var rgb: vec3f =color.rgb*D;rgb=toGammaSpaceVec3(rgb);return vec4<f32>(saturateVec3(rgb),D);}
fn fromRGBD(rgbd: vec4<f32>)->vec3f {let rgb=toLinearSpaceVec3(rgbd.rgb);return rgb/rgbd.a;}
fn parallaxCorrectNormal(vertexPos: vec3f,origVec: vec3f,cubeSize: vec3f,cubePos: vec3f)->vec3f {let invOrigVec: vec3f=vec3f(1.)/origVec;let halfSize: vec3f=cubeSize*0.5;let intersecAtMaxPlane: vec3f=(cubePos+halfSize-vertexPos)*invOrigVec;let intersecAtMinPlane: vec3f=(cubePos-halfSize-vertexPos)*invOrigVec;let largestIntersec: vec3f=max(intersecAtMaxPlane,intersecAtMinPlane);let distance: f32=min(min(largestIntersec.x,largestIntersec.y),largestIntersec.z);let intersectPositionWS: vec3f=vertexPos+origVec*distance;return intersectPositionWS-cubePos;}
fn equirectangularToCubemapDirection(uv : vec2f)->vec3f {var longitude : f32=uv.x*TWO_PI-PI;var latitude : f32=HALF_PI-uv.y*PI;var direction : vec3f;direction.x=cos(latitude)*sin(longitude);direction.y=sin(latitude);direction.z=cos(latitude)*cos(longitude);return direction;}
fn sqrtClamped(value: f32)->f32 {return sqrt(max(value,0.));}
fn avg(value: vec3f)->f32 {return dot(value,vec3f(0.333333333));}
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["helperFunctionsWGSL",0,{name:c,shader:d}])},918622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},210312,a=>{"use strict";function b(a){if(a.getClassName)return a.getClassName()}function c(a,b){return a===b&&("Vector2"===a||"Vector3"===a||"Vector4"===a||"Quaternion"===a)}function d(a,b){return a===b&&("Matrix"===a||"Matrix2D"===a||"Matrix3D"===a)}function e(a,b){return"FlowGraphInteger"===a&&"FlowGraphInteger"===b}function f(a,b){let c="number"==typeof a||"number"==typeof a?.value;return c&&!b?!isNaN(g(a)):c}function g(a){return"number"==typeof a?a:a.value}a.s(["_AreSameIntegerClass",()=>e,"_AreSameMatrixClass",()=>d,"_AreSameVectorOrQuaternionClass",()=>c,"_GetClassNameOf",()=>b,"_IsDescendantOf",()=>function a(b,c){return!!(b.parent&&(b.parent===c||a(b.parent,c)))},"getNumericValue",()=>g,"isNumeric",()=>f])},707101,a=>{"use strict";var b=a.i(625562);let c="instancesVertex",d=`#ifdef INSTANCES
var finalWorld=mat4x4<f32>(vertexInputs.world0,vertexInputs.world1,vertexInputs.world2,vertexInputs.world3);
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
var finalPreviousWorld=mat4x4<f32>(
vertexInputs.previousWorld0,vertexInputs.previousWorld1,
vertexInputs.previousWorld2,vertexInputs.previousWorld3);
#endif
#ifdef THIN_INSTANCES
#if !defined(WORLD_UBO)
finalWorld=uniforms.world*finalWorld;
#else
finalWorld=mesh.world*finalWorld;
#endif
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
finalPreviousWorld=uniforms.previousWorld*finalPreviousWorld;
#endif
#endif
#else
#if !defined(WORLD_UBO)
var finalWorld=uniforms.world;
#else
var finalWorld=mesh.world;
#endif
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
var finalPreviousWorld=uniforms.previousWorld;
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},488049,a=>{"use strict";var b=a.i(625562);let c="instancesDeclaration",d=`#ifdef INSTANCES
attribute world0 : vec4<f32>;attribute world1 : vec4<f32>;attribute world2 : vec4<f32>;attribute world3 : vec4<f32>;
#ifdef INSTANCESCOLOR
attribute instanceColor : vec4<f32>;
#endif
#if defined(THIN_INSTANCES) && !defined(WORLD_UBO)
uniform world : mat4x4<f32>;
#endif
#if defined(VELOCITY) || defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
attribute previousWorld0 : vec4<f32>;attribute previousWorld1 : vec4<f32>;attribute previousWorld2 : vec4<f32>;attribute previousWorld3 : vec4<f32>;
#ifdef THIN_INSTANCES
uniform previousWorld : mat4x4<f32>;
#endif
#endif
#else
#if !defined(WORLD_UBO)
uniform world : mat4x4<f32>;
#endif
#if defined(VELOCITY) || defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
uniform previousWorld : mat4x4<f32>;
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},662384,a=>{"use strict";var b=a.i(625562);let c="bonesDeclaration",d=`#if NUM_BONE_INFLUENCERS>0
attribute matricesIndices : vec4<f32>;attribute matricesWeights : vec4<f32>;
#if NUM_BONE_INFLUENCERS>4
attribute matricesIndicesExtra : vec4<f32>;attribute matricesWeightsExtra : vec4<f32>;
#endif
#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#ifdef BONETEXTURE
var boneSampler : texture_2d<f32>;uniform boneTextureWidth : f32;
#else
uniform mBones : array<mat4x4f,BonesPerMesh>;
#endif
#ifdef BONES_VELOCITY_ENABLED
uniform mPreviousBones : array<mat4x4f,BonesPerMesh>;
#endif
#ifdef BONETEXTURE
fn readMatrixFromRawSampler(smp : texture_2d<f32>,index : f32)->mat4x4f
{let offset=i32(index) *4; 
let m0=textureLoad(smp,vec2<i32>(offset+0,0),0);let m1=textureLoad(smp,vec2<i32>(offset+1,0),0);let m2=textureLoad(smp,vec2<i32>(offset+2,0),0);let m3=textureLoad(smp,vec2<i32>(offset+3,0),0);return mat4x4f(m0,m1,m2,m3);}
#endif
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["bonesDeclarationWGSL",0,{name:c,shader:d}])},304277,a=>{"use strict";var b=a.i(625562);let c="bonesVertex",d=`#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#if NUM_BONE_INFLUENCERS>0
var influence : mat4x4<f32>;
#ifdef BONETEXTURE
influence=readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[0])*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[1])*vertexInputs.matricesWeights[1];
#endif 
#if NUM_BONE_INFLUENCERS>2
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[2])*vertexInputs.matricesWeights[2];
#endif 
#if NUM_BONE_INFLUENCERS>3
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[3])*vertexInputs.matricesWeights[3];
#endif 
#if NUM_BONE_INFLUENCERS>4
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[0])*vertexInputs.matricesWeightsExtra[0];
#endif 
#if NUM_BONE_INFLUENCERS>5
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[1])*vertexInputs.matricesWeightsExtra[1];
#endif 
#if NUM_BONE_INFLUENCERS>6
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[2])*vertexInputs.matricesWeightsExtra[2];
#endif 
#if NUM_BONE_INFLUENCERS>7
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[3])*vertexInputs.matricesWeightsExtra[3];
#endif 
#else 
influence=uniforms.mBones[i32(vertexInputs.matricesIndices[0])]*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndices[1])]*vertexInputs.matricesWeights[1];
#endif 
#if NUM_BONE_INFLUENCERS>2
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndices[2])]*vertexInputs.matricesWeights[2];
#endif 
#if NUM_BONE_INFLUENCERS>3
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndices[3])]*vertexInputs.matricesWeights[3];
#endif 
#if NUM_BONE_INFLUENCERS>4
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[0])]*vertexInputs.matricesWeightsExtra[0];
#endif 
#if NUM_BONE_INFLUENCERS>5
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[1])]*vertexInputs.matricesWeightsExtra[1];
#endif 
#if NUM_BONE_INFLUENCERS>6
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[2])]*vertexInputs.matricesWeightsExtra[2];
#endif 
#if NUM_BONE_INFLUENCERS>7
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[3])]*vertexInputs.matricesWeightsExtra[3];
#endif 
#endif
finalWorld=finalWorld*influence;
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["bonesVertexWGSL",0,{name:c,shader:d}])},616212,83067,a=>{"use strict";var b=a.i(625562);let c="bakedVertexAnimationDeclaration",d=`#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
uniform bakedVertexAnimationTime: f32;uniform bakedVertexAnimationTextureSizeInverted: vec2<f32>;uniform bakedVertexAnimationSettings: vec4<f32>;var bakedVertexAnimationTexture : texture_2d<f32>;
#ifdef INSTANCES
attribute bakedVertexAnimationSettingsInstanced : vec4<f32>;
#endif
fn readMatrixFromRawSamplerVAT(smp : texture_2d<f32>,index : f32,frame : f32)->mat4x4<f32>
{let offset=i32(index)*4;let frameUV=i32(frame);let m0=textureLoad(smp,vec2<i32>(offset+0,frameUV),0);let m1=textureLoad(smp,vec2<i32>(offset+1,frameUV),0);let m2=textureLoad(smp,vec2<i32>(offset+2,frameUV),0);let m3=textureLoad(smp,vec2<i32>(offset+3,frameUV),0);return mat4x4<f32>(m0,m1,m2,m3);}
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([],616212);let e="bakedVertexAnimation",f=`#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
{
#ifdef INSTANCES
let VATStartFrame: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.x;let VATEndFrame: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.y;let VATOffsetFrame: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.z;let VATSpeed: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.w;
#else
let VATStartFrame: f32=uniforms.bakedVertexAnimationSettings.x;let VATEndFrame: f32=uniforms.bakedVertexAnimationSettings.y;let VATOffsetFrame: f32=uniforms.bakedVertexAnimationSettings.z;let VATSpeed: f32=uniforms.bakedVertexAnimationSettings.w;
#endif
let totalFrames: f32=VATEndFrame-VATStartFrame+1.0;let time: f32=uniforms.bakedVertexAnimationTime*VATSpeed/totalFrames;let frameCorrection: f32=select(1.0,0.0,time<1.0);let numOfFrames: f32=totalFrames-frameCorrection;var VATFrameNum: f32=fract(time)*numOfFrames;VATFrameNum=(VATFrameNum+VATOffsetFrame) % numOfFrames;VATFrameNum=floor(VATFrameNum);VATFrameNum=VATFrameNum+VATStartFrame+frameCorrection;var VATInfluence : mat4x4<f32>;VATInfluence=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[0],VATFrameNum)*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[1],VATFrameNum)*vertexInputs.matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[2],VATFrameNum)*vertexInputs.matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[3],VATFrameNum)*vertexInputs.matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[0],VATFrameNum)*vertexInputs.matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[1],VATFrameNum)*vertexInputs.matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[2],VATFrameNum)*vertexInputs.matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[3],VATFrameNum)*vertexInputs.matricesWeightsExtra[3];
#endif
finalWorld=finalWorld*VATInfluence;}
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[e]||(b.ShaderStore.IncludesShadersStoreWGSL[e]=f),a.s([],83067)},549432,a=>{"use strict";var b=a.i(625562);let c="morphTargetsVertexDeclaration",d=`#ifdef MORPHTARGETS
#ifndef MORPHTARGETS_TEXTURE
#ifdef MORPHTARGETS_POSITION
attribute position{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_NORMAL
attribute normal{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_TANGENT
attribute tangent{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_UV
attribute uv_{X} : vec2<f32>;
#endif
#ifdef MORPHTARGETS_UV2
attribute uv2_{X} : vec2<f32>;
#endif
#ifdef MORPHTARGETS_COLOR
attribute color{X} : vec4<f32>;
#endif
#elif {X}==0
uniform morphTargetCount: f32;
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["morphTargetsVertexDeclarationWGSL",0,{name:c,shader:d}])},475114,a=>{"use strict";var b=a.i(625562);let c="morphTargetsVertexGlobalDeclaration",d=`#ifdef MORPHTARGETS
uniform morphTargetInfluences : array<f32,NUM_MORPH_INFLUENCERS>;
#ifdef MORPHTARGETS_TEXTURE 
uniform morphTargetTextureIndices : array<f32,NUM_MORPH_INFLUENCERS>;uniform morphTargetTextureInfo : vec3<f32>;var morphTargets : texture_2d_array<f32>;var morphTargetsSampler : sampler;fn readVector3FromRawSampler(targetIndex : i32,vertexIndex : f32)->vec3<f32>
{ 
let y=floor(vertexIndex/uniforms.morphTargetTextureInfo.y);let x=vertexIndex-y*uniforms.morphTargetTextureInfo.y;let textureUV=vec2<f32>((x+0.5)/uniforms.morphTargetTextureInfo.y,(y+0.5)/uniforms.morphTargetTextureInfo.z);return textureSampleLevel(morphTargets,morphTargetsSampler,textureUV,i32(uniforms.morphTargetTextureIndices[targetIndex]),0.0).xyz;}
fn readVector4FromRawSampler(targetIndex : i32,vertexIndex : f32)->vec4<f32>
{ 
let y=floor(vertexIndex/uniforms.morphTargetTextureInfo.y);let x=vertexIndex-y*uniforms.morphTargetTextureInfo.y;let textureUV=vec2<f32>((x+0.5)/uniforms.morphTargetTextureInfo.y,(y+0.5)/uniforms.morphTargetTextureInfo.z);return textureSampleLevel(morphTargets,morphTargetsSampler,textureUV,i32(uniforms.morphTargetTextureIndices[targetIndex]),0.0);}
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["morphTargetsVertexGlobalDeclarationWGSL",0,{name:c,shader:d}])},250197,a=>{"use strict";var b=a.i(625562);let c="morphTargetsVertexGlobal",d=`#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
var vertexID : f32;
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["morphTargetsVertexGlobalWGSL",0,{name:c,shader:d}])},705357,a=>{"use strict";var b=a.i(625562);let c="morphTargetsVertex",d=`#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
#if {X}==0
for (var i=0; i<NUM_MORPH_INFLUENCERS; i=i+1) {if (f32(i)>=uniforms.morphTargetCount) {break;}
vertexID=f32(vertexInputs.vertexIndex)*uniforms.morphTargetTextureInfo.x;
#ifdef MORPHTARGETS_POSITION
positionUpdated=positionUpdated+(readVector3FromRawSampler(i,vertexID)-vertexInputs.position)*uniforms.morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASPOSITIONS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_NORMAL
normalUpdated=normalUpdated+(readVector3FromRawSampler(i,vertexID) -vertexInputs.normal)*uniforms.morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASNORMALS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_UV
uvUpdated=uvUpdated+(readVector3FromRawSampler(i,vertexID).xy-vertexInputs.uv)*uniforms.morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASUVS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_TANGENT
tangentUpdated=vec4f(tangentUpdated.xyz+(readVector3FromRawSampler(i,vertexID) -vertexInputs.tangent.xyz)*uniforms.morphTargetInfluences[i],tangentUpdated.a);
#endif
#ifdef MORPHTARGETTEXTURE_HASTANGENTS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_UV2
uv2Updated=uv2Updated+(readVector3FromRawSampler(i,vertexID).xy-vertexInputs.uv2)*uniforms.morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETS_COLOR
colorUpdated=colorUpdated+(readVector4FromRawSampler(i,vertexID)-vertexInputs.color)*uniforms.morphTargetInfluences[i];
#endif
}
#endif
#else
#ifdef MORPHTARGETS_POSITION
positionUpdated=positionUpdated+(vertexInputs.position{X}-vertexInputs.position)*uniforms.morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_NORMAL
normalUpdated=normalUpdated+(vertexInputs.normal{X}-vertexInputs.normal)*uniforms.morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_TANGENT
tangentUpdated=vec4f(tangentUpdated.xyz+(vertexInputs.tangent{X}-vertexInputs.tangent.xyz)*uniforms.morphTargetInfluences[{X}],tangentUpdated.a);
#endif
#ifdef MORPHTARGETS_UV
uvUpdated=uvUpdated+(vertexInputs.uv_{X}-vertexInputs.uv)*uniforms.morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_UV2
uv2Updated=uv2Updated+(vertexInputs.uv2_{X}-vertexInputs.uv2)*uniforms.morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_COLOR
colorUpdated=colorUpdated+(vertexInputs.color{X}-vertexInputs.color)*uniforms.morphTargetInfluences[{X}];
#endif
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["morphTargetsVertexWGSL",0,{name:c,shader:d}])},70458,a=>{"use strict";var b=a.i(542693);class c extends b.FlowGraphExecutionBlockWithOutSignal{constructor(a,b){if(super(a),this._eventsSignalOutputs={},this.done=this._registerSignalOutput("done"),b)for(const a of b)this._eventsSignalOutputs[a]=this._registerSignalOutput(a+"Event")}_executeOnTick(a){}_startPendingTasks(a){a._getExecutionVariable(this,"_initialized",!1)&&(this._cancelPendingTasks(a),this._resetAfterCanceled(a)),this._preparePendingTasks(a),a._addPendingBlock(this),this.out._activateSignal(a),a._setExecutionVariable(this,"_initialized",!0)}_resetAfterCanceled(a){a._deleteExecutionVariable(this,"_initialized"),a._removePendingBlock(this)}}a.s(["FlowGraphAsyncExecutionBlock",()=>c])},344611,a=>{"use strict";var b=a.i(70458);class c extends b.FlowGraphAsyncExecutionBlock{constructor(){super(...arguments),this.initPriority=0,this.type="NoTrigger"}_execute(a){a._notifyExecuteNode(this),this.done._activateSignal(a)}}a.s(["FlowGraphEventBlock",()=>c])},533676,a=>{"use strict";var b=a.i(625562);let c="pbrBRDFFunctions",d=`#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
#define BRDF_DIFFUSE_MODEL_EON 0
#define BRDF_DIFFUSE_MODEL_BURLEY 1
#define BRDF_DIFFUSE_MODEL_LAMBERT 2
#define BRDF_DIFFUSE_MODEL_LEGACY 3
#define DIELECTRIC_SPECULAR_MODEL_GLTF 0
#define DIELECTRIC_SPECULAR_MODEL_OPENPBR 1
#define CONDUCTOR_SPECULAR_MODEL_GLTF 0
#define CONDUCTOR_SPECULAR_MODEL_OPENPBR 1
#if !defined(PBR_VERTEX_SHADER) && !defined(OPENPBR_VERTEX_SHADER)
#ifdef MS_BRDF_ENERGY_CONSERVATION
vec3 getEnergyConservationFactor(const vec3 specularEnvironmentR0,const vec3 environmentBrdf) {return 1.0+specularEnvironmentR0*(1.0/environmentBrdf.y-1.0);}
#endif
#if CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR 
vec3 getF82Specular(float NdotV,vec3 F0,vec3 edgeTint,float roughness) {const float cos_theta_max=0.142857143; 
const float one_minus_cos_theta_max_to_the_fifth=0.462664366; 
const float one_minus_cos_theta_max_to_the_sixth=0.396569457; 
vec3 white_minus_F0=vec3(1.0)-F0;vec3 b_numerator=(F0+white_minus_F0*one_minus_cos_theta_max_to_the_fifth)*(vec3(1.0)-edgeTint);const float b_denominator=cos_theta_max*one_minus_cos_theta_max_to_the_sixth;const float b_denominator_reciprocal=1.0/b_denominator;vec3 b=b_numerator*b_denominator_reciprocal; 
float cos_theta=max(roughness,NdotV);float one_minus_cos_theta=1.0-cos_theta;vec3 offset_from_F0=(white_minus_F0-b*cos_theta*one_minus_cos_theta)*pow(one_minus_cos_theta,5.0);return clamp(F0+offset_from_F0,0.0,1.0);}
#endif
#ifdef FUZZENVIRONMENTBRDF
vec3 getFuzzBRDFLookup(float NdotV,float perceptualRoughness) {vec2 UV=vec2(perceptualRoughness,NdotV);vec4 brdfLookup=texture2D(environmentFuzzBrdfSampler,UV);const vec2 RiRange=vec2(0.0,0.75);const vec2 ARange =vec2(0.005,0.88);const vec2 BRange =vec2(-0.18,0.002);brdfLookup.r=mix(ARange.x, ARange.y, brdfLookup.r);brdfLookup.g=mix(BRange.x, BRange.y, brdfLookup.g);brdfLookup.b=mix(RiRange.x,RiRange.y,brdfLookup.b);return brdfLookup.rgb;}
#endif
#ifdef ENVIRONMENTBRDF
vec3 getBRDFLookup(float NdotV,float perceptualRoughness) {vec2 UV=vec2(NdotV,perceptualRoughness);vec4 brdfLookup=texture2D(environmentBrdfSampler,UV);
#ifdef ENVIRONMENTBRDF_RGBD
brdfLookup.rgb=fromRGBD(brdfLookup.rgba);
#endif
return brdfLookup.rgb;}
vec3 getReflectanceFromBRDFLookup(const vec3 specularEnvironmentR0,const vec3 specularEnvironmentR90,const vec3 environmentBrdf) {
#ifdef BRDF_V_HEIGHT_CORRELATED
vec3 reflectance=(specularEnvironmentR90-specularEnvironmentR0)*environmentBrdf.x+specularEnvironmentR0*environmentBrdf.y;
#else
vec3 reflectance=specularEnvironmentR0*environmentBrdf.x+specularEnvironmentR90*environmentBrdf.y;
#endif
return reflectance;}
vec3 getReflectanceFromBRDFLookup(const vec3 specularEnvironmentR0,const vec3 environmentBrdf) {
#ifdef BRDF_V_HEIGHT_CORRELATED
vec3 reflectance=mix(environmentBrdf.xxx,environmentBrdf.yyy,specularEnvironmentR0);
#else
vec3 reflectance=specularEnvironmentR0*environmentBrdf.x+environmentBrdf.y;
#endif
return reflectance;}
#endif
/* NOT USED
#if defined(SHEEN) && defined(SHEEN_SOFTER)
float getBRDFLookupCharlieSheen(float NdotV,float perceptualRoughness)
{float c=1.0-NdotV;float c3=c*c*c;return 0.65584461*c3+1.0/(4.16526551+exp(-7.97291361*perceptualRoughness+6.33516894));}
#endif
*/
#if !defined(ENVIRONMENTBRDF) || defined(REFLECTIONMAP_SKYBOX) || defined(ALPHAFRESNEL)
vec3 getReflectanceFromAnalyticalBRDFLookup_Jones(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness)
{float weight=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);return reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));}
#endif
#if defined(SHEEN) && defined(ENVIRONMENTBRDF)
/**
* The sheen BRDF not containing F can be easily stored in the blue channel of the BRDF texture.
* The blue channel contains DCharlie*VAshikhmin*NdotL as a lokkup table
*/
vec3 getSheenReflectanceFromBRDFLookup(const vec3 reflectance0,const vec3 environmentBrdf) {vec3 sheenEnvironmentReflectance=reflectance0*environmentBrdf.b;return sheenEnvironmentReflectance;}
#endif
vec3 fresnelSchlickGGX(float VdotH,vec3 reflectance0,vec3 reflectance90)
{return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);}
float fresnelSchlickGGX(float VdotH,float reflectance0,float reflectance90)
{return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);}
#ifdef CLEARCOAT
vec3 getR0RemappedForClearCoat(vec3 f0) {
#ifdef CLEARCOAT_DEFAULTIOR
#ifdef MOBILE
return saturate(f0*(f0*0.526868+0.529324)-0.0482256);
#else
return saturate(f0*(f0*(0.941892-0.263008*f0)+0.346479)-0.0285998);
#endif
#else
vec3 s=sqrt(f0);vec3 t=(vClearCoatRefractionParams.z+vClearCoatRefractionParams.w*s)/(vClearCoatRefractionParams.w+vClearCoatRefractionParams.z*s);return square(t);
#endif
}
#endif
#ifdef IRIDESCENCE
const mat3 XYZ_TO_REC709=mat3(
3.2404542,-0.9692660, 0.0556434,
-1.5371385, 1.8760108,-0.2040259,
-0.4985314, 0.0415560, 1.0572252
);vec3 getIORTfromAirToSurfaceR0(vec3 f0) {vec3 sqrtF0=sqrt(f0);return (1.+sqrtF0)/(1.-sqrtF0);}
vec3 getR0fromIORs(vec3 iorT,float iorI) {return square((iorT-vec3(iorI))/(iorT+vec3(iorI)));}
float getR0fromIORs(float iorT,float iorI) {return square((iorT-iorI)/(iorT+iorI));}
vec3 evalSensitivity(float opd,vec3 shift) {float phase=2.0*PI*opd*1.0e-9;const vec3 val=vec3(5.4856e-13,4.4201e-13,5.2481e-13);const vec3 pos=vec3(1.6810e+06,1.7953e+06,2.2084e+06);const vec3 var=vec3(4.3278e+09,9.3046e+09,6.6121e+09);vec3 xyz=val*sqrt(2.0*PI*var)*cos(pos*phase+shift)*exp(-square(phase)*var);xyz.x+=9.7470e-14*sqrt(2.0*PI*4.5282e+09)*cos(2.2399e+06*phase+shift[0])*exp(-4.5282e+09*square(phase));xyz/=1.0685e-7;vec3 srgb=XYZ_TO_REC709*xyz;return srgb;}
vec3 evalIridescence(float outsideIOR,float eta2,float cosTheta1,float thinFilmThickness,vec3 baseF0) {vec3 I=vec3(1.0);float iridescenceIOR=mix(outsideIOR,eta2,smoothstep(0.0,0.03,thinFilmThickness));float sinTheta2Sq=square(outsideIOR/iridescenceIOR)*(1.0-square(cosTheta1));float cosTheta2Sq=1.0-sinTheta2Sq;if (cosTheta2Sq<0.0) {return I;}
float cosTheta2=sqrt(cosTheta2Sq);float R0=getR0fromIORs(iridescenceIOR,outsideIOR);float R12=fresnelSchlickGGX(cosTheta1,R0,1.);float R21=R12;float T121=1.0-R12;float phi12=0.0;if (iridescenceIOR<outsideIOR) phi12=PI;float phi21=PI-phi12;vec3 baseIOR=getIORTfromAirToSurfaceR0(clamp(baseF0,0.0,0.9999)); 
vec3 R1=getR0fromIORs(baseIOR,iridescenceIOR);vec3 R23=fresnelSchlickGGX(cosTheta2,R1,vec3(1.));vec3 phi23=vec3(0.0);if (baseIOR[0]<iridescenceIOR) phi23[0]=PI;if (baseIOR[1]<iridescenceIOR) phi23[1]=PI;if (baseIOR[2]<iridescenceIOR) phi23[2]=PI;float opd=2.0*iridescenceIOR*thinFilmThickness*cosTheta2;vec3 phi=vec3(phi21)+phi23;vec3 R123=clamp(R12*R23,1e-5,0.9999);vec3 r123=sqrt(R123);vec3 Rs=square(T121)*R23/(vec3(1.0)-R123);vec3 C0=R12+Rs;I=C0;vec3 Cm=Rs-T121;for (int m=1; m<=2; ++m)
{Cm*=r123;vec3 Sm=2.0*evalSensitivity(float(m)*opd,float(m)*phi);I+=Cm*Sm;}
return max(I,vec3(0.0));}
#endif
float normalDistributionFunction_TrowbridgeReitzGGX(float NdotH,float alphaG)
{float a2=square(alphaG);float d=NdotH*NdotH*(a2-1.0)+1.0;return a2/(PI*d*d);}
#ifdef SHEEN
float normalDistributionFunction_CharlieSheen(float NdotH,float alphaG)
{float invR=1./alphaG;float cos2h=NdotH*NdotH;float sin2h=1.-cos2h;return (2.+invR)*pow(sin2h,invR*.5)/(2.*PI);}
#endif
#ifdef ANISOTROPIC
float normalDistributionFunction_BurleyGGX_Anisotropic(float NdotH,float TdotH,float BdotH,const vec2 alphaTB) {float a2=alphaTB.x*alphaTB.y;vec3 v=vec3(alphaTB.y*TdotH,alphaTB.x *BdotH,a2*NdotH);float v2=dot(v,v);float w2=a2/v2;return a2*w2*w2*RECIPROCAL_PI;}
#endif
#ifdef BRDF_V_HEIGHT_CORRELATED
float smithVisibility_GGXCorrelated(float NdotL,float NdotV,float alphaG) {
#ifdef MOBILE
float GGXV=NdotL*(NdotV*(1.0-alphaG)+alphaG);float GGXL=NdotV*(NdotL*(1.0-alphaG)+alphaG);return 0.5/(GGXV+GGXL);
#else
float a2=alphaG*alphaG;float GGXV=NdotL*sqrt(NdotV*(NdotV-a2*NdotV)+a2);float GGXL=NdotV*sqrt(NdotL*(NdotL-a2*NdotL)+a2);return 0.5/(GGXV+GGXL);
#endif
}
#else
float smithVisibilityG1_TrowbridgeReitzGGXFast(float dot,float alphaG)
{
#ifdef MOBILE
return 1.0/(dot+alphaG+(1.0-alphaG)*dot ));
#else
float alphaSquared=alphaG*alphaG;return 1.0/(dot+sqrt(alphaSquared+(1.0-alphaSquared)*dot*dot));
#endif
}
float smithVisibility_TrowbridgeReitzGGXFast(float NdotL,float NdotV,float alphaG)
{float visibility=smithVisibilityG1_TrowbridgeReitzGGXFast(NdotL,alphaG)*smithVisibilityG1_TrowbridgeReitzGGXFast(NdotV,alphaG);return visibility;}
#endif
#ifdef ANISOTROPIC
float smithVisibility_GGXCorrelated_Anisotropic(float NdotL,float NdotV,float TdotV,float BdotV,float TdotL,float BdotL,const vec2 alphaTB) {float lambdaV=NdotL*length(vec3(alphaTB.x*TdotV,alphaTB.y*BdotV,NdotV));float lambdaL=NdotV*length(vec3(alphaTB.x*TdotL,alphaTB.y*BdotL,NdotL));float v=0.5/(lambdaV+lambdaL);return v;}
#endif
#ifdef CLEARCOAT
float visibility_Kelemen(float VdotH) {return 0.25/(VdotH*VdotH); }
#endif
#ifdef SHEEN
float visibility_Ashikhmin(float NdotL,float NdotV)
{return 1./(4.*(NdotL+NdotV-NdotL*NdotV));}
/* NOT USED
#ifdef SHEEN_SOFTER
float l(float x,float alphaG)
{float oneMinusAlphaSq=(1.0-alphaG)*(1.0-alphaG);float a=mix(21.5473,25.3245,oneMinusAlphaSq);float b=mix(3.82987,3.32435,oneMinusAlphaSq);float c=mix(0.19823,0.16801,oneMinusAlphaSq);float d=mix(-1.97760,-1.27393,oneMinusAlphaSq);float e=mix(-4.32054,-4.85967,oneMinusAlphaSq);return a/(1.0+b*pow(x,c))+d*x+e;}
float lambdaSheen(float cosTheta,float alphaG)
{return abs(cosTheta)<0.5 ? exp(l(cosTheta,alphaG)) : exp(2.0*l(0.5,alphaG)-l(1.0-cosTheta,alphaG));}
float visibility_CharlieSheen(float NdotL,float NdotV,float alphaG)
{float G=1.0/(1.0+lambdaSheen(NdotV,alphaG)+lambdaSheen(NdotL,alphaG));return G/(4.0*NdotV*NdotL);}
#endif
*/
#endif
float diffuseBRDF_Burley(float NdotL,float NdotV,float VdotH,float roughness) {float diffuseFresnelNV=pow5(saturateEps(1.0-NdotL));float diffuseFresnelNL=pow5(saturateEps(1.0-NdotV));float diffuseFresnel90=0.5+2.0*VdotH*VdotH*roughness;float fresnel =
(1.0+(diffuseFresnel90-1.0)*diffuseFresnelNL) *
(1.0+(diffuseFresnel90-1.0)*diffuseFresnelNV);return fresnel/PI;}
const float constant1_FON=0.5-2.0/(3.0*PI);const float constant2_FON=2.0/3.0-28.0/(15.0*PI);float E_FON_approx(float mu,float roughness)
{float sigma=roughness; 
float mucomp=1.0-mu;float mucomp2=mucomp*mucomp;const mat2 Gcoeffs=mat2(0.0571085289,-0.332181442,
0.491881867,0.0714429953);float GoverPi=dot(Gcoeffs*vec2(mucomp,mucomp2),vec2(1.0,mucomp2));return (1.0+sigma*GoverPi)/(1.0+constant1_FON*sigma);}
vec3 diffuseBRDF_EON(vec3 albedo,float roughness,float NdotL,float NdotV,float LdotV)
{vec3 rho=albedo;float sigma=roughness; 
float mu_i=NdotL; 
float mu_o=NdotV; 
float s=LdotV-mu_i*mu_o; 
float sovertF=s>0.0 ? s/max(mu_i,mu_o) : s; 
float AF=1.0/(1.0+constant1_FON*sigma); 
vec3 f_ss=(rho*RECIPROCAL_PI)*AF*(1.0+sigma*sovertF); 
float EFo=E_FON_approx(mu_o,sigma); 
float EFi=E_FON_approx(mu_i,sigma); 
float avgEF=AF*(1.0+constant2_FON*sigma); 
vec3 rho_ms=(rho*rho)*avgEF/(vec3(1.0)-rho*(1.0-avgEF));const float eps=1.0e-7;vec3 f_ms=(rho_ms*RECIPROCAL_PI)*max(eps,1.0-EFo) 
* max(eps,1.0-EFi)
/ max(eps,1.0-avgEF);return (f_ss+f_ms);}
#ifdef SS_TRANSLUCENCY
vec3 transmittanceBRDF_Burley(const vec3 tintColor,const vec3 diffusionDistance,float thickness) {vec3 S=1./maxEps(diffusionDistance);vec3 temp=exp((-0.333333333*thickness)*S);return tintColor.rgb*0.25*(temp*temp*temp+3.0*temp);}
float computeWrappedDiffuseNdotL(float NdotL,float w) {float t=1.0+w;float invt2=1.0/square(t);return saturate((NdotL+w)*invt2);}
#endif
#endif 
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([])},673268,254999,a=>{"use strict";var b=a.i(625562);let c="importanceSampling",d=`vec3 hemisphereCosSample(vec2 u) {float phi=2.*PI*u.x;float cosTheta2=1.-u.y;float cosTheta=sqrt(cosTheta2);float sinTheta=sqrt(1.-cosTheta2);return vec3(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}
vec3 hemisphereImportanceSampleDggx(vec2 u,float a) {float phi=2.*PI*u.x;float cosTheta2=(1.-u.y)/(1.+(a+1.)*((a-1.)*u.y));float cosTheta=sqrt(cosTheta2);float sinTheta=sqrt(1.-cosTheta2);return vec3(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}
vec3 hemisphereImportanceSampleDggxAnisotropic(vec2 Xi,float alphaTangent,float alphaBitangent)
{alphaTangent=max(alphaTangent,0.0001);alphaBitangent=max(alphaBitangent,0.0001);float phi=atan(alphaBitangent/alphaTangent*tan(2.0*3.14159265*Xi.x));if (Xi.x>0.5) phi+=3.14159265; 
float cosPhi=cos(phi);float sinPhi=sin(phi);float alpha2=(cosPhi*cosPhi)/(alphaTangent*alphaTangent) +
(sinPhi*sinPhi)/(alphaBitangent*alphaBitangent);float tanTheta2=Xi.y/(1.0-Xi.y)/alpha2;float cosTheta=1.0/sqrt(1.0+tanTheta2);float sinTheta=sqrt(max(0.0,1.0-cosTheta*cosTheta));return vec3(sinTheta*cosPhi,sinTheta*sinPhi,cosTheta);}
vec3 hemisphereImportanceSampleDCharlie(vec2 u,float a) { 
float phi=2.*PI*u.x;float sinTheta=pow(u.y,a/(2.*a+1.));float cosTheta=sqrt(1.-sinTheta*sinTheta);return vec3(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([],673268);let e="hdrFilteringFunctions",f=`#if NUM_SAMPLES
#if NUM_SAMPLES>0
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
float radicalInverse_VdC(uint bits) 
{bits=(bits<<16u) | (bits>>16u);bits=((bits & 0x55555555u)<<1u) | ((bits & 0xAAAAAAAAu)>>1u);bits=((bits & 0x33333333u)<<2u) | ((bits & 0xCCCCCCCCu)>>2u);bits=((bits & 0x0F0F0F0Fu)<<4u) | ((bits & 0xF0F0F0F0u)>>4u);bits=((bits & 0x00FF00FFu)<<8u) | ((bits & 0xFF00FF00u)>>8u);return float(bits)*2.3283064365386963e-10; }
vec2 hammersley(uint i,uint N)
{return vec2(float(i)/float(N),radicalInverse_VdC(i));}
#else
float vanDerCorpus(int n,int base)
{float invBase=1.0/float(base);float denom =1.0;float result =0.0;for(int i=0; i<32; ++i)
{if(n>0)
{denom =mod(float(n),2.0);result+=denom*invBase;invBase=invBase/2.0;n =int(float(n)/2.0);}}
return result;}
vec2 hammersley(int i,int N)
{return vec2(float(i)/float(N),vanDerCorpus(i,2));}
#endif
float log4(float x) {return log2(x)/2.;}
vec3 uv_to_normal(vec2 uv) {vec3 N;vec2 uvRange=uv;float theta=uvRange.x*2.*PI;float phi=uvRange.y*PI;float sinPhi=sin(phi);N.x=cos(theta)*sinPhi;N.z=sin(theta)*sinPhi;N.y=cos(phi);return N;}
const float NUM_SAMPLES_FLOAT=float(NUM_SAMPLES);const float NUM_SAMPLES_FLOAT_INVERSED=1./NUM_SAMPLES_FLOAT;const float K=4.;
#define inline
vec3 irradiance(
#ifdef CUSTOM_IRRADIANCE_FILTERING_INPUT
CUSTOM_IRRADIANCE_FILTERING_INPUT
#else
samplerCube inputTexture,
#endif
vec3 inputN,vec2 filteringInfo,
float diffuseRoughness,
vec3 surfaceAlbedo,
vec3 inputV
#if IBL_CDF_FILTERING
,sampler2D icdfSampler
#endif
)
{vec3 n=normalize(inputN);vec3 result=vec3(0.);
#ifndef IBL_CDF_FILTERING
vec3 tangent=abs(n.z)<0.999 ? vec3(0.,0.,1.) : vec3(1.,0.,0.);tangent=normalize(cross(tangent,n));vec3 bitangent=cross(n,tangent);mat3 tbn=mat3(tangent,bitangent,n);mat3 tbnInverse=mat3(tangent.x,bitangent.x,n.x,tangent.y,bitangent.y,n.y,tangent.z,bitangent.z,n.z);
#endif
float maxLevel=filteringInfo.y;float dim0=filteringInfo.x;float omegaP=(4.*PI)/(6.*dim0*dim0);vec3 clampedAlbedo=clamp(surfaceAlbedo,vec3(0.1),vec3(1.0));
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
for(uint i=0u; i<NUM_SAMPLES; ++i)
#else
for(int i=0; i<NUM_SAMPLES; ++i)
#endif
{vec2 Xi=hammersley(i,NUM_SAMPLES);
#if IBL_CDF_FILTERING
vec2 T;T.x=texture2D(icdfSampler,vec2(Xi.x,0.)).x;T.y=texture2D(icdfSampler,vec2(T.x,Xi.y)).y;vec3 Ls=uv_to_normal(vec2(1.0-fract(T.x+0.25),T.y));float NoL=dot(n,Ls);float NoV=dot(n,inputV);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
float LoV=dot (Ls,inputV);
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
vec3 H=(inputV+Ls)*0.5;float VoH=dot(inputV,H);
#endif
#else
vec3 Ls=hemisphereCosSample(Xi);Ls=normalize(Ls);float NoL=Ls.z; 
vec3 V=tbnInverse*inputV;float NoV=V.z; 
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
float LoV=dot (Ls,V);
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
vec3 H=(V+Ls)*0.5;float VoH=dot(V,H);
#endif
#endif
if (NoL>0.) {
#if IBL_CDF_FILTERING
float pdf=texture2D(icdfSampler,T).z;vec3 c=textureCubeLodEXT(inputTexture,Ls,0.).rgb;
#else
float pdf_inversed=PI/NoL;float omegaS=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;float l=log4(omegaS)-log4(omegaP)+log4(K);float mipLevel=clamp(l,0.,maxLevel);
#ifdef CUSTOM_IRRADIANCE_FILTERING_FUNCTION
CUSTOM_IRRADIANCE_FILTERING_FUNCTION
#else
vec3 c=textureCubeLodEXT(inputTexture,tbn*Ls,mipLevel).rgb;
#endif
#endif
#if GAMMA_INPUT
c=toLinearSpace(c);
#endif
vec3 diffuseRoughnessTerm=vec3(1.0);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
diffuseRoughnessTerm=diffuseBRDF_EON(clampedAlbedo,diffuseRoughness,NoL,NoV,LoV)*PI;
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
diffuseRoughnessTerm=vec3(diffuseBRDF_Burley(NoL,NoV,VoH,diffuseRoughness)*PI);
#endif
#if IBL_CDF_FILTERING
vec3 light=pdf<1e-6 ? vec3(0.0) : vec3(1.0)/vec3(pdf)*c;result+=NoL*diffuseRoughnessTerm*light;
#else
result+=c*diffuseRoughnessTerm;
#endif
}}
result=result*NUM_SAMPLES_FLOAT_INVERSED;
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
result=result/clampedAlbedo;
#endif
return result;}
#define inline
vec3 radiance(float alphaG,samplerCube inputTexture,vec3 inputN,vec2 filteringInfo)
{vec3 n=normalize(inputN);vec3 c=textureCube(inputTexture,n).rgb; 
if (alphaG==0.) {
#if GAMMA_INPUT
c=toLinearSpace(c);
#endif
return c;} else {vec3 result=vec3(0.);vec3 tangent=abs(n.z)<0.999 ? vec3(0.,0.,1.) : vec3(1.,0.,0.);tangent=normalize(cross(tangent,n));vec3 bitangent=cross(n,tangent);mat3 tbn=mat3(tangent,bitangent,n);float maxLevel=filteringInfo.y;float dim0=filteringInfo.x;float omegaP=(4.*PI)/(6.*dim0*dim0);float weight=0.;
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
for(uint i=0u; i<NUM_SAMPLES; ++i)
#else
for(int i=0; i<NUM_SAMPLES; ++i)
#endif
{vec2 Xi=hammersley(i,NUM_SAMPLES);vec3 H=hemisphereImportanceSampleDggx(Xi,alphaG);float NoV=1.;float NoH=H.z;float NoH2=H.z*H.z;float NoL=2.*NoH2-1.;vec3 L=vec3(2.*NoH*H.x,2.*NoH*H.y,NoL);L=normalize(L);if (NoL>0.) {float pdf_inversed=4./normalDistributionFunction_TrowbridgeReitzGGX(NoH,alphaG);float omegaS=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;float l=log4(omegaS)-log4(omegaP)+log4(K);float mipLevel=clamp(float(l),0.0,maxLevel);weight+=NoL;vec3 c=textureCubeLodEXT(inputTexture,tbn*L,mipLevel).rgb;
#if GAMMA_INPUT
c=toLinearSpace(c);
#endif
result+=c*NoL;}}
result=result/weight;return result;}}
#ifdef ANISOTROPIC
#define inline
vec3 radianceAnisotropic(
float alphaTangent, 
float alphaBitangent, 
samplerCube inputTexture,
vec3 inputView, 
vec3 inputTangent, 
vec3 inputBitangent, 
vec3 inputNormal, 
vec2 filteringInfo,
vec2 noiseInput 
)
{vec3 V=inputView;vec3 N=inputNormal;vec3 T=inputTangent;vec3 B=inputBitangent;vec3 R=reflect(-V,N);if (alphaTangent==0. && alphaBitangent==0.) {vec3 c=textureCube(inputTexture,R).rgb;
#if GAMMA_INPUT
c=toLinearSpace(c);
#endif
return c;}
vec3 result=vec3(0.);float maxLevel=filteringInfo.y;float dim0=filteringInfo.x;float effectiveDim=dim0*sqrt(alphaTangent*alphaBitangent);float omegaP=(4.*PI)/(6.*effectiveDim*effectiveDim);const float noiseScale=clamp(log2(float(NUM_SAMPLES))/12.0f,0.0f,1.0f);float weight=0.;
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
for(uint i=0u; i<NUM_SAMPLES; ++i)
#else
for(int i=0; i<NUM_SAMPLES; ++i)
#endif
{vec2 Xi=hammersley(i,NUM_SAMPLES);Xi=fract(Xi+noiseInput*mix(0.5f,0.015f,noiseScale)); 
vec3 H_tangent=hemisphereImportanceSampleDggxAnisotropic(Xi,alphaTangent,alphaBitangent);vec3 H=normalize(H_tangent.x*T+H_tangent.y*B+H_tangent.z*N);vec3 L=normalize(2.0*dot(V,H)*H-V);float NoH=max(dot(N,H),0.001);float VoH=max(dot(V,H),0.001);float NoL=max(dot(N,L),0.001);if (NoL>0.) {float pdf_inversed=4./normalDistributionFunction_BurleyGGX_Anisotropic(
H_tangent.z,H_tangent.x,H_tangent.y,vec2(alphaTangent,alphaBitangent)
);float omegaS=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;float l=log4(omegaS)-log4(omegaP)+log4(K);float mipLevel=clamp(float(l),0.0,maxLevel);weight+=NoL;vec3 c=textureCubeLodEXT(inputTexture,L,mipLevel).rgb;
#if GAMMA_INPUT
c=toLinearSpace(c);
#endif
result+=c*NoL;}}
result=result/weight;return result;}
#endif
#endif
#endif
`;b.ShaderStore.IncludesShadersStore[e]||(b.ShaderStore.IncludesShadersStore[e]=f),a.s([],254999)},492619,a=>{"use strict";var b=a.i(625562);let c="packingFunctions",d=`fn pack(depth: f32)->vec4f
{const bit_shift: vec4f= vec4f(255.0*255.0*255.0,255.0*255.0,255.0,1.0);const bit_mask: vec4f= vec4f(0.0,1.0/255.0,1.0/255.0,1.0/255.0);var res: vec4f=fract(depth*bit_shift);res-=res.xxyz*bit_mask;return res;}
fn unpack(color: vec4f)->f32
{const bit_shift: vec4f= vec4f(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);return dot(color,bit_shift);}`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["packingFunctionsWGSL",0,{name:c,shader:d}])},342602,(a,b,c)=>{"use strict";b.exports=a.r(918622)},187924,(a,b,c)=>{"use strict";b.exports=a.r(342602).vendored["react-ssr"].ReactJsxRuntime},572131,(a,b,c)=>{"use strict";b.exports=a.r(342602).vendored["react-ssr"].React},304396,a=>{"use strict";var b=a.i(503102),c=a.i(779438);let d="cachedOperationValue",e="cachedExecutionId";class f extends b.FlowGraphBlock{constructor(a,b){super(b),this.value=this.registerDataOutput("value",a),this.isValid=this.registerDataOutput("isValid",c.RichTypeBoolean)}_updateOutputs(a){let b=a._getExecutionVariable(this,e,-1),c=a._getExecutionVariable(this,d,null);if(null!=c&&b===a.executionId)this.isValid.setValue(!0,a),this.value.setValue(c,a);else try{let b=this._doOperation(a);if(null==b)return void this.isValid.setValue(!1,a);a._setExecutionVariable(this,d,b),a._setExecutionVariable(this,e,a.executionId),this.value.setValue(b,a),this.isValid.setValue(!0,a)}catch(b){this.isValid.setValue(!1,a)}}}a.s(["FlowGraphCachedOperationBlock",()=>f])},71870,a=>{"use strict";var b=a.i(304396);class c extends b.FlowGraphCachedOperationBlock{constructor(a,b,c,d,e){super(b,e),this._operation=c,this._className=d,this.a=this.registerDataInput("a",a)}_doOperation(a){return this._operation(this.a.getValue(a))}getClassName(){return this._className}}a.s(["FlowGraphUnaryOperationBlock",()=>c])},465679,a=>{"use strict";var b=a.i(304396);class c extends b.FlowGraphCachedOperationBlock{constructor(a,b,c,d,e,f){super(c,f),this._operation=d,this._className=e,this.a=this.registerDataInput("a",a),this.b=this.registerDataInput("b",b)}_doOperation(a){let b=this.a.getValue(a),c=this.b.getValue(a);return this._operation(b,c)}getClassName(){return this._className}}a.s(["FlowGraphBinaryOperationBlock",()=>c])},720414,a=>{"use strict";var b=a.i(625562);a.i(28439),a.i(20632);let c="lightsFragmentFunctions",d=`struct lightingInfo
{vec3 diffuse;
#ifdef SPECULARTERM
vec3 specular;
#endif
#ifdef NDOTL
float ndl;
#endif
};lightingInfo computeLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {lightingInfo result;vec3 lightVectorW;float attenuation=1.0;if (lightData.w==0.)
{vec3 direction=lightData.xyz-vPositionW;attenuation=max(0.,1.0-length(direction)/range);lightVectorW=normalize(direction);}
else
{lightVectorW=normalize(-lightData.xyz);}
float ndl=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
vec3 angleW=normalize(viewDirectionW+lightVectorW);float specComp=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
float getAttenuation(float cosAngle,float exponent) {return max(0.,pow(cosAngle,exponent));}
float getIESAttenuation(float cosAngle,sampler2D iesLightSampler) {float angle=acos(cosAngle)/PI;return texture2D(iesLightSampler,vec2(angle,0.)).r;}
lightingInfo basicSpotLighting(vec3 viewDirectionW,vec3 lightVectorW,vec3 vNormal,float attenuation,vec3 diffuseColor,vec3 specularColor,float glossiness) {lightingInfo result; 
float ndl=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
vec3 angleW=normalize(viewDirectionW+lightVectorW);float specComp=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
lightingInfo computeIESSpotLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec4 lightDirection,vec3 diffuseColor,vec3 specularColor,float range,float glossiness,sampler2D iesLightSampler) { 
vec3 direction=lightData.xyz-vPositionW;vec3 lightVectorW=normalize(direction);float attenuation=max(0.,1.0-length(direction)/range);float dotProduct=dot(lightDirection.xyz,-lightVectorW);float cosAngle=max(0.,dotProduct);if (cosAngle>=lightDirection.w)
{ 
attenuation*=getIESAttenuation(dotProduct,iesLightSampler);return basicSpotLighting(viewDirectionW,lightVectorW,vNormal,attenuation,diffuseColor,specularColor,glossiness);}
lightingInfo result;result.diffuse=vec3(0.);
#ifdef SPECULARTERM
result.specular=vec3(0.);
#endif
#ifdef NDOTL
result.ndl=0.;
#endif
return result;}
lightingInfo computeSpotLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec4 lightDirection,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {vec3 direction=lightData.xyz-vPositionW;vec3 lightVectorW=normalize(direction);float attenuation=max(0.,1.0-length(direction)/range);float cosAngle=max(0.,dot(lightDirection.xyz,-lightVectorW));if (cosAngle>=lightDirection.w)
{ 
attenuation*=getAttenuation(cosAngle,lightData.w);return basicSpotLighting(viewDirectionW,lightVectorW,vNormal,attenuation,diffuseColor,specularColor,glossiness);}
lightingInfo result;result.diffuse=vec3(0.);
#ifdef SPECULARTERM
result.specular=vec3(0.);
#endif
#ifdef NDOTL
result.ndl=0.;
#endif
return result;}
lightingInfo computeHemisphericLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,vec3 groundColor,float glossiness) {lightingInfo result;float ndl=dot(vNormal,lightData.xyz)*0.5+0.5;
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=mix(groundColor,diffuseColor,ndl);
#ifdef SPECULARTERM
vec3 angleW=normalize(viewDirectionW+lightData.xyz);float specComp=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor;
#endif
return result;}
#define inline
vec3 computeProjectionTextureDiffuseLighting(sampler2D projectionLightSampler,mat4 textureProjectionMatrix,vec3 posW){vec4 strq=textureProjectionMatrix*vec4(posW,1.0);strq/=strq.w;vec3 textureColor=texture2D(projectionLightSampler,strq.xy).rgb;return textureColor;}
#if defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
#include<ltcHelperFunctions>
uniform sampler2D areaLightsLTC1Sampler;uniform sampler2D areaLightsLTC2Sampler;
#define inline
lightingInfo computeAreaLighting(sampler2D ltc1,sampler2D ltc2,vec3 viewDirectionW,vec3 vNormal,vec3 vPosition,vec3 lightPosition,vec3 halfWidth,vec3 halfHeight,vec3 diffuseColor,vec3 specularColor,float roughness) 
{lightingInfo result;areaLightData data=computeAreaLightSpecularDiffuseFresnel(ltc1,ltc2,viewDirectionW,vNormal,vPosition,lightPosition,halfWidth,halfHeight,roughness);
#ifdef SPECULARTERM
vec3 fresnel=( specularColor*data.Fresnel.x+( vec3( 1.0 )-specularColor )*data.Fresnel.y );result.specular+=specularColor*fresnel*data.Specular;
#endif
result.diffuse+=diffuseColor*data.Diffuse;return result;}
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
#include<clusteredLightingFunctions>
#define inline
lightingInfo computeClusteredLighting(
sampler2D lightDataTexture,
sampler2D tileMaskTexture,
vec3 viewDirectionW,
vec3 vNormal,
vec4 lightData,
ivec2 sliceRange,
float glossiness
) {lightingInfo result;ivec2 tilePosition=ivec2(gl_FragCoord.xy*lightData.xy);int maskHeight=int(lightData.z);tilePosition.y=min(tilePosition.y,maskHeight-1);ivec2 batchRange=sliceRange/CLUSTLIGHT_BATCH;int batchOffset=batchRange.x*CLUSTLIGHT_BATCH;tilePosition.y+=maskHeight*batchRange.x;for (int i=batchRange.x; i<=batchRange.y; i+=1) {uint mask=uint(texelFetch(tileMaskTexture,tilePosition,0).r);tilePosition.y+=maskHeight;int maskOffset=max(sliceRange.x-batchOffset,0);int maskWidth=min(sliceRange.y-batchOffset+1,CLUSTLIGHT_BATCH);mask=extractBits(mask,maskOffset,maskWidth);while (mask != 0u) {uint bit=mask & -mask;mask ^= bit;int position=onlyBitPosition(bit);ClusteredLight light=getClusteredLight(lightDataTexture,batchOffset+maskOffset+position);lightingInfo info;if (light.vLightDirection.w<0.0) {info=computeLighting(viewDirectionW,vNormal,light.vLightData,light.vLightDiffuse.rgb,light.vLightSpecular.rgb,light.vLightDiffuse.a,glossiness);} else {info=computeSpotLighting(viewDirectionW,vNormal,light.vLightData,light.vLightDirection,light.vLightDiffuse.rgb,light.vLightSpecular.rgb,light.vLightDiffuse.a,glossiness);}
result.diffuse+=info.diffuse;
#ifdef SPECULARTERM
result.specular+=info.specular;
#endif
}
batchOffset+=CLUSTLIGHT_BATCH;}
return result;}
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s(["lightsFragmentFunctions",0,{name:c,shader:d}])},784075,a=>{"use strict";var b=a.i(625562);a.i(2524),a.i(680354);let c="lightsFragmentFunctions",d=`struct lightingInfo
{diffuse: vec3f,
#ifdef SPECULARTERM
specular: vec3f,
#endif
#ifdef NDOTL
ndl: f32,
#endif
};fn computeLighting(viewDirectionW: vec3f,vNormal: vec3f,lightData: vec4f,diffuseColor: vec3f,specularColor: vec3f,range: f32,glossiness: f32)->lightingInfo {var result: lightingInfo;var lightVectorW: vec3f;var attenuation: f32=1.0;if (lightData.w==0.)
{var direction: vec3f=lightData.xyz-fragmentInputs.vPositionW;attenuation=max(0.,1.0-length(direction)/range);lightVectorW=normalize(direction);}
else
{lightVectorW=normalize(-lightData.xyz);}
var ndl: f32=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
var angleW: vec3f=normalize(viewDirectionW+lightVectorW);var specComp: f32=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
fn getAttenuation(cosAngle: f32,exponent: f32)->f32 {return max(0.,pow(cosAngle,exponent));}
fn getIESAttenuation(cosAngle: f32,iesLightTexture: texture_2d<f32>,iesLightTextureSampler: sampler)->f32 {var angle=acos(cosAngle)/PI;return textureSampleLevel(iesLightTexture,iesLightTextureSampler,vec2f(angle,0),0.).r;}
fn computeBasicSpotLighting(viewDirectionW: vec3f,lightVectorW: vec3f,vNormal: vec3f,attenuation: f32,diffuseColor: vec3f,specularColor: vec3f,glossiness: f32)->lightingInfo {var result: lightingInfo;var ndl: f32=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
var angleW: vec3f=normalize(viewDirectionW+lightVectorW);var specComp: f32=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
fn computeIESSpotLighting(viewDirectionW: vec3f,vNormal: vec3f,lightData: vec4f,lightDirection: vec4f,diffuseColor: vec3f,specularColor: vec3f,range: f32,glossiness: f32,iesLightTexture: texture_2d<f32>,iesLightTextureSampler: sampler)->lightingInfo {var direction: vec3f=lightData.xyz-fragmentInputs.vPositionW;var lightVectorW: vec3f=normalize(direction);var attenuation: f32=max(0.,1.0-length(direction)/range);var dotProduct=dot(lightDirection.xyz,-lightVectorW);var cosAngle: f32=max(0.,dotProduct);if (cosAngle>=lightDirection.w)
{attenuation*=getIESAttenuation(dotProduct,iesLightTexture,iesLightTextureSampler);return computeBasicSpotLighting(viewDirectionW,lightVectorW,vNormal,attenuation,diffuseColor,specularColor,glossiness);}
var result: lightingInfo;result.diffuse=vec3f(0.);
#ifdef SPECULARTERM
result.specular=vec3f(0.);
#endif
#ifdef NDOTL
result.ndl=0.;
#endif
return result;}
fn computeSpotLighting(viewDirectionW: vec3f,vNormal: vec3f ,lightData: vec4f,lightDirection: vec4f,diffuseColor: vec3f,specularColor: vec3f,range: f32,glossiness: f32)->lightingInfo {var direction: vec3f=lightData.xyz-fragmentInputs.vPositionW;var lightVectorW: vec3f=normalize(direction);var attenuation: f32=max(0.,1.0-length(direction)/range);var cosAngle: f32=max(0.,dot(lightDirection.xyz,-lightVectorW));if (cosAngle>=lightDirection.w)
{attenuation*=getAttenuation(cosAngle,lightData.w);return computeBasicSpotLighting(viewDirectionW,lightVectorW,vNormal,attenuation,diffuseColor,specularColor,glossiness);}
var result: lightingInfo;result.diffuse=vec3f(0.);
#ifdef SPECULARTERM
result.specular=vec3f(0.);
#endif
#ifdef NDOTL
result.ndl=0.;
#endif
return result;}
fn computeHemisphericLighting(viewDirectionW: vec3f,vNormal: vec3f,lightData: vec4f,diffuseColor: vec3f,specularColor: vec3f,groundColor: vec3f,glossiness: f32)->lightingInfo {var result: lightingInfo;var ndl: f32=dot(vNormal,lightData.xyz)*0.5+0.5;
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=mix(groundColor,diffuseColor,ndl);
#ifdef SPECULARTERM
var angleW: vec3f=normalize(viewDirectionW+lightData.xyz);var specComp: f32=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor;
#endif
return result;}
fn computeProjectionTextureDiffuseLighting(projectionLightTexture: texture_2d<f32>,projectionLightSampler: sampler,textureProjectionMatrix: mat4x4f,posW: vec3f)->vec3f {var strq: vec4f=textureProjectionMatrix*vec4f(posW,1.0);strq/=strq.w;var textureColor: vec3f=textureSample(projectionLightTexture,projectionLightSampler,strq.xy).rgb;return textureColor;}
#if defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
#include<ltcHelperFunctions>
var areaLightsLTC1SamplerSampler: sampler;var areaLightsLTC1Sampler: texture_2d<f32>;var areaLightsLTC2SamplerSampler: sampler;var areaLightsLTC2Sampler: texture_2d<f32>;fn computeAreaLighting(ltc1: texture_2d<f32>,ltc1Sampler:sampler,ltc2:texture_2d<f32>,ltc2Sampler:sampler,viewDirectionW: vec3f,vNormal:vec3f,vPosition:vec3f,lightPosition:vec3f,halfWidth:vec3f, halfHeight:vec3f,diffuseColor:vec3f,specularColor:vec3f,roughness:f32 )->lightingInfo
{var result: lightingInfo;var data: areaLightData=computeAreaLightSpecularDiffuseFresnel(ltc1,ltc1Sampler,ltc2,ltc2Sampler,viewDirectionW,vNormal,vPosition,lightPosition,halfWidth,halfHeight,roughness);
#ifdef SPECULARTERM
var fresnel:vec3f=( specularColor*data.Fresnel.x+( vec3f( 1.0 )-specularColor )*data.Fresnel.y );result.specular+=specularColor*fresnel*data.Specular;
#endif
result.diffuse+=diffuseColor*data.Diffuse;return result;}
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
#include<clusteredLightingFunctions>
fn computeClusteredLighting(
lightDataTexture: texture_2d<f32>,
tileMaskBuffer: ptr<storage,array<u32>>,
viewDirectionW: vec3f,
vNormal: vec3f,
lightData: vec4f,
sliceRange: vec2u,
glossiness: f32
)->lightingInfo {var result: lightingInfo;let tilePosition=vec2u(fragmentInputs.position.xy*lightData.xy);let maskResolution=vec2u(lightData.zw);var tileIndex=(tilePosition.x*maskResolution.x+tilePosition.y)*maskResolution.y;let batchRange=sliceRange/CLUSTLIGHT_BATCH;var batchOffset=batchRange.x*CLUSTLIGHT_BATCH;tileIndex+=batchRange.x;for (var i=batchRange.x; i<=batchRange.y; i+=1) {var mask=tileMaskBuffer[tileIndex];tileIndex+=1;let maskOffset=max(sliceRange.x,batchOffset)-batchOffset; 
let maskWidth=min(sliceRange.y-batchOffset+1,CLUSTLIGHT_BATCH);mask=extractBits(mask,maskOffset,maskWidth);while mask != 0 {let trailing=firstTrailingBit(mask);mask ^= 1u<<trailing;let light=getClusteredLight(lightDataTexture,batchOffset+maskOffset+trailing);var info: lightingInfo;if light.vLightDirection.w<0.0 {info=computeLighting(viewDirectionW,vNormal,light.vLightData,light.vLightDiffuse.rgb,light.vLightSpecular.rgb,light.vLightDiffuse.a,glossiness);} else {info=computeSpotLighting(viewDirectionW,vNormal,light.vLightData,light.vLightDirection,light.vLightDiffuse.rgb,light.vLightSpecular.rgb,light.vLightDiffuse.a,glossiness);}
result.diffuse+=info.diffuse;
#ifdef SPECULARTERM
result.specular+=info.specular;
#endif
}
batchOffset+=CLUSTLIGHT_BATCH;}
return result;}
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["lightsFragmentFunctionsWGSL",0,{name:c,shader:d}])},815676,a=>{"use strict";var b=a.i(192305),c=a.i(776986),d=a.i(397197),e=a.i(664731),f=a.i(532186),g=a.i(392511),h=a.i(153857),i=a.i(880627);let j=null;async function k(){let b=f.EngineStore.LastCreatedEngine?.createCanvas(100,100)??new OffscreenCanvas(100,100);b instanceof OffscreenCanvas&&g.Logger.Warn("DumpData: OffscreenCanvas will be used for dumping data. This may result in lossy alpha values.");let{ThinEngine:d}=await a.A(508116);if(!d.IsSupported)throw Error("DumpData: No WebGL context available. Cannot dump data.");let e=new d(b,!1,{preserveDrawingBuffer:!0,depth:!1,stencil:!1,alpha:!0,premultipliedAlpha:!1,antialias:!1,failIfMajorPerformanceCaveat:!1});f.EngineStore.Instances.pop(),f.EngineStore.OnEnginesDisposedObservable.add(a=>{e&&a!==e&&!e.isDisposed&&0===f.EngineStore.Instances.length&&r()}),e.getCaps().parallelShaderCompile=void 0;let h=new c.EffectRenderer(e),{passPixelShader:i}=await a.A(389590),j=new c.EffectWrapper({engine:e,name:i.name,fragmentShader:i.shader,samplerNames:["textureSampler"]});return{canvas:b,dumpEngine:{engine:e,renderer:h,wrapper:j}}}async function l(){return j||(j=k()),await j}class m{static async EncodeImageAsync(a,b,c,e,f,g){let h=await l(),i=h.dumpEngine;i.engine.setSize(b,c,!0);let j=i.engine.createRawTexture(a,b,c,5,!1,!f,1);return i.renderer.setViewport(),i.renderer.applyEffectWrapper(i.wrapper),i.wrapper.effect._bindTexture("textureSampler",j),i.renderer.draw(),j.dispose(),await new Promise((a,b)=>{d.Tools.ToBlob(h.canvas,c=>{c?a(c):b(Error("EncodeImageAsync: Failed to convert canvas to blob."))},e,g)})}}(0,b.__decorate)([i.nativeOverride],m,"EncodeImageAsync",null);let n=m.EncodeImageAsync;async function o(a,b,c,d,e="image/png",f,g){let h=new Uint8Array((await c.readPixels(0,0,a,b)).buffer);q(a,b,h,d,e,f,!0,void 0,g)}async function p(a,b,c,f="image/png",i,j=!1,k=!1,l){if(c instanceof Float32Array){let a=new Uint8Array(c.length),b=c.length;for(;b--;){let d=c[b];a[b]=Math.round(255*(0,e.Clamp)(d))}c=a}let n=await m.EncodeImageAsync(c,a,b,f,j,l);void 0!==i&&d.Tools.DownloadBlob(n,i),n.type!==f&&g.Logger.Warn(`DumpData: The requested mimeType '${f}' is not supported. The result has mimeType '${n.type}' instead.`);let o=await n.arrayBuffer();return k?o:`data:${f};base64,${(0,h.EncodeArrayBufferToBase64)(o)}`}function q(a,b,c,d,e="image/png",f,g=!1,h=!1,i){void 0!==f||d||(f=""),p(a,b,c,e,f,g,h,i).then(a=>{d&&d(a)})}function r(){j&&(j?.then(a=>{a.canvas instanceof HTMLCanvasElement&&a.canvas.remove(),a.dumpEngine&&(a.dumpEngine.engine.dispose(),a.dumpEngine.renderer.dispose(),a.dumpEngine.wrapper.dispose())}),j=null)}d.Tools.DumpData=q,d.Tools.DumpDataAsync=p,d.Tools.DumpFramebuffer=o,a.s(["Dispose",()=>r,"DumpData",()=>q,"DumpDataAsync",()=>p,"DumpFramebuffer",()=>o,"DumpTools",0,{DumpData:q,DumpDataAsync:p,DumpFramebuffer:o,Dispose:r},"EncodeImageAsync",0,n])},583918,a=>{a.v("/_next/static/media/HavokPhysics.9647938c.wasm")},152850,a=>{"use strict";var b=a.i(625562);let c="oitBackBlendPixelShader",d=`precision highp float;uniform sampler2D uBackColor;void main() {glFragColor=texelFetch(uBackColor,ivec2(gl_FragCoord.xy),0);if (glFragColor.a==0.0) { 
discard;}}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["oitBackBlendPixelShader",0,{name:c,shader:d}])},122084,a=>{"use strict";var b=a.i(625562);let c="shadowMapFragmentSoftTransparentShadow",d=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alpha) discard;
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s(["shadowMapFragmentSoftTransparentShadow",0,{name:c,shader:d}])},780471,a=>{"use strict";var b=a.i(625562);let c="filterPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform mat4 kernelMatrix;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec3 baseColor=texture2D(textureSampler,vUV).rgb;vec3 updatedColor=(kernelMatrix*vec4(baseColor,1.0)).rgb;gl_FragColor=vec4(updatedColor,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["filterPixelShader",0,{name:c,shader:d}])},66629,a=>{"use strict";var b=a.i(625562);let c="lightProxyPixelShader",d=`flat varying vec2 vLimits;flat varying highp uint vMask;void main(void) {if (gl_FragCoord.y<vLimits.x || gl_FragCoord.y>vLimits.y) {discard;}
gl_FragColor=vec4(vMask,0,0,1);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["lightProxyPixelShader",0,{name:c,shader:d}])},993515,a=>{"use strict";var b=a.i(625562);let c="oitBackBlendPixelShader",d=`var uBackColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureLoad(uBackColor,vec2i(fragmentInputs.position.xy),0);if (fragmentOutputs.color.a==0.0) {discard;}}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["oitBackBlendPixelShaderWGSL",0,{name:c,shader:d}])},827066,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererMaskerPixelShader",d=`varying vec2 vUV;void main(void) {gl_FragColor=vec4(1.0,1.0,1.0,1.0);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["meshUVSpaceRendererMaskerPixelShader",0,{name:c,shader:d}])},473633,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererMaskerPixelShader",d=`varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color= vec4f(1.0,1.0,1.0,1.0);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["meshUVSpaceRendererMaskerPixelShaderWGSL",0,{name:c,shader:d}])},474190,a=>{"use strict";var b=a.i(625562);let c="displayPassPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D passSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(passSampler,vUV);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["displayPassPixelShader",0,{name:c,shader:d}])},927092,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererMaskerVertexShader",d="attribute vec2 uv;varying vec2 vUV;void main(void) {gl_Position=vec4(vec2(uv.x,uv.y)*2.0-1.0,0.,1.0);vUV=uv;}";b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["meshUVSpaceRendererMaskerVertexShader",0,{name:c,shader:d}])},194098,a=>{"use strict";var b=a.i(625562);let c="passPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["passPixelShader",0,{name:c,shader:d}])},983768,a=>{"use strict";var b=a.i(625562);let c="proceduralVertexShader",d=`attribute position: vec2f;varying vPosition: vec2f;varying vUV: vec2f;const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vPosition=input.position;vertexOutputs.vUV=input.position*madd+madd;vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["proceduralVertexShaderWGSL",0,{name:c,shader:d}])},413237,a=>{"use strict";var b=a.i(625562);let c="hdrIrradianceFilteringVertexShader",d=`attribute vec2 position;varying vec3 direction;uniform vec3 up;uniform vec3 right;uniform vec3 front;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
mat3 view=mat3(up,right,front);direction=view*vec3(position,1.0);gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["hdrIrradianceFilteringVertexShader",0,{name:c,shader:d}])},426087,a=>{"use strict";var b=a.i(625562);let c="iblVoxelSlabDebugVertexShader",d="attribute vec3 position;varying vec3 vNormalizedPosition;uniform mat4 world;uniform mat4 invWorldScale;uniform mat4 cameraViewMatrix;uniform mat4 projection;uniform mat4 viewMatrix;void main(void) {vec4 worldPosition=(world*vec4(position,1.));gl_Position=projection*cameraViewMatrix*worldPosition;vNormalizedPosition=(viewMatrix*invWorldScale*worldPosition).rgb;vNormalizedPosition.xyz=vNormalizedPosition.xyz*vec3(0.5)+vec3(0.5);}";b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblVoxelSlabDebugVertexShader",0,{name:c,shader:d}])},865248,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererPixelShader",d=`precision highp float;varying vec2 vDecalTC;uniform sampler2D textureSampler;void main(void) {if (vDecalTC.x<0. || vDecalTC.x>1. || vDecalTC.y<0. || vDecalTC.y>1.) {discard;}
gl_FragColor=texture2D(textureSampler,vDecalTC);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["meshUVSpaceRendererPixelShader",0,{name:c,shader:d}])},779292,a=>{"use strict";var b=a.i(625562);let c="shadowMapFragmentSoftTransparentShadow",d=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alpha) {discard;}
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["shadowMapFragmentSoftTransparentShadowWGSL",0,{name:c,shader:d}])},402661,a=>{"use strict";var b=a.i(625562);let c="boundingBoxRendererPixelShader",d=`uniform color: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["boundingBoxRendererPixelShaderWGSL",0,{name:c,shader:d}])},420911,a=>{"use strict";var b=a.i(625562);let c="passPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["passPixelShaderWGSL",0,{name:c,shader:d}])},898718,a=>{"use strict";var b=a.i(625562);let c="iblCdfxPixelShader",d=`precision highp sampler2D;
#define PI 3.1415927
varying vec2 vUV;uniform sampler2D cdfy;void main(void) {ivec2 cdfyRes=textureSize(cdfy,0);ivec2 currentPixel=ivec2(gl_FragCoord.xy);float cdfx=0.0;for (int x=1; x<=currentPixel.x; x++) {cdfx+=texelFetch(cdfy,ivec2(x-1,cdfyRes.y-1),0).x;}
gl_FragColor=vec4(vec3(cdfx),1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblCdfxPixelShader",0,{name:c,shader:d}])},126893,a=>{"use strict";var b=a.i(625562);let c="glowMapMergeVertexShader",d=`attribute position: vec2f;varying vUV: vec2f;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vUV=input.position*madd+madd;vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["glowMapMergeVertexShaderWGSL",0,{name:c,shader:d}])},497530,a=>{"use strict";var b=a.i(625562);let c="glowMapMergeVertexShader",d=`attribute vec2 position;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=position*madd+madd;gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["glowMapMergeVertexShader",0,{name:c,shader:d}])},376978,a=>{"use strict";var b=a.i(625562);let c="ssaoCombinePixelShader",d=`uniform sampler2D textureSampler;uniform sampler2D originalColor;uniform vec4 viewport;varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec2 uv=viewport.xy+vUV*viewport.zw;vec4 ssaoColor=texture2D(textureSampler,uv);vec4 sceneColor=texture2D(originalColor,uv);gl_FragColor=sceneColor*ssaoColor;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["ssaoCombinePixelShader",0,{name:c,shader:d}])},440772,a=>{"use strict";var b=a.i(625562);let c="anaglyphPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D leftSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 leftFrag=texture2D(leftSampler,vUV);leftFrag=vec4(1.0,leftFrag.g,leftFrag.b,1.0);vec4 rightFrag=texture2D(textureSampler,vUV);rightFrag=vec4(rightFrag.r,1.0,1.0,1.0);gl_FragColor=vec4(rightFrag.rgb*leftFrag.rgb,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["anaglyphPixelShader",0,{name:c,shader:d}])},501999,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererMaskerVertexShader",d=`attribute uv: vec2f;varying vUV: vec2f;@vertex
fn main(input : VertexInputs)->FragmentInputs {vertexOutputs.position= vec4f( vec2f(input.uv.x,input.uv.y)*2.0-1.0,0.,1.0);vertexOutputs.vUV=input.uv;}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["meshUVSpaceRendererMaskerVertexShaderWGSL",0,{name:c,shader:d}])},980675,a=>{"use strict";var b=a.i(625562);let c="lodPixelShader",d=`const GammaEncodePowerApprox=1.0/2.2;varying vUV: vec2f;var textureSampler: texture_2d<f32>;uniform lod: f32;uniform gamma: i32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let textureSize=textureDimensions(textureSampler);fragmentOutputs.color=textureLoad(textureSampler,vec2u(fragmentInputs.vUV*vec2f(textureSize)),u32(uniforms.lod));if (uniforms.gamma==0) {fragmentOutputs.color=vec4f(pow(fragmentOutputs.color.rgb,vec3f(GammaEncodePowerApprox)),fragmentOutputs.color.a);}}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["lodPixelShaderWGSL",0,{name:c,shader:d}])},40439,a=>{"use strict";var b=a.i(625562);let c="lodPixelShader",d=`precision highp float;const float GammaEncodePowerApprox=1.0/2.2;varying vec2 vUV;uniform sampler2D textureSampler;uniform float lod;uniform vec2 texSize;uniform int gamma;void main(void)
{ivec2 textureDimensions=textureSize(textureSampler,0);gl_FragColor=texelFetch(textureSampler,ivec2(vUV*vec2(textureDimensions)),int(lod));if (gamma==0) {gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(GammaEncodePowerApprox));}}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["lodPixelShader",0,{name:c,shader:d}])},410561,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleDiffusePixelShader",d=`uniform particleAlpha: f32;varying uv: vec2f;varying diffuseColor: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normalxy: vec2f=input.uv*2.0-1.0;var r2: f32=dot(normalxy,normalxy);if (r2>1.0) {discard;}
fragmentOutputs.color=vec4f(input.diffuseColor,1.0);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingParticleDiffusePixelShaderWGSL",0,{name:c,shader:d}])},471566,a=>{"use strict";var b=a.i(625562);let c="copyTexture3DLayerToTexturePixelShader",d=`var textureSampler: texture_3d<f32>;uniform layerNum: i32;varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let coord=vec3f(vec2f(input.vUV.x,input.vUV.y)*vec2f(textureDimensions(textureSampler,0).xy),f32(uniforms.layerNum));let color=textureLoad(textureSampler,vec3i(coord),0).rgb;fragmentOutputs.color= vec4f(color,1);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["copyTexture3DLayerToTexturePixelShaderWGSL",0,{name:c,shader:d}])},375781,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="rgbdDecodePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["rgbdDecodePixelShaderWGSL",0,{name:c,shader:d}])},631378,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleDiffusePixelShader",d=`uniform float particleAlpha;varying vec2 uv;varying vec3 diffuseColor;void main(void) {vec3 normal;normal.xy=uv*2.0-1.0;float r2=dot(normal.xy,normal.xy);if (r2>1.0) discard;glFragColor=vec4(diffuseColor,1.0);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingParticleDiffusePixelShader",0,{name:c,shader:d}])},484480,a=>{"use strict";var b=a.i(625562);let c="layerVertexShader",d=`attribute vec2 position;uniform vec2 scale;uniform vec2 offset;uniform mat4 textureMatrix;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vec2 shiftedPosition=position*scale+offset;vUV=vec2(textureMatrix*vec4(shiftedPosition*madd+madd,1.0,0.0));gl_Position=vec4(shiftedPosition,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["layerVertexShader",0,{name:c,shader:d}])},342361,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="rgbdEncodePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["rgbdEncodePixelShaderWGSL",0,{name:c,shader:d}])},523882,a=>{"use strict";var b=a.i(625562);let c="depthBoxBlurPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 colorDepth=vec4(0.0);for (int x=-OFFSET; x<=OFFSET; x++)
for (int y=-OFFSET; y<=OFFSET; y++)
colorDepth+=texture2D(textureSampler,vUV+vec2(x,y)/screenSize);gl_FragColor=(colorDepth/float((OFFSET*2+1)*(OFFSET*2+1)));}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["depthBoxBlurPixelShader",0,{name:c,shader:d}])},692371,a=>{"use strict";var b=a.i(625562);let c="lightProxyPixelShader",d=`flat varying vOffset: u32;flat varying vMask: u32;uniform tileMaskResolution: vec3f;var<storage,read_write> tileMaskBuffer: array<atomic<u32>>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let maskResolution=vec2u(uniforms.tileMaskResolution.yz);let tilePosition=vec2u(fragmentInputs.position.xy);let tileIndex=(tilePosition.x*maskResolution.x+tilePosition.y)*maskResolution.y+fragmentInputs.vOffset;atomicOr(&tileMaskBuffer[tileIndex],fragmentInputs.vMask);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["lightProxyPixelShaderWGSL",0,{name:c,shader:d}])},818541,a=>{"use strict";var b=a.i(625562);let c="iblCdfxPixelShader",d=`#define PI 3.1415927
varying vUV: vec2f;var cdfy: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var cdfyRes=textureDimensions(cdfy,0);var currentPixel=vec2u(fragmentInputs.position.xy);var cdfx: f32=0.0;for (var x: u32=1; x<=currentPixel.x; x++) {cdfx+=textureLoad(cdfy, vec2u(x-1,cdfyRes.y-1),0).x;}
fragmentOutputs.color= vec4f( vec3f(cdfx),1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblCdfxPixelShaderWGSL",0,{name:c,shader:d}])},82698,a=>{"use strict";var b=a.i(625562);let c="lensFlarePixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec4 color;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec4 baseColor=texture2D(textureSampler,vUV);gl_FragColor=baseColor*color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["lensFlarePixelShader",0,{name:c,shader:d}])},479605,a=>{"use strict";var b=a.i(625562);let c="filterPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform kernelMatrix: mat4x4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var baseColor: vec3f=textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb;var updatedColor: vec3f=(uniforms.kernelMatrix* vec4f(baseColor,1.0)).rgb;fragmentOutputs.color= vec4f(updatedColor,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["filterPixelShaderWGSL",0,{name:c,shader:d}])},987538,a=>{"use strict";var b=a.i(625562);let c="bloomMergePixelShader",d=`uniform sampler2D textureSampler;uniform sampler2D bloomBlur;varying vec2 vUV;uniform float bloomWeight;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(textureSampler,vUV);vec3 blurred=texture2D(bloomBlur,vUV).rgb;gl_FragColor.rgb=gl_FragColor.rgb+(blurred.rgb*bloomWeight); }
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["bloomMergePixelShader",0,{name:c,shader:d}])},573496,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="extractHighlightsPixelShader",d=`#include<helperFunctions>
varying vec2 vUV;uniform sampler2D textureSampler;uniform float threshold;uniform float exposure;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);float luma=dot(LuminanceEncodeApprox,gl_FragColor.rgb*exposure);gl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["extractHighlightsPixelShader",0,{name:c,shader:d}])},907483,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleThicknessVertexShader",d=`attribute vec3 position;attribute vec2 offset;uniform mat4 view;uniform mat4 projection;uniform vec2 size;varying vec2 uv;void main(void) {vec3 cornerPos;cornerPos.xy=vec2(offset.x-0.5,offset.y-0.5)*size;cornerPos.z=0.0;vec3 viewPos=(view*vec4(position,1.0)).xyz+cornerPos;gl_Position=projection*vec4(viewPos,1.0);uv=offset;}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingParticleThicknessVertexShader",0,{name:c,shader:d}])},52783,a=>{"use strict";var b=a.i(625562);let c="highlightsPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;const RGBLuminanceCoefficients: vec3f= vec3f(0.2126,0.7152,0.0722);
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var tex: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);var c: vec3f=tex.rgb;var luma: f32=dot(c.rgb,RGBLuminanceCoefficients);fragmentOutputs.color= vec4f(pow(c, vec3f(25.0-luma*15.0)),tex.a); }`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["highlightsPixelShaderWGSL",0,{name:c,shader:d}])},961276,a=>{"use strict";var b=a.i(625562);let c="hdrFilteringVertexShader",d=`attribute position: vec2f;varying direction: vec3f;uniform up: vec3f;uniform right: vec3f;uniform front: vec3f;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var view: mat3x3f= mat3x3f(uniforms.up,uniforms.right,uniforms.front);vertexOutputs.direction=view*vec3f(input.position,1.0);vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["hdrFilteringVertexShaderWGSL",0,{name:c,shader:d}])},805392,a=>{"use strict";var b=a.i(625562);let c="displayPassPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var passSamplerSampler: sampler;var passSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(passSampler,passSamplerSampler,input.vUV);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["displayPassPixelShaderWGSL",0,{name:c,shader:d}])},706959,a=>{"use strict";var b=a.i(625562);let c="postprocessVertexShader",d=`attribute position: vec2<f32>;uniform scale: vec2<f32>;varying vUV: vec2<f32>;const madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vUV=(vertexInputs.position*madd+madd)*uniforms.scale;vertexOutputs.position=vec4(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["postprocessVertexShaderWGSL",0,{name:c,shader:d}])},959495,a=>{"use strict";var b=a.i(625562);let c="highlightsPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;const vec3 RGBLuminanceCoefficients=vec3(0.2126,0.7152,0.0722);
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{vec4 tex=texture2D(textureSampler,vUV);vec3 c=tex.rgb;float luma=dot(c.rgb,RGBLuminanceCoefficients);gl_FragColor=vec4(pow(c,vec3(25.0-luma*15.0)),tex.a); }`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["highlightsPixelShader",0,{name:c,shader:d}])},532690,a=>{"use strict";var b=a.i(625562);let c="hdrFilteringVertexShader",d=`attribute vec2 position;varying vec3 direction;uniform vec3 up;uniform vec3 right;uniform vec3 front;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
mat3 view=mat3(up,right,front);direction=view*vec3(position,1.0);gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["hdrFilteringVertexShader",0,{name:c,shader:d}])},738500,a=>{"use strict";var b=a.i(625562);let c="proceduralVertexShader",d=`attribute vec2 position;varying vec2 vPosition;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vPosition=position;vUV=position*madd+madd;gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["proceduralVertexShader",0,{name:c,shader:d}])},410140,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="rgbdEncodePixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["rgbdEncodePixelShader",0,{name:c,shader:d}])},207279,a=>{"use strict";var b=a.i(625562);let c="blackAndWhitePixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform float degree;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{vec3 color=texture2D(textureSampler,vUV).rgb;float luminance=dot(color,vec3(0.3,0.59,0.11)); 
vec3 blackAndWhite=vec3(luminance,luminance,luminance);gl_FragColor=vec4(color-((color-blackAndWhite)*degree),1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["blackAndWhitePixelShader",0,{name:c,shader:d}])},515273,a=>{"use strict";var b=a.i(625562);let c="oitFinalPixelShader",d=`var uFrontColor: texture_2d<f32>;var uBackColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var frontColor: vec4f=textureLoad(uFrontColor,fragCoord,0);var backColor: vec4f=textureLoad(uBackColor,fragCoord,0);var alphaMultiplier: f32=1.0-frontColor.a;fragmentOutputs.color=vec4f(
frontColor.rgb+alphaMultiplier*backColor.rgb,
frontColor.a+backColor.a
);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["oitFinalPixelShaderWGSL",0,{name:c,shader:d}])},923332,a=>{"use strict";var b=a.i(625562);let c="pickingPixelShader",d=`#if defined(INSTANCES)
flat varying vMeshID: f32;
#else
uniform meshID: f32;
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var id: i32;
#if defined(INSTANCES)
id=i32(input.vMeshID);
#else
id=i32(uniforms.meshID);
#endif
var color=vec3f(
f32((id>>16) & 0xFF),
f32((id>>8) & 0xFF),
f32(id & 0xFF),
)/255.0;fragmentOutputs.color=vec4f(color,1.0);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["pickingPixelShaderWGSL",0,{name:c,shader:d}])},360861,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="rgbdDecodePixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["rgbdDecodePixelShader",0,{name:c,shader:d}])},985636,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererFinaliserVertexShader",d=`attribute position: vec3f;attribute uv: vec2f;uniform worldViewProjection: mat4x4f;varying vUV: vec2f;@vertex
fn main(input : VertexInputs)->FragmentInputs {vertexOutputs.position=uniforms.worldViewProjection* vec4f(input.position,1.0);vertexOutputs.positionvUV=input.uv;}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["meshUVSpaceRendererFinaliserVertexShaderWGSL",0,{name:c,shader:d}])},713750,a=>{"use strict";var b=a.i(625562);let c="lensFlareVertexShader",d=`attribute position: vec2f;uniform viewportMatrix: mat4x4f;varying vUV: vec2f;const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vUV=input.position*madd+madd;vertexOutputs.position=uniforms.viewportMatrix* vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["lensFlareVertexShaderWGSL",0,{name:c,shader:d}])},353441,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererFinaliserVertexShader",d=`precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec2 vUV;void main() {gl_Position=worldViewProjection*vec4(position,1.0);vUV=uv;}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["meshUVSpaceRendererFinaliserVertexShader",0,{name:c,shader:d}])},155448,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleThicknessPixelShader",d=`uniform float particleAlpha;varying vec2 uv;void main(void) {vec3 normal;normal.xy=uv*2.0-1.0;float r2=dot(normal.xy,normal.xy);if (r2>1.0) discard;float thickness=sqrt(1.0-r2);glFragColor=vec4(vec3(particleAlpha*thickness),1.0);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingParticleThicknessPixelShader",0,{name:c,shader:d}])},352577,a=>{"use strict";var b=a.i(625562);let c="oitFinalPixelShader",d=`precision highp float;uniform sampler2D uFrontColor;uniform sampler2D uBackColor;void main() {ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec4 frontColor=texelFetch(uFrontColor,fragCoord,0);vec4 backColor=texelFetch(uBackColor,fragCoord,0);float alphaMultiplier=1.0-frontColor.a;glFragColor=vec4(
frontColor.rgb+alphaMultiplier*backColor.rgb,
frontColor.a+backColor.a
);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["oitFinalPixelShader",0,{name:c,shader:d}])},591297,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererPixelShader",d=`varying vDecalTC: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {if (input.vDecalTC.x<0. || input.vDecalTC.x>1. || input.vDecalTC.y<0. || input.vDecalTC.y>1.) {discard;}
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vDecalTC);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["meshUVSpaceRendererPixelShaderWGSL",0,{name:c,shader:d}])},659381,a=>{"use strict";var b=a.i(625562);let c="lensFlarePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform color: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
var baseColor: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);fragmentOutputs.color=baseColor*uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["lensFlarePixelShaderWGSL",0,{name:c,shader:d}])},974811,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleThicknessPixelShader",d=`uniform particleAlpha: f32;varying uv: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normalxy: vec2f=input.uv*2.0-1.0;var r2: f32=dot(normalxy,normalxy);if (r2>1.0) {discard;}
var thickness: f32=sqrt(1.0-r2);fragmentOutputs.color=vec4f(vec3f(uniforms.particleAlpha*thickness),1.0);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingParticleThicknessPixelShaderWGSL",0,{name:c,shader:d}])},616035,a=>{"use strict";var b=a.i(625562);let c="lensFlareVertexShader",d=`attribute vec2 position;uniform mat4 viewportMatrix;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=position*madd+madd;gl_Position=viewportMatrix*vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["lensFlareVertexShader",0,{name:c,shader:d}])},319270,a=>{"use strict";var b=a.i(625562);let c="copyTexture3DLayerToTexturePixelShader",d=`precision highp sampler3D;uniform sampler3D textureSampler;uniform int layerNum;varying vec2 vUV;void main(void) {vec3 coord=vec3(0.0,0.0,float(layerNum));coord.xy=vec2(vUV.x,vUV.y)*vec2(textureSize(textureSampler,0).xy);vec3 color=texelFetch(textureSampler,ivec3(coord),0).rgb;gl_FragColor=vec4(color,1);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["copyTexture3DLayerToTexturePixelShader",0,{name:c,shader:d}])},149535,a=>{"use strict";var b=a.i(625562);let c="iblVoxelSlabDebugPixelShader",d=`varying vNormalizedPosition: vec3f;uniform nearPlane: f32;uniform farPlane: f32;uniform stepSize: f32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normPos: vec3f=input.vNormalizedPosition.xyz;var chunkSize: f32=uniforms.stepSize* f32(MAX_DRAW_BUFFERS);var numChunks: f32=1.0/chunkSize;var positionInChunk: f32=fract(normPos.z/chunkSize);var slab: f32=floor(positionInChunk* f32(MAX_DRAW_BUFFERS)) /
f32(MAX_DRAW_BUFFERS);if (normPos.x<0.0 || normPos.y<0.0 || normPos.z<0.0 ||
normPos.x>1.0 || normPos.y>1.0 || normPos.z>1.0) {fragmentOutputs.color= vec4f(0.0,0.0,0.0,0.0);} else {fragmentOutputs.color= vec4f(slab,0.0,0.0,0.75);}}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblVoxelSlabDebugPixelShaderWGSL",0,{name:c,shader:d}])},321371,a=>{"use strict";var b=a.i(625562);a.i(196025),a.i(463068),a.i(850492);let c="imageProcessingPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);result=vec4f(max(result.rgb,vec3f(0.)),result.a);
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result=vec4f(toLinearSpaceVec3(result.rgb),result.a);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
fragmentOutputs.color=result;}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["imageProcessingPixelShaderWGSL",0,{name:c,shader:d}])},530527,a=>{"use strict";var b=a.i(625562);let c="fxaaVertexShader",d=`attribute vec2 position;uniform vec2 texelSize;varying vec2 vUV;varying vec2 sampleCoordS;varying vec2 sampleCoordE;varying vec2 sampleCoordN;varying vec2 sampleCoordW;varying vec2 sampleCoordNW;varying vec2 sampleCoordSE;varying vec2 sampleCoordNE;varying vec2 sampleCoordSW;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=(position*madd+madd);sampleCoordS=vUV+vec2( 0.0,1.0)*texelSize;sampleCoordE=vUV+vec2( 1.0,0.0)*texelSize;sampleCoordN=vUV+vec2( 0.0,-1.0)*texelSize;sampleCoordW=vUV+vec2(-1.0,0.0)*texelSize;sampleCoordNW=vUV+vec2(-1.0,-1.0)*texelSize;sampleCoordSE=vUV+vec2( 1.0,1.0)*texelSize;sampleCoordNE=vUV+vec2( 1.0,-1.0)*texelSize;sampleCoordSW=vUV+vec2(-1.0,1.0)*texelSize;gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fxaaVertexShader",0,{name:c,shader:d}])},134034,a=>{"use strict";var b=a.i(625562);a.i(681682),a.i(544248),a.i(874402),a.i(430783);let c="outlinePixelShader",d=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform vec4 color;
#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#include<logDepthFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["outlinePixelShader",0,{name:c,shader:d}])},304906,a=>{"use strict";var b=a.i(625562);let c="depthBoxBlurPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var colorDepth: vec4f=vec4f(0.0);for (var x: i32=-OFFSET; x<=OFFSET; x++) {for (var y: i32=-OFFSET; y<=OFFSET; y++) {colorDepth+=textureSample(textureSampler,textureSamplerSampler,input.vUV+ vec2f(f32(x),f32(y))/uniforms.screenSize);}}
fragmentOutputs.color=(colorDepth/ f32((OFFSET*2+1)*(OFFSET*2+1)));}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["depthBoxBlurPixelShaderWGSL",0,{name:c,shader:d}])},505262,a=>{"use strict";var b=a.i(625562);let c="anaglyphPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var leftSamplerSampler: sampler;var leftSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var leftFrag: vec4f=textureSample(leftSampler,leftSamplerSampler,input.vUV);leftFrag= vec4f(1.0,leftFrag.g,leftFrag.b,1.0);var rightFrag: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);rightFrag= vec4f(rightFrag.r,1.0,1.0,1.0);fragmentOutputs.color= vec4f(rightFrag.rgb*leftFrag.rgb,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["anaglyphPixelShaderWGSL",0,{name:c,shader:d}])},969894,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleDepthVertexShader",d=`attribute position: vec3f;attribute offset: vec2f;uniform view: mat4x4f;uniform projection: mat4x4f;uniform size: vec2f;varying uv: vec2f;varying viewPos: vec3f;varying sphereRadius: f32;
#ifdef FLUIDRENDERING_VELOCITY
attribute velocity: vec3f;varying velocityNorm: f32;
#endif
@vertex
fn main(input: VertexInputs)->FragmentInputs {var cornerPos: vec3f=vec3f(
vec2f(input.offset.x-0.5,input.offset.y-0.5)*uniforms.size,
0.0
);vertexOutputs.viewPos=(uniforms.view*vec4f(input.position,1.0)).xyz;vertexOutputs.position=uniforms.projection*vec4f(vertexOutputs.viewPos+cornerPos,1.0);vertexOutputs.uv=input.offset;vertexOutputs.sphereRadius=uniforms.size.x/2.0;
#ifdef FLUIDRENDERING_VELOCITY
vertexOutputs.velocityNorm=length(velocity);
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingParticleDepthVertexShaderWGSL",0,{name:c,shader:d}])},927229,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="iblCdfyPixelShader",d=`precision highp sampler2D;precision highp samplerCube;
#include<helperFunctions>
#define PI 3.1415927
varying vec2 vUV;
#ifdef IBL_USE_CUBE_MAP
uniform samplerCube iblSource;
#else
uniform sampler2D iblSource;
#endif
uniform int iblHeight;
#ifdef IBL_USE_CUBE_MAP
float fetchCube(vec2 uv) {vec3 direction=equirectangularToCubemapDirection(uv);return sin(PI*uv.y)*dot(textureCubeLodEXT(iblSource,direction,0.0).rgb,LuminanceEncodeApprox);}
#else
float fetchPanoramic(ivec2 Coords,float envmapHeight) {return sin(PI*(float(Coords.y)+0.5)/envmapHeight) *
dot(texelFetch(iblSource,Coords,0).rgb,LuminanceEncodeApprox);}
#endif
void main(void) {ivec2 coords=ivec2(gl_FragCoord.x,gl_FragCoord.y);float cdfy=0.0;for (int y=1; y<=coords.y; y++) {
#ifdef IBL_USE_CUBE_MAP
vec2 uv=vec2(vUV.x,(float(y-1)+0.5)/float(iblHeight));cdfy+=fetchCube(uv);
#else
cdfy+=fetchPanoramic(ivec2(coords.x,y-1),float(iblHeight));
#endif
}
gl_FragColor=vec4(cdfy,0.0,0.0,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblCdfyPixelShader",0,{name:c,shader:d}])},211533,a=>{"use strict";var b=a.i(625562);let c="iblGenerateVoxelMipPixelShader",d=`precision highp float;precision highp sampler3D;varying vec2 vUV;uniform sampler3D srcMip;uniform int layerNum;void main(void) {ivec3 Coords=ivec3(2)*ivec3(gl_FragCoord.x,gl_FragCoord.y,layerNum);uint tex =
uint(texelFetch(srcMip,Coords+ivec3(0,0,0),0).x>0.0f ? 1u : 0u)
<< 0u |
uint(texelFetch(srcMip,Coords+ivec3(1,0,0),0).x>0.0f ? 1u : 0u)
<< 1u |
uint(texelFetch(srcMip,Coords+ivec3(0,1,0),0).x>0.0f ? 1u : 0u)
<< 2u |
uint(texelFetch(srcMip,Coords+ivec3(1,1,0),0).x>0.0f ? 1u : 0u)
<< 3u |
uint(texelFetch(srcMip,Coords+ivec3(0,0,1),0).x>0.0f ? 1u : 0u)
<< 4u |
uint(texelFetch(srcMip,Coords+ivec3(1,0,1),0).x>0.0f ? 1u : 0u)
<< 5u |
uint(texelFetch(srcMip,Coords+ivec3(0,1,1),0).x>0.0f ? 1u : 0u)
<< 6u |
uint(texelFetch(srcMip,Coords+ivec3(1,1,1),0).x>0.0f ? 1u : 0u)
<< 7u;glFragColor.rgb=vec3(float(tex)/255.0f,0.0f,0.0f);glFragColor.a=1.0;}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblGenerateVoxelMipPixelShader",0,{name:c,shader:d}])},374901,a=>{"use strict";var b=a.i(625562);let c="bloomMergePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var bloomBlurSampler: sampler;var bloomBlur: texture_2d<f32>;uniform bloomWeight: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);var blurred: vec3f=textureSample(bloomBlur,bloomBlurSampler,input.vUV).rgb;fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb+(blurred.rgb*uniforms.bloomWeight),fragmentOutputs.color.a);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["bloomMergePixelShaderWGSL",0,{name:c,shader:d}])},762799,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="copyTextureToTexturePixelShader",d=`uniform float conversion;uniform sampler2D textureSampler;uniform float lodLevel;varying vec2 vUV;
#include<helperFunctions>
void main(void) 
{
#ifdef NO_SAMPLER
vec4 color=texelFetch(textureSampler,ivec2(gl_FragCoord.xy),0);
#else
vec4 color=textureLod(textureSampler,vUV,lodLevel);
#endif
#ifdef DEPTH_TEXTURE
gl_FragDepth=color.r;
#else
if (conversion==1.) {color=toLinearSpace(color);} else if (conversion==2.) {color=toGammaSpace(color);}
gl_FragColor=color;
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["copyTextureToTexturePixelShader",0,{name:c,shader:d}])},277222,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleDepthPixelShader",d=`uniform projection: mat4x4f;varying uv: vec2f;varying viewPos: vec3f;varying sphereRadius: f32;
#ifdef FLUIDRENDERING_VELOCITY
varying velocityNorm: f32;
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normalxy: vec2f=input.uv*2.0-1.0;var r2: f32=dot(normalxy,normalxy);if (r2>1.0) {discard;}
var normal: vec3f=vec3f(normalxy,sqrt(1.0-r2));
#ifndef FLUIDRENDERING_RHS
normal.z=-normal.z;
#endif
var realViewPos: vec4f=vec4f(input.viewPos+normal*input.sphereRadius,1.0);var clipSpacePos: vec4f=uniforms.projection*realViewPos;fragmentOutputs.fragDepth=clipSpacePos.z/clipSpacePos.w;
#ifdef FLUIDRENDERING_RHS
realViewPos.z=-realViewPos.z;
#endif
#ifdef FLUIDRENDERING_VELOCITY
fragmentOutputs.color=vec4f(realViewPos.z,input.velocityNorm,0.,1.);
#else
fragmentOutputs.color=vec4f(realViewPos.z,0.,0.,1.);
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingParticleDepthPixelShaderWGSL",0,{name:c,shader:d}])},506981,a=>{"use strict";var b=a.i(779438),c=a.i(159695),d=a.i(994060);class e extends c.FlowGraphExecutionBlock{constructor(a){super(a),this.condition=this.registerDataInput("condition",b.RichTypeBoolean),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(a){this.condition.getValue(a)?this.onTrue._activateSignal(a):this.onFalse._activateSignal(a)}getClassName(){return"FlowGraphBranchBlock"}}(0,d.RegisterClass)("FlowGraphBranchBlock",e),a.s(["FlowGraphBranchBlock",()=>e])},740585,a=>{"use strict";var b=a.i(625562);a.i(681682),a.i(972930),a.i(874402),a.i(384701);let c="colorPixelShader",d=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vec4 vColor;
#else
uniform vec4 color;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
gl_FragColor=vColor;
#else
gl_FragColor=color;
#endif
#include<fogFragment>(color,gl_FragColor)
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["colorPixelShader",0,{name:c,shader:d}])},296759,a=>{"use strict";var b=a.i(625562);let c="vrDistortionCorrectionPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 LensCenter;uniform vec2 Scale;uniform vec2 ScaleIn;uniform vec4 HmdWarpParam;vec2 HmdWarp(vec2 in01) {vec2 theta=(in01-LensCenter)*ScaleIn; 
float rSq=theta.x*theta.x+theta.y*theta.y;vec2 rvector=theta*(HmdWarpParam.x+HmdWarpParam.y*rSq+HmdWarpParam.z*rSq*rSq+HmdWarpParam.w*rSq*rSq*rSq);return LensCenter+Scale*rvector;}
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec2 tc=HmdWarp(vUV);if (tc.x <0.0 || tc.x>1.0 || tc.y<0.0 || tc.y>1.0)
gl_FragColor=vec4(0.0,0.0,0.0,0.0);else{gl_FragColor=texture2D(textureSampler,tc);}}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["vrDistortionCorrectionPixelShader",0,{name:c,shader:d}])},983341,a=>{"use strict";var b=a.i(503102),c=a.i(779438);class d extends b.FlowGraphBlock{constructor(a){super(a),this.config=a,this.executionFunction=this.registerDataInput("function",c.RichTypeAny),this.value=this.registerDataInput("value",c.RichTypeAny),this.result=this.registerDataOutput("result",c.RichTypeAny)}_updateOutputs(a){let b=this.executionFunction.getValue(a),c=this.value.getValue(a);b&&this.result.setValue(b(c,a),a)}getClassName(){return"FlowGraphCodeExecutionBlock"}}a.s(["FlowGraphCodeExecutionBlock",()=>d])},961763,a=>{"use strict";var b=a.i(625562);let c="iblVoxelGridPixelShader",d=`var voxel_storage: texture_storage_3d<rgba8unorm,write>;varying vNormalizedPosition: vec3f;flat varying f_swizzle: i32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var size: vec3f=vec3f(textureDimensions(voxel_storage));var normPos: vec3f=input.vNormalizedPosition.xyz;var outputColor: vec4f=vec4f(0.0,0.0,0.0,1.0);switch (input.f_swizzle) {case 0: {normPos=normPos.zxy; 
outputColor=vec4f(1.0,1.0,0.0,1.0);break;}
case 1: {normPos=normPos.yzx;outputColor=vec4f(1.0,1.0,1.0,1.0);break;}
default: {normPos=normPos.xyz;outputColor=vec4f(1.0,1.0,0.0,1.0);break;}}
textureStore(voxel_storage,vec3<i32>(i32(normPos.x*size.x),i32(normPos.y*size.y),i32(normPos.z*size.z)),outputColor);fragmentOutputs.color=vec4<f32>(vec3<f32>(normPos),1.);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblVoxelGridPixelShaderWGSL",0,{name:c,shader:d}])},418198,a=>{"use strict";var b=a.i(625562);let c="vrDistortionCorrectionPixelShader",d=`#define DISABLE_UNIFORMITY_ANALYSIS
varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform LensCenter: vec2f;uniform Scale: vec2f;uniform ScaleIn: vec2f;uniform HmdWarpParam: vec4f;fn HmdWarp(in01: vec2f)->vec2f {var theta: vec2f=(in01-uniforms.LensCenter)*uniforms.ScaleIn; 
var rSq: f32=theta.x*theta.x+theta.y*theta.y;var rvector: vec2f=theta*(uniforms.HmdWarpParam.x+uniforms.HmdWarpParam.y*rSq+uniforms.HmdWarpParam.z*rSq*rSq+uniforms.HmdWarpParam.w*rSq*rSq*rSq);return uniforms.LensCenter+uniforms.Scale*rvector;}
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var tc: vec2f=HmdWarp(input.vUV);if (tc.x <0.0 || tc.x>1.0 || tc.y<0.0 || tc.y>1.0) {fragmentOutputs.color=vec4f(0.0,0.0,0.0,0.0);}
else{fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,tc);}}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["vrDistortionCorrectionPixelShaderWGSL",0,{name:c,shader:d}])},227799,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060);class e extends b.FlowGraphBlock{constructor(a){super(a),this.userVariables=this.registerDataOutput("userVariables",c.RichTypeAny),this.executionId=this.registerDataOutput("executionId",c.RichTypeNumber)}_updateOutputs(a){this.userVariables.setValue(a.userVariables,a),this.executionId.setValue(a.executionId,a)}serialize(a){super.serialize(a)}getClassName(){return"FlowGraphContextBlock"}}(0,d.RegisterClass)("FlowGraphContextBlock",e),a.s(["FlowGraphContextBlock",()=>e])},219768,a=>{"use strict";var b=a.i(625562);let c="glowMapMergePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#ifdef EMISSIVE
var textureSampler2Sampler: sampler;var textureSampler2: texture_2d<f32>;
#endif
uniform offset: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
var baseColor: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);
#ifdef EMISSIVE
baseColor+=textureSample(textureSampler2,textureSampler2Sampler,input.vUV);baseColor*=uniforms.offset;
#else
baseColor=vec4f(baseColor.rgb,abs(uniforms.offset-baseColor.a));
#ifdef STROKE
var alpha: f32=smoothstep(.0,.1,baseColor.a);baseColor=vec4f(baseColor.rgb*alpha,alpha);
#endif
#endif
#if LDR
baseColor=clamp(baseColor,vec4f(0.),vec4f(1.0));
#endif
fragmentOutputs.color=baseColor;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["glowMapMergePixelShaderWGSL",0,{name:c,shader:d}])},699765,a=>{"use strict";var b=a.i(625562);let c="colorCorrectionPixelShader",d=`uniform sampler2D textureSampler; 
uniform sampler2D colorTable; 
varying vec2 vUV;const float SLICE_COUNT=16.0; 
#define inline
vec4 sampleAs3DTexture(sampler2D textureSampler,vec3 uv,float width) {float sliceSize=1.0/width; 
float slicePixelSize=sliceSize/width; 
float sliceInnerSize=slicePixelSize*(width-1.0); 
float zSlice0=min(floor(uv.z*width),width-1.0);float zSlice1=min(zSlice0+1.0,width-1.0);float xOffset=slicePixelSize*0.5+uv.x*sliceInnerSize;float s0=xOffset+(zSlice0*sliceSize);float s1=xOffset+(zSlice1*sliceSize);vec4 slice0Color=texture2D(textureSampler,vec2(s0,uv.y));vec4 slice1Color=texture2D(textureSampler,vec2(s1,uv.y));float zOffset=mod(uv.z*width,1.0);vec4 result=mix(slice0Color,slice1Color,zOffset);return result;}
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 screen_color=texture2D(textureSampler,vUV);gl_FragColor=sampleAs3DTexture(colorTable,screen_color.rgb,SLICE_COUNT);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["colorCorrectionPixelShader",0,{name:c,shader:d}])},891155,a=>{"use strict";var b=a.i(625562);a.i(964653),a.i(673268),a.i(533676),a.i(254999);let c="hdrFilteringPixelShader",d=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform float alphaG;uniform samplerCube inputTexture;uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=radiance(alphaG,inputTexture,direction,vFilteringInfo);gl_FragColor=vec4(color*hdrScale,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["hdrFilteringPixelShader",0,{name:c,shader:d}])},144409,a=>{"use strict";var b=a.i(625562);a.i(160721),a.i(964653),a.i(645308);let c="imageProcessingPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 result=texture2D(textureSampler,vUV);result.rgb=max(result.rgb,vec3(0.));
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result.rgb=toLinearSpace(result.rgb);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
gl_FragColor=result;}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["imageProcessingPixelShader",0,{name:c,shader:d}])},595907,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleThicknessVertexShader",d=`attribute position: vec3f;attribute offset: vec2f;uniform view: mat4x4f;uniform projection: mat4x4f;uniform size: vec2f;varying uv: vec2f;@vertex
fn main(input: VertexInputs)->FragmentInputs {var cornerPos: vec3f=vec3f(
vec2f(input.offset.x-0.5,input.offset.y-0.5)*uniforms.size,
0.0
);var viewPos: vec3f=(uniforms.view*vec4f(input.position,1.0)).xyz+cornerPos;vertexOutputs.position=uniforms.projection*vec4f(viewPos,1.0);vertexOutputs.uv=input.offset;}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingParticleThicknessVertexShaderWGSL",0,{name:c,shader:d}])},377320,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="grainPixelShader",d=`#include<helperFunctions>
uniform sampler2D textureSampler; 
uniform float intensity;uniform float animatedSeed;varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(textureSampler,vUV);vec2 seed=vUV*(animatedSeed);float grain=dither(seed,intensity);float lum=getLuminance(gl_FragColor.rgb);float grainAmount=(cos(-PI+(lum*PI*2.))+1.)/2.;gl_FragColor.rgb+=grain*grainAmount;gl_FragColor.rgb=max(gl_FragColor.rgb,0.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["grainPixelShader",0,{name:c,shader:d}])},75130,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleDepthPixelShader",d=`uniform mat4 projection;varying vec2 uv;varying vec3 viewPos;varying float sphereRadius;
#ifdef FLUIDRENDERING_VELOCITY
varying float velocityNorm;
#endif
void main(void) {vec3 normal;normal.xy=uv*2.0-1.0;float r2=dot(normal.xy,normal.xy);if (r2>1.0) discard;normal.z=sqrt(1.0-r2);
#ifndef FLUIDRENDERING_RHS
normal.z=-normal.z;
#endif
vec4 realViewPos=vec4(viewPos+normal*sphereRadius,1.0);vec4 clipSpacePos=projection*realViewPos;
#ifdef WEBGPU
gl_FragDepth=clipSpacePos.z/clipSpacePos.w;
#else
gl_FragDepth=(clipSpacePos.z/clipSpacePos.w)*0.5+0.5;
#endif
#ifdef FLUIDRENDERING_RHS
realViewPos.z=-realViewPos.z;
#endif
#ifdef FLUIDRENDERING_VELOCITY
glFragColor=vec4(realViewPos.z,velocityNorm,0.,1.);
#else
glFragColor=vec4(realViewPos.z,0.,0.,1.);
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingParticleDepthPixelShader",0,{name:c,shader:d}])},943873,a=>{"use strict";var b=a.i(625562);let c="taaPixelShader",d=`varying vUV: vec2f;var textureSampler: texture_2d<f32>;var historySampler: texture_2d<f32>;
#ifdef TAA_REPROJECT_HISTORY
var historySamplerSampler: sampler;var velocitySampler: texture_2d<f32>;
#endif
uniform factor: f32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let pos=vec2i(fragmentInputs.position.xy);let c=textureLoad(textureSampler,pos,0);
#ifdef TAA_REPROJECT_HISTORY
let v=textureLoad(velocitySampler,pos,0);var h=textureSample(historySampler,historySamplerSampler,input.vUV+v.xy);
#else
var h=textureLoad(historySampler,pos,0);
#endif
#ifdef TAA_CLAMP_HISTORY
var cmin=vec4f(1);var cmax=vec4f(0);for (var x=-1; x<=1; x+=1) {for (var y=-1; y<=1; y+=1) {let c=textureLoad(textureSampler,pos+vec2i(x,y),0);cmin=min(cmin,c);cmax=max(cmax,c);}}
h=clamp(h,cmin,cmax);
#endif
fragmentOutputs.color= mix(h,c,uniforms.factor);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["taaPixelShaderWGSL",0,{name:c,shader:d}])},473596,a=>{"use strict";var b=a.i(625562);let c="taaPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D historySampler;
#ifdef TAA_REPROJECT_HISTORY
uniform sampler2D velocitySampler;
#endif
uniform float factor;void main() {ivec2 pos=ivec2(gl_FragCoord.xy);vec4 c=texelFetch(textureSampler,pos,0);
#ifdef TAA_REPROJECT_HISTORY
vec4 v=texelFetch(velocitySampler,pos,0);vec4 h=texture2D(historySampler,vUV+v.xy);
#else
vec4 h=texelFetch(historySampler,pos,0);
#endif
#ifdef TAA_CLAMP_HISTORY
vec4 cmin=vec4(1);vec4 cmax=vec4(0);for (int x=-1; x<=1; x+=1) {for (int y=-1; y<=1; y+=1) {vec4 c=texelFetch(textureSampler,pos+ivec2(x,y),0);cmin=min(cmin,c);cmax=max(cmax,c);}}
h=clamp(h,cmin,cmax);
#endif
gl_FragColor=mix(h,c,factor);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["taaPixelShader",0,{name:c,shader:d}])},19944,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingParticleDepthVertexShader",d=`attribute vec3 position;attribute vec2 offset;uniform mat4 view;uniform mat4 projection;uniform vec2 size;varying vec2 uv;varying vec3 viewPos;varying float sphereRadius;
#ifdef FLUIDRENDERING_VELOCITY
attribute vec3 velocity;varying float velocityNorm;
#endif
void main(void) {vec3 cornerPos;cornerPos.xy=vec2(offset.x-0.5,offset.y-0.5)*size;cornerPos.z=0.0;viewPos=(view*vec4(position,1.0)).xyz;gl_Position=projection*vec4(viewPos+cornerPos,1.0);uv=offset;sphereRadius=size.x/2.0;
#ifdef FLUIDRENDERING_VELOCITY
velocityNorm=length(velocity);
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingParticleDepthVertexShader",0,{name:c,shader:d}])},518954,a=>{"use strict";var b=a.i(625562);let c="convolutionPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;uniform float kernel[9];
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec2 onePixel=vec2(1.0,1.0)/screenSize;vec4 colorSum =
texture2D(textureSampler,vUV+onePixel*vec2(-1,-1))*kernel[0] +
texture2D(textureSampler,vUV+onePixel*vec2(0,-1))*kernel[1] +
texture2D(textureSampler,vUV+onePixel*vec2(1,-1))*kernel[2] +
texture2D(textureSampler,vUV+onePixel*vec2(-1,0))*kernel[3] +
texture2D(textureSampler,vUV+onePixel*vec2(0,0))*kernel[4] +
texture2D(textureSampler,vUV+onePixel*vec2(1,0))*kernel[5] +
texture2D(textureSampler,vUV+onePixel*vec2(-1,1))*kernel[6] +
texture2D(textureSampler,vUV+onePixel*vec2(0,1))*kernel[7] +
texture2D(textureSampler,vUV+onePixel*vec2(1,1))*kernel[8];float kernelWeight =
kernel[0] +
kernel[1] +
kernel[2] +
kernel[3] +
kernel[4] +
kernel[5] +
kernel[6] +
kernel[7] +
kernel[8];if (kernelWeight<=0.0) {kernelWeight=1.0;}
gl_FragColor=vec4((colorSum/kernelWeight).rgb,1);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["convolutionPixelShader",0,{name:c,shader:d}])},731440,a=>{"use strict";var b=a.i(625562);let c="ssaoCombinePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var originalColorSampler: sampler;var originalColor: texture_2d<f32>;uniform viewport: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
var uv: vec2f=uniforms.viewport.xy+input.vUV*uniforms.viewport.zw;var ssaoColor: vec4f=textureSample(textureSampler,textureSamplerSampler,uv);var sceneColor: vec4f=textureSample(originalColor,originalColorSampler,uv);fragmentOutputs.color=sceneColor*ssaoColor;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["ssaoCombinePixelShaderWGSL",0,{name:c,shader:d}])},914307,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="extractHighlightsPixelShader",d=`#include<helperFunctions>
varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform threshold: f32;uniform exposure: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);var luma: f32=dot(LuminanceEncodeApprox,fragmentOutputs.color.rgb*uniforms.exposure);fragmentOutputs.color=vec4f(step(uniforms.threshold,luma)*fragmentOutputs.color.rgb,fragmentOutputs.color.a);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["extractHighlightsPixelShaderWGSL",0,{name:c,shader:d}])},22984,a=>{"use strict";var b=a.i(625562);a.i(435),a.i(842357),a.i(197011),a.i(316972);let c="colorPixelShader",d=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vColor: vec4f;
#else
uniform color: vec4f;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
fragmentOutputs.color=input.vColor;
#else
fragmentOutputs.color=uniforms.color;
#endif
#include<fogFragment>(color,fragmentOutputs.color)
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["colorPixelShaderWGSL",0,{name:c,shader:d}])},260340,a=>{"use strict";var b=a.i(625562);let c="hdrIrradianceFilteringVertexShader",d=`attribute position: vec2f;varying direction: vec3f;uniform up: vec3f;uniform right: vec3f;uniform front: vec3f;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var view: mat3x3f= mat3x3f(uniforms.up,uniforms.right,uniforms.front);vertexOutputs.direction=view*vec3f(input.position,1.0);vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["hdrIrradianceFilteringVertexShaderWGSL",0,{name:c,shader:d}])},180800,a=>{"use strict";var b=a.i(625562);let c="circleOfConfusionPixelShader",d=`uniform sampler2D depthSampler;varying vec2 vUV;
#ifndef COC_DEPTH_NOT_NORMALIZED
uniform vec2 cameraMinMaxZ;
#endif
uniform float focusDistance;uniform float cocPrecalculation;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float depth=texture2D(depthSampler,vUV).r;
#define CUSTOM_COC_DEPTH
#ifdef COC_DEPTH_NOT_NORMALIZED
float pixelDistance=depth*1000.0;
#else
float pixelDistance=(cameraMinMaxZ.x+cameraMinMaxZ.y*depth)*1000.0; 
#endif
#define CUSTOM_COC_PIXELDISTANCE
float coc=abs(cocPrecalculation*((focusDistance-pixelDistance)/pixelDistance));coc=clamp(coc,0.0,1.0);gl_FragColor=vec4(coc,coc,coc,1.0);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["circleOfConfusionPixelShader",0,{name:c,shader:d}])},423244,a=>{"use strict";var b=a.i(625562);let c="iblVoxelSlabDebugVertexShader",d=`attribute position: vec3f;varying vNormalizedPosition: vec3f;uniform world: mat4x4f;uniform invWorldScale: mat4x4f;uniform cameraViewMatrix: mat4x4f;uniform projection: mat4x4f;uniform viewMatrix: mat4x4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {var worldPosition: vec4f=(uniforms.world* vec4f(input.position,1.));vertexOutputs.position=uniforms.projection*uniforms.cameraViewMatrix*worldPosition;vertexOutputs.vNormalizedPosition=(uniforms.viewMatrix*uniforms.invWorldScale*worldPosition).rgb;vertexOutputs.vNormalizedPosition=vertexOutputs.vNormalizedPosition* vec3f(0.5)+ vec3f(0.5);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblVoxelSlabDebugVertexShaderWGSL",0,{name:c,shader:d}])},528183,a=>{"use strict";var b=a.i(542693),c=a.i(779438),d=a.i(994060);class e extends b.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.animationToPause=this.registerDataInput("animationToPause",c.RichTypeAny)}_execute(a){this.animationToPause.getValue(a).pause(),this.out._activateSignal(a)}getClassName(){return"FlowGraphPauseAnimationBlock"}}(0,d.RegisterClass)("FlowGraphPauseAnimationBlock",e),a.s(["FlowGraphPauseAnimationBlock",()=>e])},193916,a=>{"use strict";var b=a.i(779438),c=a.i(542693),d=a.i(994060);class e extends c.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.count=this.registerDataOutput("count",b.RichTypeNumber),this.reset=this._registerSignalInput("reset")}_execute(a,b){if(b===this.reset){a._setExecutionVariable(this,"count",0),this.count.setValue(0,a);return}let c=a._getExecutionVariable(this,"count",0)+1;a._setExecutionVariable(this,"count",c),this.count.setValue(c,a),this.out._activateSignal(a)}getClassName(){return"FlowGraphCallCounterBlock"}}(0,d.RegisterClass)("FlowGraphCallCounterBlock",e),a.s(["FlowGraphCallCounterBlock",()=>e])},41018,a=>{"use strict";var b=a.i(625562);let c="glowMapMergePixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;
#ifdef EMISSIVE
uniform sampler2D textureSampler2;
#endif
uniform float offset;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec4 baseColor=texture2D(textureSampler,vUV);
#ifdef EMISSIVE
baseColor+=texture2D(textureSampler2,vUV);baseColor*=offset;
#else
baseColor.a=abs(offset-baseColor.a);
#ifdef STROKE
float alpha=smoothstep(.0,.1,baseColor.a);baseColor.a=alpha;baseColor.rgb=baseColor.rgb*alpha;
#endif
#endif
#if LDR
baseColor=clamp(baseColor,0.,1.0);
#endif
gl_FragColor=baseColor;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["glowMapMergePixelShader",0,{name:c,shader:d}])},744060,a=>{"use strict";var b=a.i(625562);a.i(435),a.i(160815),a.i(197011),a.i(410897);let c="outlinePixelShader",d=`uniform color: vec4f;
#ifdef ALPHATEST
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV).a<0.4) {discard;}
#endif
#include<logDepthFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["outlinePixelShaderWGSL",0,{name:c,shader:d}])},785827,a=>{"use strict";var b=a.i(625562);let c="sharpenPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;uniform sharpnessAmounts: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var onePixel: vec2f= vec2f(1.0,1.0)/uniforms.screenSize;var color: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);var edgeDetection: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(0,-1)) +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(-1,0)) +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(1,0)) +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(0,1)) -
color*4.0;fragmentOutputs.color=max(vec4f(color.rgb*uniforms.sharpnessAmounts.y,color.a)-(uniforms.sharpnessAmounts.x* vec4f(edgeDetection.rgb,0)),vec4f(0.));}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["sharpenPixelShaderWGSL",0,{name:c,shader:d}])},756097,a=>{"use strict";var b=a.i(159695),c=a.i(779438),d=a.i(994060);class e extends b.FlowGraphExecutionBlock{constructor(a){super(a),this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",c.RichTypeBoolean)}_execute(a,b){let c=a._getExecutionVariable(this,"value","boolean"==typeof this.config?.startValue&&!this.config.startValue);c=!c,a._setExecutionVariable(this,"value",c),this.value.setValue(c,a),c?this.onOn._activateSignal(a):this.onOff._activateSignal(a)}getClassName(){return"FlowGraphFlipFlopBlock"}}(0,d.RegisterClass)("FlowGraphFlipFlopBlock",e),a.s(["FlowGraphFlipFlopBlock",()=>e])},81191,a=>{"use strict";var b=a.i(625562);let c="sharpenPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;uniform vec2 sharpnessAmounts;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec2 onePixel=vec2(1.0,1.0)/screenSize;vec4 color=texture2D(textureSampler,vUV);vec4 edgeDetection=texture2D(textureSampler,vUV+onePixel*vec2(0,-1)) +
texture2D(textureSampler,vUV+onePixel*vec2(-1,0)) +
texture2D(textureSampler,vUV+onePixel*vec2(1,0)) +
texture2D(textureSampler,vUV+onePixel*vec2(0,1)) -
color*4.0;gl_FragColor=max(vec4(color.rgb*sharpnessAmounts.y,color.a)-(sharpnessAmounts.x*vec4(edgeDetection.rgb,0)),0.);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["sharpenPixelShader",0,{name:c,shader:d}])},418387,a=>{"use strict";var b=a.i(625562);let c="glowBlurPostProcessPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;uniform vec2 direction;uniform float blurWidth;float getLuminance(vec3 color)
{return dot(color,vec3(0.2126,0.7152,0.0722));}
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float weights[7];weights[0]=0.05;weights[1]=0.1;weights[2]=0.2;weights[3]=0.3;weights[4]=0.2;weights[5]=0.1;weights[6]=0.05;vec2 texelSize=vec2(1.0/screenSize.x,1.0/screenSize.y);vec2 texelStep=texelSize*direction*blurWidth;vec2 start=vUV-3.0*texelStep;vec4 baseColor=vec4(0.,0.,0.,0.);vec2 texelOffset=vec2(0.,0.);for (int i=0; i<7; i++)
{vec4 texel=texture2D(textureSampler,start+texelOffset);baseColor.a+=texel.a*weights[i];float luminance=getLuminance(baseColor.rgb);float luminanceTexel=getLuminance(texel.rgb);float choice=step(luminanceTexel,luminance);baseColor.rgb=choice*baseColor.rgb+(1.0-choice)*texel.rgb;texelOffset+=texelStep;}
gl_FragColor=baseColor;}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["glowBlurPostProcessPixelShader",0,{name:c,shader:d}])},129616,a=>{"use strict";var b=a.i(625562);let c="passCubePixelShader",d=`varying vec2 vUV;uniform samplerCube textureSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{vec2 uv=vUV*2.0-1.0;
#ifdef POSITIVEX
gl_FragColor=textureCube(textureSampler,vec3(1.001,uv.y,uv.x));
#endif
#ifdef NEGATIVEX
gl_FragColor=textureCube(textureSampler,vec3(-1.001,uv.y,uv.x));
#endif
#ifdef POSITIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,1.001,uv.x));
#endif
#ifdef NEGATIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,-1.001,uv.x));
#endif
#ifdef POSITIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,1.001));
#endif
#ifdef NEGATIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,-1.001));
#endif
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["passCubePixelShader",0,{name:c,shader:d}])},805618,a=>{"use strict";var b=a.i(625562);a.i(463068),a.i(136983),a.i(51308),a.i(227387);let c="hdrFilteringPixelShader",d=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform alphaG: f32;var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=radiance(uniforms.alphaG,inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["hdrFilteringPixelShaderWGSL",0,{name:c,shader:d}])},954173,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingStandardBlurPixelShader",d=`uniform sampler2D textureSampler;uniform int filterSize;uniform vec2 blurDir;varying vec2 vUV;void main(void) {vec4 s=textureLod(textureSampler,vUV,0.);if (s.r==0.) {glFragColor=vec4(0.,0.,0.,1.);return;}
float sigma=float(filterSize)/3.0;float twoSigma2=2.0*sigma*sigma;vec4 sum=vec4(0.);float wsum=0.;for (int x=-filterSize; x<=filterSize; ++x) {vec2 coords=vec2(x);vec4 sampl=textureLod(textureSampler,vUV+coords*blurDir,0.);float w=exp(-coords.x*coords.x/twoSigma2);sum+=sampl*w;wsum+=w;}
sum/=wsum;glFragColor=vec4(sum.rgb,1.);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingStandardBlurPixelShader",0,{name:c,shader:d}])},860296,a=>{"use strict";var b=a.i(542693),c=a.i(994060);class d extends b.FlowGraphExecutionBlockWithOutSignal{constructor(a){for(const b in super(a),this.config=a,this.config.eventData)this.registerDataInput(b,this.config.eventData[b].type,this.config.eventData[b].value)}_execute(a){let b=this.config.eventId,c={};for(let b of this.dataInputs)c[b.name]=b.getValue(a);a.configuration.coordinator.notifyCustomEvent(b,c),this.out._activateSignal(a)}getClassName(){return"FlowGraphReceiveCustomEventBlock"}}(0,c.RegisterClass)("FlowGraphReceiveCustomEventBlock",d),a.s(["FlowGraphSendCustomEventBlock",()=>d])},377219,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="layerPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec4 color;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec4 baseColor=texture2D(textureSampler,vUV);
#if defined(CONVERT_TO_GAMMA)
baseColor.rgb=toGammaSpace(baseColor.rgb);
#elif defined(CONVERT_TO_LINEAR)
baseColor.rgb=toLinearSpace(baseColor.rgb);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
gl_FragColor=baseColor*color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["layerPixelShader",0,{name:c,shader:d}])},270528,a=>{"use strict";var b=a.i(625562);let c="lodCubePixelShader",d=`precision highp float;const float GammaEncodePowerApprox=1.0/2.2;varying vec2 vUV;uniform samplerCube textureSampler;uniform float lod;uniform int gamma;void main(void)
{vec2 uv=vUV*2.0-1.0;
#ifdef POSITIVEX
gl_FragColor=textureCube(textureSampler,vec3(1.001,uv.y,uv.x),lod);
#endif
#ifdef NEGATIVEX
gl_FragColor=textureCube(textureSampler,vec3(-1.001,uv.y,uv.x),lod);
#endif
#ifdef POSITIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,1.001,uv.x),lod);
#endif
#ifdef NEGATIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,-1.001,uv.x),lod);
#endif
#ifdef POSITIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,1.001),lod);
#endif
#ifdef NEGATIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,-1.001),lod);
#endif
if (gamma==0) {gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(GammaEncodePowerApprox));}}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["lodCubePixelShader",0,{name:c,shader:d}])},967544,a=>{"use strict";var b=a.i(625562);let c="circleOfConfusionPixelShader",d=`varying vUV: vec2f;var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;
#ifndef COC_DEPTH_NOT_NORMALIZED
uniform cameraMinMaxZ: vec2f;
#endif
uniform focusDistance: f32;uniform cocPrecalculation: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var depth: f32=textureSample(depthSampler,depthSamplerSampler,input.vUV).r;
#define CUSTOM_COC_DEPTH
#ifdef COC_DEPTH_NOT_NORMALIZED
let pixelDistance=depth*1000.0;
#else
let pixelDistance: f32=(uniforms.cameraMinMaxZ.x+uniforms.cameraMinMaxZ.y*depth)*1000.0; 
#endif
#define CUSTOM_COC_PIXELDISTANCE
var coc: f32=abs(uniforms.cocPrecalculation*((uniforms.focusDistance-pixelDistance)/pixelDistance));coc=clamp(coc,0.0,1.0);fragmentOutputs.color= vec4f(coc,coc,coc,1.0);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["circleOfConfusionPixelShaderWGSL",0,{name:c,shader:d}])},485873,a=>{"use strict";var b=a.i(625562);let c="iblCombineVoxelGridsPixelShader",d="precision highp float;precision highp sampler3D;varying vec2 vUV;uniform sampler3D voxelXaxisSampler;uniform sampler3D voxelYaxisSampler;uniform sampler3D voxelZaxisSampler;uniform float layer;void main(void) {vec3 coordZ=vec3(vUV.x,vUV.y,layer);float voxelZ=texture(voxelZaxisSampler,coordZ).r;vec3 coordX=vec3(1.0-layer,vUV.y,vUV.x);float voxelX=texture(voxelXaxisSampler,coordX).r;vec3 coordY=vec3(layer,vUV.x,vUV.y);float voxelY=texture(voxelYaxisSampler,coordY).r;float voxel=(voxelX>0.0 || voxelY>0.0 || voxelZ>0.0) ? 1.0 : 0.0;glFragColor=vec4(vec3(voxel),1.0);}";b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblCombineVoxelGridsPixelShader",0,{name:c,shader:d}])},339869,a=>{"use strict";var b=a.i(625562);let c="iblShadowDebugPixelShader",d=`#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D debugSampler;uniform vec4 sizeParams;
#define offsetX sizeParams.x
#define offsetY sizeParams.y
#define widthScale sizeParams.z
#define heightScale sizeParams.w
void main(void) {vec2 uv =
vec2((offsetX+vUV.x)*widthScale,(offsetY+vUV.y)*heightScale);vec4 background=texture2D(textureSampler,vUV);vec4 debugColour=texture2D(debugSampler,vUV);if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {gl_FragColor.rgba=background;} else {gl_FragColor.rgb=mix(debugColour.rgb,background.rgb,0.0);gl_FragColor.a=1.0;}}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblShadowDebugPixelShader",0,{name:c,shader:d}])},89413,a=>{"use strict";var b=a.i(344611),c=a.i(994060),d=a.i(779438);class e extends b.FlowGraphEventBlock{constructor(){super(),this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",d.RichTypeNumber),this.deltaTime=this.registerDataOutput("deltaTime",d.RichTypeNumber)}_preparePendingTasks(a){}_executeEvent(a,b){return this.timeSinceStart.setValue(b.timeSinceStart,a),this.deltaTime.setValue(b.deltaTime,a),this._execute(a),!0}_cancelPendingTasks(a){}getClassName(){return"FlowGraphSceneTickEventBlock"}}(0,c.RegisterClass)("FlowGraphSceneTickEventBlock",e),a.s(["FlowGraphSceneTickEventBlock",()=>e])},698888,a=>{"use strict";var b=a.i(625562);let c="layerVertexShader",d=`attribute position: vec2f;uniform scale: vec2f;uniform offset: vec2f;uniform textureMatrix: mat4x4f;varying vUV: vec2f;const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var shiftedPosition: vec2f=input.position*uniforms.scale+uniforms.offset;vertexOutputs.vUV=(uniforms.textureMatrix* vec4f(shiftedPosition*madd+madd,1.0,0.0)).xy;vertexOutputs.position= vec4f(shiftedPosition,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["layerVertexShaderWGSL",0,{name:c,shader:d}])},685713,a=>{"use strict";var b=a.i(625562);let c="boundingBoxRendererVertexShader",d=`attribute position: vec3f;uniform world: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef INSTANCES
attribute world0 : vec4<f32>;attribute world1 : vec4<f32>;attribute world2 : vec4<f32>;attribute world3 : vec4<f32>;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef INSTANCES
var finalWorld=mat4x4<f32>(vertexInputs.world0,vertexInputs.world1,vertexInputs.world2,vertexInputs.world3);var worldPos: vec4f=finalWorld* vec4f(input.position,1.0);
#else
var worldPos: vec4f=uniforms.world* vec4f(input.position,1.0);
#endif
vertexOutputs.position=uniforms.viewProjection*worldPos;
#define CUSTOM_VERTEX_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["boundingBoxRendererVertexShaderWGSL",0,{name:c,shader:d}])},58633,a=>{"use strict";var b=a.i(625562);let c="iblVoxelSlabDebugPixelShader",d=`precision highp float;varying vec3 vNormalizedPosition;uniform float nearPlane;uniform float farPlane;uniform float stepSize;void main(void) {vec3 normPos=vNormalizedPosition.xyz;float chunkSize=stepSize*float(MAX_DRAW_BUFFERS);float numChunks=1.0/chunkSize;float positionInChunk=fract(normPos.z/chunkSize);float slab=floor(positionInChunk*float(MAX_DRAW_BUFFERS)) /
float(MAX_DRAW_BUFFERS);if (normPos.x<0.0 || normPos.y<0.0 || normPos.z<0.0 ||
normPos.x>1.0 || normPos.y>1.0 || normPos.z>1.0) {gl_FragColor=vec4(0.0,0.0,0.0,0.0);} else {gl_FragColor=vec4(slab,0.0,0.0,0.75);}}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblVoxelSlabDebugPixelShader",0,{name:c,shader:d}])},415598,a=>{"use strict";var b=a.i(625562);a.i(964653),a.i(673268),a.i(533676),a.i(254999);let c="hdrIrradianceFilteringPixelShader",d=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform samplerCube inputTexture;
#ifdef IBL_CDF_FILTERING
uniform sampler2D icdfTexture;
#endif
uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=irradiance(inputTexture,direction,vFilteringInfo,0.0,vec3(1.0),direction
#ifdef IBL_CDF_FILTERING
,icdfTexture
#endif
);gl_FragColor=vec4(color*hdrScale,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["hdrIrradianceFilteringPixelShader",0,{name:c,shader:d}])},834374,a=>{"use strict";var b=a.i(625562);a.i(964653),a.i(673268),a.i(533676),a.i(254999);let c="iblDominantDirectionPixelShader",d=`precision highp sampler2D;precision highp samplerCube;
#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
varying vec2 vUV;uniform sampler2D icdfSampler;void main(void) {vec3 lightDir=vec3(0.0,0.0,0.0);for(uint i=0u; i<NUM_SAMPLES; ++i)
{vec2 Xi=hammersley(i,NUM_SAMPLES);vec2 T;T.x=texture2D(icdfSampler,vec2(Xi.x,0.0)).x;T.y=texture2D(icdfSampler,vec2(T.x,Xi.y)).y;vec3 Ls=uv_to_normal(vec2(1.0-fract(T.x+0.25),T.y));lightDir+=Ls;}
lightDir/=float(NUM_SAMPLES);gl_FragColor=vec4(lightDir,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblDominantDirectionPixelShader",0,{name:c,shader:d}])},343183,a=>{"use strict";var b=a.i(625562);let c="pickingPixelShader",d=`#if defined(INSTANCES)
flat varying float vMeshID;
#else
uniform float meshID;
#endif
void main(void) {float id;
#if defined(INSTANCES)
id=vMeshID;
#else
id=meshID;
#endif
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
int castedId=int(id);vec3 color=vec3(
float((castedId>>16) & 0xFF),
float((castedId>>8) & 0xFF),
float(castedId & 0xFF)
)/255.0;gl_FragColor=vec4(color,1.0);
#else
float castedId=floor(id+0.5);vec3 color=vec3(
floor(mod(castedId,16777216.0)/65536.0),
floor(mod(castedId,65536.0)/256.0),
mod(castedId,256.0)
)/255.0;gl_FragColor=vec4(color,1.0);
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["pickingPixelShader",0,{name:c,shader:d}])},187437,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingStandardBlurPixelShader",d=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform filterSize: i32;uniform blurDir: vec2f;varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var s: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.);if (s.r==0.) {fragmentOutputs.color=vec4f(0.,0.,0.,1.);return fragmentOutputs;}
var sigma: f32=f32(uniforms.filterSize)/3.0;var twoSigma2: f32=2.0*sigma*sigma;var sum: vec4f=vec4f(0.);var wsum: f32=0.;for (var x: i32=-uniforms.filterSize; x<=uniforms.filterSize; x++) {var coords: vec2f=vec2f(f32(x));var sampl: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV+coords*uniforms.blurDir,0.);var w: f32=exp(-coords.x*coords.x/twoSigma2);sum+=sampl*w;wsum+=w;}
sum/=wsum;fragmentOutputs.color=vec4f(sum.rgb,1.);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingStandardBlurPixelShaderWGSL",0,{name:c,shader:d}])},727655,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="iblScaledLuminancePixelShader",d=`precision highp sampler2D;precision highp samplerCube;
#include<helperFunctions>
varying vec2 vUV;
#ifdef IBL_USE_CUBE_MAP
uniform samplerCube iblSource;
#else
uniform sampler2D iblSource;
#endif
uniform int iblWidth;uniform int iblHeight;float fetchLuminance(vec2 coords) {
#ifdef IBL_USE_CUBE_MAP
vec3 direction=equirectangularToCubemapDirection(coords);vec3 color=textureCubeLodEXT(iblSource,direction,0.0).rgb;
#else
vec3 color=textureLod(iblSource,coords,0.0).rgb;
#endif
return dot(color,LuminanceEncodeApprox);}
void main(void) {float deform=sin(vUV.y*PI);float luminance=fetchLuminance(vUV);gl_FragColor=vec4(vec3(deform*luminance),1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblScaledLuminancePixelShader",0,{name:c,shader:d}])},501076,a=>{"use strict";var b=a.i(625562);let c="iblCombineVoxelGridsPixelShader",d=`varying vUV: vec2f;var voxelXaxisSamplerSampler: sampler;var voxelXaxisSampler: texture_3d<f32>;var voxelYaxisSamplerSampler: sampler;var voxelYaxisSampler: texture_3d<f32>;var voxelZaxisSamplerSampler: sampler;var voxelZaxisSampler: texture_3d<f32>;uniform layer: f32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var coordZ: vec3f= vec3f(fragmentInputs.vUV.x,fragmentInputs.vUV.y,uniforms.layer);var voxelZ: f32=textureSample(voxelZaxisSampler,voxelZaxisSamplerSampler,coordZ).r;var coordX: vec3f= vec3f(1.0-uniforms.layer,fragmentInputs.vUV.y,fragmentInputs.vUV.x);var voxelX: f32=textureSample(voxelXaxisSampler,voxelXaxisSamplerSampler,coordX).r;var coordY: vec3f= vec3f(uniforms.layer,fragmentInputs.vUV.x,fragmentInputs.vUV.y);var voxelY: f32=textureSample(voxelYaxisSampler,voxelYaxisSamplerSampler,coordY).r;var voxel=select(0.0,1.0,(voxelX>0.0 || voxelY>0.0 || voxelZ>0.0));fragmentOutputs.color= vec4f( vec3f(voxel),1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblCombineVoxelGridsPixelShaderWGSL",0,{name:c,shader:d}])},746039,a=>{"use strict";var b=a.i(625562);let c="passCubePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_cube<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var uv: vec2f=input.vUV*2.0-1.0;
#ifdef POSITIVEX
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,vec3f(1.001,uv.y,uv.x));
#endif
#ifdef NEGATIVEX
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,vec3f(-1.001,uv.y,uv.x));
#endif
#ifdef POSITIVEY
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,vec3f(uv.y,1.001,uv.x));
#endif
#ifdef NEGATIVEY
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,vec3f(uv.y,-1.001,uv.x));
#endif
#ifdef POSITIVEZ
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,vec3f(uv,1.001));
#endif
#ifdef NEGATIVEZ
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,vec3f(uv,-1.001));
#endif
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["passCubePixelShaderWGSL",0,{name:c,shader:d}])},214202,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="iblScaledLuminancePixelShader",d=`#include<helperFunctions>
#ifdef IBL_USE_CUBE_MAP
var iblSourceSampler: sampler;var iblSource: texture_cube<f32>;
#else
var iblSourceSampler: sampler;var iblSource: texture_2d<f32>;
#endif
uniform iblHeight: i32;uniform iblWidth: i32;fn fetchLuminance(coords: vec2f)->f32 {
#ifdef IBL_USE_CUBE_MAP
var direction: vec3f=equirectangularToCubemapDirection(coords);var color: vec3f=textureSampleLevel(iblSource,iblSourceSampler,direction,0.0).rgb;
#else
var color: vec3f=textureSampleLevel(iblSource,iblSourceSampler,coords,0.0).rgb;
#endif
return dot(color,LuminanceEncodeApprox);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var deform: f32=sin(input.vUV.y*PI);var luminance: f32=fetchLuminance(input.vUV);fragmentOutputs.color=vec4f(vec3f(deform*luminance),1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblScaledLuminancePixelShaderWGSL",0,{name:c,shader:d}])},950198,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="grainPixelShader",d=`#include<helperFunctions>
varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform intensity: f32;uniform animatedSeed: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);var seed: vec2f=input.vUV*uniforms.animatedSeed;var grain: f32=dither(seed,uniforms.intensity);var lum: f32=getLuminance(fragmentOutputs.color.rgb);var grainAmount: f32=(cos(-PI+(lum*PI*2.))+1.)/2.;fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb+grain*grainAmount,fragmentOutputs.color.a);fragmentOutputs.color=vec4f(max(fragmentOutputs.color.rgb,vec3f(0.0)),fragmentOutputs.color.a);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["grainPixelShaderWGSL",0,{name:c,shader:d}])},888535,a=>{"use strict";var b=a.i(625562);a.i(435),a.i(160815),a.i(410897),a.i(197011);let c="linePixelShader",d=`#include<clipPlaneFragmentDeclaration>
uniform color: vec4f;
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["linePixelShaderWGSL",0,{name:c,shader:d}])},178162,a=>{"use strict";var b=a.i(625562);let c="iblGenerateVoxelMipPixelShader",d=`varying vUV: vec2f;var srcMip: texture_3d<f32>;uniform layerNum: i32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var Coords=vec3i(2)*vec3i(vec2i(fragmentInputs.position.xy),uniforms.layerNum);var tex =
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(0,0,0),0).x>0.0f))
<< 0u) |
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(1,0,0),0).x>0.0f))
<< 1u) |
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(0,1,0),0).x>0.0f))
<< 2u) |
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(1,1,0),0).x>0.0f))
<< 3u) |
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(0,0,1),0).x>0.0f))
<< 4u) |
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(1,0,1),0).x>0.0f))
<< 5u) |
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(0,1,1),0).x>0.0f))
<< 6u) |
(u32(select(0u,1u,textureLoad(srcMip,Coords+vec3i(1,1,1),0).x>0.0f))
<< 7u);fragmentOutputs.color=vec4f( f32(tex)/255.0f,0.0f,0.0f,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblGenerateVoxelMipPixelShaderWGSL",0,{name:c,shader:d}])},373160,a=>{"use strict";var b=a.i(625562);let c="blackAndWhitePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform degree: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb;var luminance: f32=dot(color, vec3f(0.3,0.59,0.11)); 
var blackAndWhite: vec3f= vec3f(luminance,luminance,luminance);fragmentOutputs.color= vec4f(color-((color-blackAndWhite)*uniforms.degree),1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["blackAndWhitePixelShaderWGSL",0,{name:c,shader:d}])},333075,a=>{"use strict";var b=a.i(625562);a.i(681682),a.i(544248),a.i(430783),a.i(874402);let c="linePixelShader",d=`#include<clipPlaneFragmentDeclaration>
uniform vec4 color;
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["linePixelShader",0,{name:c,shader:d}])},851320,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="layerPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform color: vec4f;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
var baseColor: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);
#if defined(CONVERT_TO_GAMMA)
baseColor=toGammaSpace(baseColor);
#elif defined(CONVERT_TO_LINEAR)
baseColor=toLinearSpaceVec4(baseColor);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4) {discard;}
#endif
fragmentOutputs.color=baseColor*uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["layerPixelShaderWGSL",0,{name:c,shader:d}])},697426,a=>{"use strict";var b=a.i(625562);let c="iblShadowDebugPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var debugSamplerSampler: sampler;var debugSampler: texture_2d<f32>;uniform sizeParams: vec4f;
#define offsetX uniforms.sizeParams.x
#define offsetY uniforms.sizeParams.y
#define widthScale uniforms.sizeParams.z
#define heightScale uniforms.sizeParams.w
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var uv: vec2f =
vec2f((offsetX+fragmentInputs.vUV.x)*widthScale,(offsetY+fragmentInputs.vUV.y)*heightScale);var background: vec4f=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.vUV);var debugColour: vec4f=textureSample(debugSampler,debugSamplerSampler,fragmentInputs.vUV);if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {fragmentOutputs.color=background;} else {fragmentOutputs.color=vec4f(mix(debugColour.rgb,background.rgb,0.0),1.0);}}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblShadowDebugPixelShaderWGSL",0,{name:c,shader:d}])},308899,a=>{"use strict";var b=a.i(344611),c=a.i(994060);class d extends b.FlowGraphEventBlock{constructor(){super(...arguments),this.initPriority=-1,this.type="SceneReady"}_executeEvent(a,b){return this._execute(a),!0}_preparePendingTasks(a){}_cancelPendingTasks(a){}getClassName(){return"FlowGraphSceneReadyEventBlock"}}(0,c.RegisterClass)("FlowGraphSceneReadyEventBlock",d),a.s(["FlowGraphSceneReadyEventBlock",()=>d])},887304,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="copyTextureToTexturePixelShader",d=`uniform conversion: f32;
#ifndef NO_SAMPLER
var textureSamplerSampler: sampler;
#endif
var textureSampler: texture_2d<f32>;uniform lodLevel : f32;varying vUV: vec2f;
#include<helperFunctions>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#ifdef NO_SAMPLER
var color: vec4f=textureLoad(textureSampler,vec2u(fragmentInputs.position.xy),u32(uniforms.lodLevel));
#else
var color: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,uniforms.lodLevel);
#endif
#ifdef DEPTH_TEXTURE
fragmentOutputs.fragDepth=color.r;
#else
if (uniforms.conversion==1.) {color=toLinearSpaceVec4(color);} else if (uniforms.conversion==2.) {color=toGammaSpace(color);}
fragmentOutputs.color=color;
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["copyTextureToTexturePixelShaderWGSL",0,{name:c,shader:d}])},815928,a=>{"use strict";var b=a.i(625562);let c="fxaaVertexShader",d=`attribute position: vec2f;uniform texelSize: vec2f;varying vUV: vec2f;varying sampleCoordS: vec2f;varying sampleCoordE: vec2f;varying sampleCoordN: vec2f;varying sampleCoordW: vec2f;varying sampleCoordNW: vec2f;varying sampleCoordSE: vec2f;varying sampleCoordNE: vec2f;varying sampleCoordSW: vec2f;const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vUV=(input.position*madd+madd);vertexOutputs.sampleCoordS=vertexOutputs.vUV+ vec2f( 0.0,1.0)*uniforms.texelSize;vertexOutputs.sampleCoordE=vertexOutputs.vUV+ vec2f( 1.0,0.0)*uniforms.texelSize;vertexOutputs.sampleCoordN=vertexOutputs.vUV+ vec2f( 0.0,-1.0)*uniforms.texelSize;vertexOutputs.sampleCoordW=vertexOutputs.vUV+ vec2f(-1.0,0.0)*uniforms.texelSize;vertexOutputs.sampleCoordNW=vertexOutputs.vUV+ vec2f(-1.0,-1.0)*uniforms.texelSize;vertexOutputs.sampleCoordSE=vertexOutputs.vUV+ vec2f( 1.0,1.0)*uniforms.texelSize;vertexOutputs.sampleCoordNE=vertexOutputs.vUV+ vec2f( 1.0,-1.0)*uniforms.texelSize;vertexOutputs.sampleCoordSW=vertexOutputs.vUV+ vec2f(-1.0,1.0)*uniforms.texelSize;vertexOutputs.position=vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fxaaVertexShaderWGSL",0,{name:c,shader:d}])},391617,a=>{"use strict";var b=a.i(625562);let c="kernelBlurVaryingDeclaration";b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]="varying vec2 sampleCoord{X};"),a.s([])},158407,a=>{"use strict";var b=a.i(625562);a.i(391617);let c="kernelBlurVertex";b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]="sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};");let d="kernelBlurVertexShader",e=`attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[d]||(b.ShaderStore.ShadersStore[d]=e),a.s(["kernelBlurVertexShader",0,{name:d,shader:e}],158407)},109902,a=>{"use strict";var b=a.i(779438),c=a.i(994060),d=a.i(542693),e=a.i(392511);class f extends d.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.config=a,this.condition=this.registerDataInput("condition",b.RichTypeBoolean),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(a,b){let c=this.condition.getValue(a);this.config?.doWhile&&!c&&this.executionFlow._activateSignal(a);let d=0;for(;c;){if(this.executionFlow._activateSignal(a),++d>=f.MaxLoopCount){e.Logger.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}c=this.condition.getValue(a)}this.completed._activateSignal(a)}getClassName(){return"FlowGraphWhileLoopBlock"}}f.MaxLoopCount=1e3,(0,c.RegisterClass)("FlowGraphWhileLoopBlock",f),a.s(["FlowGraphWhileLoopBlock",()=>f])},740042,a=>{"use strict";var b=a.i(625562);a.i(463068),a.i(136983),a.i(51308),a.i(227387);let c="iblDominantDirectionPixelShader",d=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
var icdfSamplerSampler: sampler;var icdfSampler: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var lightDir: vec3f=vec3f(0.0,0.0,0.0);for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);var T: vec2f;T.x=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(Xi.x,0.0),0.0).x;T.y=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(T.x,Xi.y),0.0).y;var Ls: vec3f=uv_to_normal(vec2f(1.0-fract(T.x+0.25),T.y));lightDir+=Ls;}
lightDir/=vec3f(f32(NUM_SAMPLES));fragmentOutputs.color=vec4f(lightDir,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblDominantDirectionPixelShaderWGSL",0,{name:c,shader:d}])},564089,a=>{"use strict";var b=a.i(625562);a.i(506404),a.i(544248),a.i(705551);let c="spritesVertexShader",d=`attribute vec4 position;attribute vec2 options;attribute vec2 offsets;attribute vec2 inverts;attribute vec4 cellInfo;attribute vec4 color;uniform mat4 view;uniform mat4 projection;varying vec2 vUV;varying vec4 vColor;
#include<fogVertexDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vec3 viewPos=(view*vec4(position.xyz,1.0)).xyz; 
vec2 cornerPos;float angle=position.w;vec2 size=vec2(options.x,options.y);vec2 offset=offsets.xy;cornerPos=vec2(offset.x-0.5,offset.y -0.5)*size;vec3 rotatedCorner;rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);rotatedCorner.y=cornerPos.x*sin(angle)+cornerPos.y*cos(angle);rotatedCorner.z=0.;viewPos+=rotatedCorner;gl_Position=projection*vec4(viewPos,1.0); 
vColor=color;vec2 uvOffset=vec2(abs(offset.x-inverts.x),abs(1.0-offset.y-inverts.y));vec2 uvPlace=cellInfo.xy;vec2 uvSize=cellInfo.zw;vUV.x=uvPlace.x+uvSize.x*uvOffset.x;vUV.y=uvPlace.y+uvSize.y*uvOffset.y;
#ifdef FOG
vFogDistance=viewPos;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["spritesVertexShader",0,{name:c,shader:d}])},451247,a=>{"use strict";var b=a.i(625562);let c="lodCubePixelShader",d=`const GammaEncodePowerApprox=1.0/2.2;varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_cube<f32>;uniform lod: f32;uniform gamma: i32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let uv=fragmentInputs.vUV*2.0-1.0;
#ifdef POSITIVEX
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,vec3f(1.001,uv.y,uv.x),uniforms.lod);
#endif
#ifdef NEGATIVEX
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,vec3f(-1.001,uv.y,uv.x),uniforms.lod);
#endif
#ifdef POSITIVEY
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,vec3f(uv.y,1.001,uv.x),uniforms.lod);
#endif
#ifdef NEGATIVEY
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,vec3f(uv.y,-1.001,uv.x),uniforms.lod);
#endif
#ifdef POSITIVEZ
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,vec3f(uv,1.001),uniforms.lod);
#endif
#ifdef NEGATIVEZ
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,vec3f(uv,-1.001),uniforms.lod);
#endif
if (uniforms.gamma==0) {fragmentOutputs.color=vec4f(pow(fragmentOutputs.color.rgb,vec3f(GammaEncodePowerApprox)),fragmentOutputs.color.a);}}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["lodCubePixelShaderWGSL",0,{name:c,shader:d}])},451483,a=>{"use strict";var b=a.i(344611),c=a.i(779438),d=a.i(994060),e=a.i(210312);class f extends b.FlowGraphEventBlock{constructor(a){super(a),this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",c.RichTypeNumber),this.targetMesh=this.registerDataInput("targetMesh",c.RichTypeAny,a?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",c.RichTypeAny)}_executeEvent(a,b){let c=this.targetMesh.getValue(a);this.meshUnderPointer.setValue(b.mesh,a);let d=b.out&&(0,e._IsDescendantOf)(b.out,c);return this.pointerId.setValue(b.pointerId,a),!(!d&&(b.mesh===c||(0,e._IsDescendantOf)(b.mesh,c)))||(this._execute(a),!this.config?.stopPropagation)}_preparePendingTasks(a){}_cancelPendingTasks(a){}getClassName(){return"FlowGraphPointerOverEventBlock"}}(0,d.RegisterClass)("FlowGraphPointerOverEventBlock",f),a.s(["FlowGraphPointerOverEventBlock",()=>f])},371945,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingBilateralBlurPixelShader",d=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform maxFilterSize: i32;uniform blurDir: vec2f;uniform projectedParticleConstant: f32;uniform depthThreshold: f32;varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var depth: f32=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.).x;if (depth>=1e6 || depth<=0.) {fragmentOutputs.color=vec4f(vec3f(depth),1.);return fragmentOutputs;}
var filterSize: i32=min(uniforms.maxFilterSize,i32(ceil(uniforms.projectedParticleConstant/depth)));var sigma: f32=f32(filterSize)/3.0;var two_sigma2: f32=2.0*sigma*sigma;var sigmaDepth: f32=uniforms.depthThreshold/3.0;var two_sigmaDepth2: f32=2.0*sigmaDepth*sigmaDepth;var sum: f32=0.;var wsum: f32=0.;var sumVel: f32=0.;for (var x: i32=-filterSize; x<=filterSize; x++) {var coords: vec2f=vec2f(f32(x));var sampleDepthVel: vec2f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV+coords*uniforms.blurDir,0.).rg;var r: f32=dot(coords,coords);var w: f32=exp(-r/two_sigma2);var rDepth: f32=sampleDepthVel.r-depth;var wd: f32=exp(-rDepth*rDepth/two_sigmaDepth2);sum+=sampleDepthVel.r*w*wd;sumVel+=sampleDepthVel.g*w*wd;wsum+=w*wd;}
fragmentOutputs.color=vec4f(sum/wsum,sumVel/wsum,0.,1.);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingBilateralBlurPixelShaderWGSL",0,{name:c,shader:d}])},868944,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060);class e extends b.FlowGraphBlock{constructor(a){super(a),this.functionName=this.registerDataInput("functionName",c.RichTypeString),this.object=this.registerDataInput("object",c.RichTypeAny),this.context=this.registerDataInput("context",c.RichTypeAny,null),this.output=this.registerDataOutput("output",c.RichTypeAny)}_updateOutputs(a){let b=this.functionName.getValue(a),c=this.object.getValue(a),d=this.context.getValue(a);if(c&&b){let e=c[b];e&&"function"==typeof e&&this.output.setValue(e.bind(d),a)}}getClassName(){return"FlowGraphFunctionReference"}}(0,d.RegisterClass)("FlowGraphFunctionReference",e),a.s(["FlowGraphFunctionReferenceBlock",()=>e])},581462,a=>{"use strict";var b=a.i(625562);let c="bilateralBlurPixelShader",d=`uniform sampler2D textureSampler;uniform sampler2D depthSampler;uniform sampler2D normalSampler;uniform int filterSize;uniform vec2 blurDir;uniform float depthThreshold;uniform float normalThreshold;varying vec2 vUV;void main(void) {vec3 color=textureLod(textureSampler,vUV,0.).rgb;float depth=textureLod(depthSampler,vUV,0.).x;if (depth>=1e6 || depth<=0.) {glFragColor=vec4(color,1.);return;}
vec3 normal=textureLod(normalSampler,vUV,0.).rgb;
#ifdef DECODE_NORMAL
normal=normal*2.0-1.0;
#endif
float sigma=float(filterSize);float two_sigma2=2.0*sigma*sigma;float sigmaDepth=depthThreshold;float two_sigmaDepth2=2.0*sigmaDepth*sigmaDepth;float sigmaNormal=normalThreshold;float two_sigmaNormal2=2.0*sigmaNormal*sigmaNormal;vec3 sum=vec3(0.);float wsum=0.;for (int x=-filterSize; x<=filterSize; ++x) {vec2 coords=vec2(x);vec3 sampleColor=textureLod(textureSampler,vUV+coords*blurDir,0.).rgb;float sampleDepth=textureLod(depthSampler,vUV+coords*blurDir,0.).r;vec3 sampleNormal=textureLod(normalSampler,vUV+coords*blurDir,0.).rgb;
#ifdef DECODE_NORMAL
sampleNormal=sampleNormal*2.0-1.0;
#endif
float r=dot(coords,coords);float w=exp(-r/two_sigma2);float depthDelta=abs(sampleDepth-depth);float wd=step(depthDelta,depthThreshold);vec3 normalDelta=abs(sampleNormal-normal);float wn=step(normalDelta.x+normalDelta.y+normalDelta.z,normalThreshold);sum+=sampleColor*w*wd*wn;wsum+=w*wd*wn;}
glFragColor=vec4(sum/wsum,1.);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["bilateralBlurPixelShader",0,{name:c,shader:d}])},247632,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060),e=a.i(189994);class f extends b.FlowGraphBlock{constructor(a){super(a),this.config=a,this.output=this.registerDataOutput("output",(0,c.getRichTypeFromValue)(a.value))}_updateOutputs(a){this.output.setValue(this.config.value,a)}getClassName(){return"FlowGraphConstantBlock"}serialize(a={},b=e.defaultValueSerializationFunction){super.serialize(a),b("value",this.config.value,a.config)}}(0,d.RegisterClass)("FlowGraphConstantBlock",f),a.s(["FlowGraphConstantBlock",()=>f])},43805,a=>{"use strict";var b=a.i(625562);a.i(435),a.i(492619),a.i(197011);let c="depthPixelShader",d=`#ifdef ALPHATEST
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
varying vDepthMetric: f32;
#ifdef PACKED
#include<packingFunctions>
#endif
#ifdef STORE_CAMERASPACE_Z
varying vViewPos: vec4f;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV).a<0.4) {discard;}
#endif
#ifdef STORE_CAMERASPACE_Z
#ifdef PACKED
fragmentOutputs.color=pack(input.vViewPos.z);
#else
fragmentOutputs.color= vec4f(input.vViewPos.z,0.0,0.0,1.0);
#endif
#else
#ifdef NONLINEARDEPTH
#ifdef PACKED
fragmentOutputs.color=pack(input.position.z);
#else
fragmentOutputs.color= vec4f(input.position.z,0.0,0.0,0.0);
#endif
#else
#ifdef PACKED
fragmentOutputs.color=pack(input.vDepthMetric);
#else
fragmentOutputs.color= vec4f(input.vDepthMetric,0.0,0.0,1.0);
#endif
#endif
#endif
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["depthPixelShaderWGSL",0,{name:c,shader:d}])},416553,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060);class e extends b.FlowGraphBlock{constructor(a){super(a),this.condition=this.registerDataInput("condition",c.RichTypeBoolean),this.onTrue=this.registerDataInput("onTrue",c.RichTypeAny),this.onFalse=this.registerDataInput("onFalse",c.RichTypeAny),this.output=this.registerDataOutput("output",c.RichTypeAny)}_updateOutputs(a){let b=this.condition.getValue(a);this.output.setValue(b?this.onTrue.getValue(a):this.onFalse.getValue(a),a)}getClassName(){return"FlowGraphConditionalBlock"}}(0,d.RegisterClass)("FlowGraphConditionalBlock",e),a.s(["FlowGraphConditionalDataBlock",()=>e])},121126,a=>{"use strict";var b=a.i(625562);let c="bilateralBlurQualityPixelShader",d=`uniform sampler2D textureSampler;uniform sampler2D depthSampler;uniform sampler2D normalSampler;uniform int filterSize;uniform vec2 blurDir;uniform float depthThreshold;uniform float normalThreshold;varying vec2 vUV;void main(void) {vec3 color=textureLod(textureSampler,vUV,0.).rgb;float depth=textureLod(depthSampler,vUV,0.).x;if (depth>=1e6 || depth<=0.) {glFragColor=vec4(color,1.);return;}
vec3 normal=textureLod(normalSampler,vUV,0.).rgb;
#ifdef DECODE_NORMAL
normal=normal*2.0-1.0;
#endif
float sigma=float(filterSize);float two_sigma2=2.0*sigma*sigma;float sigmaDepth=depthThreshold;float two_sigmaDepth2=2.0*sigmaDepth*sigmaDepth;float sigmaNormal=normalThreshold;float two_sigmaNormal2=2.0*sigmaNormal*sigmaNormal;vec3 sum=vec3(0.);float wsum=0.;for (int x=-filterSize; x<=filterSize; ++x) {for (int y=-filterSize; y<=filterSize; ++y) {vec2 coords=vec2(x,y)*blurDir;vec3 sampleColor=textureLod(textureSampler,vUV+coords,0.).rgb;float sampleDepth=textureLod(depthSampler,vUV+coords,0.).r;vec3 sampleNormal=textureLod(normalSampler,vUV+coords,0.).rgb;
#ifdef DECODE_NORMAL
sampleNormal=sampleNormal*2.0-1.0;
#endif
float r=dot(coords,coords);float w=exp(-r/two_sigma2);float rDepth=sampleDepth-depth;float wd=exp(-rDepth*rDepth/two_sigmaDepth2);float rNormal=abs(sampleNormal.x-normal.x)+abs(sampleNormal.y-normal.y)+abs(sampleNormal.z-normal.z);float wn=exp(-rNormal*rNormal/two_sigmaNormal2);sum+=sampleColor*w*wd*wn;wsum+=w*wd*wn;}}
glFragColor=vec4(sum/wsum,1.);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["bilateralBlurQualityPixelShader",0,{name:c,shader:d}])},686097,a=>{"use strict";var b=a.i(994060),c=a.i(159695);class d extends c.FlowGraphExecutionBlock{constructor(a){super(a),this.config=a,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(a){for(let b=0;b<this.executionSignals.length;b++)this.executionSignals[b]._activateSignal(a)}setNumberOfOutputSignals(a=1){for(;this.executionSignals.length>a;){let a=this.executionSignals.pop();a&&(a.disconnectFromAll(),this._unregisterSignalOutput(a.name))}for(;this.executionSignals.length<a;)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}(0,b.RegisterClass)("FlowGraphSequenceBlock",d),a.s(["FlowGraphSequenceBlock",()=>d])},992513,a=>{"use strict";var b=a.i(625562);let c="iblCdfyPixelShader",d=`varying vUV : vec2f;
#include <helperFunctions>
#ifdef IBL_USE_CUBE_MAP
var iblSourceSampler: sampler;var iblSource: texture_cube<f32>;
#else
var iblSourceSampler: sampler;var iblSource: texture_2d<f32>;
#endif
uniform iblHeight: i32;
#ifdef IBL_USE_CUBE_MAP
fn fetchCube(uv: vec2f)->f32 {var direction: vec3f=equirectangularToCubemapDirection(uv);return sin(PI*uv.y) *
dot(textureSampleLevel(iblSource,iblSourceSampler,direction,0.0)
.rgb,
LuminanceEncodeApprox);}
#else
fn fetchPanoramic(Coords: vec2i,envmapHeight: f32)->f32 {return sin(PI*(f32(Coords.y)+0.5)/envmapHeight) *
dot(textureLoad(iblSource,Coords,0).rgb,LuminanceEncodeApprox);}
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var coords: vec2i= vec2i(fragmentInputs.position.xy);var cdfy: f32=0.0;for (var y: i32=1; y<=coords.y; y++) {
#ifdef IBL_USE_CUBE_MAP
var uv: vec2f= vec2f(input.vUV.x,( f32(y-1)+0.5)/ f32(uniforms.iblHeight));cdfy+=fetchCube(uv);
#else
cdfy+=fetchPanoramic( vec2i(coords.x,y-1), f32(uniforms.iblHeight));
#endif
}
fragmentOutputs.color= vec4f(cdfy,0.0,0.0,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblCdfyPixelShaderWGSL",0,{name:c,shader:d}])},533449,a=>{"use strict";var b=a.i(625562);let c="chromaticAberrationPixelShader",d=`uniform sampler2D textureSampler; 
uniform float chromatic_aberration;uniform float radialIntensity;uniform vec2 direction;uniform vec2 centerPosition;uniform float screen_width;uniform float screen_height;varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec2 centered_screen_pos=vec2(vUV.x-centerPosition.x,vUV.y-centerPosition.y);vec2 directionOfEffect=direction;if(directionOfEffect.x==0. && directionOfEffect.y==0.){directionOfEffect=normalize(centered_screen_pos);}
float radius2=centered_screen_pos.x*centered_screen_pos.x
+ centered_screen_pos.y*centered_screen_pos.y;float radius=sqrt(radius2);vec3 ref_indices=vec3(-0.3,0.0,0.3);float ref_shiftX=chromatic_aberration*pow(radius,radialIntensity)*directionOfEffect.x/screen_width;float ref_shiftY=chromatic_aberration*pow(radius,radialIntensity)*directionOfEffect.y/screen_height;vec2 ref_coords_r=vec2(vUV.x+ref_indices.r*ref_shiftX,vUV.y+ref_indices.r*ref_shiftY*0.5);vec2 ref_coords_g=vec2(vUV.x+ref_indices.g*ref_shiftX,vUV.y+ref_indices.g*ref_shiftY*0.5);vec2 ref_coords_b=vec2(vUV.x+ref_indices.b*ref_shiftX,vUV.y+ref_indices.b*ref_shiftY*0.5);vec4 r=texture2D(textureSampler,ref_coords_r);vec4 g=texture2D(textureSampler,ref_coords_g);vec4 b=texture2D(textureSampler,ref_coords_b);float a=clamp(r.a+g.a+b.a,0.,1.);gl_FragColor=vec4(r.r,g.g,b.b,a);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["chromaticAberrationPixelShader",0,{name:c,shader:d}])},423095,a=>{"use strict";var b=a.i(779438),c=a.i(542693),d=a.i(994060),e=a.i(419809);class f extends c.FlowGraphExecutionBlockWithOutSignal{constructor(a={}){super(a),this.config=a,this.config.startIndex=a.startIndex??new e.FlowGraphInteger(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",b.RichTypeFlowGraphInteger),this.executionCount=this.registerDataOutput("executionCount",b.RichTypeFlowGraphInteger,new e.FlowGraphInteger(0))}_execute(a,b){if(b===this.reset)this.executionCount.setValue(this.config.startIndex,a);else{let b=this.executionCount.getValue(a);b.value<this.maxExecutions.getValue(a).value&&(this.executionCount.setValue(new e.FlowGraphInteger(b.value+1),a),this.out._activateSignal(a))}}getClassName(){return"FlowGraphDoNBlock"}}(0,d.RegisterClass)("FlowGraphDoNBlock",f),a.s(["FlowGraphDoNBlock",()=>f])},177132,a=>{"use strict";var b=a.i(994060),c=a.i(542693),d=a.i(779438),e=a.i(210312);class f extends c.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.delayIndex=this.registerDataInput("delayIndex",d.RichTypeFlowGraphInteger)}_execute(a,b){let c=(0,e.getNumericValue)(this.delayIndex.getValue(a));if(c<=0||isNaN(c)||!isFinite(c))return this._reportError(a,"Invalid delay index");let d=a._getGlobalContextVariable("pendingDelays",[])[c];d&&d.dispose(),this.out._activateSignal(a)}getClassName(){return"FlowGraphCancelDelayBlock"}}(0,b.RegisterClass)("FlowGraphCancelDelayBlock",f),a.s(["FlowGraphCancelDelayBlock",()=>f])},756326,a=>{"use strict";var b=a.i(625562);let c="iblVoxelGridPixelShader",d=`precision highp float;layout(location=0) out highp float glFragData[MAX_DRAW_BUFFERS];varying vec3 vNormalizedPosition;uniform float nearPlane;uniform float farPlane;uniform float stepSize;void main(void) {vec3 normPos=vNormalizedPosition.xyz;if (normPos.z<nearPlane || normPos.z>farPlane) {discard;}
glFragData[0]=normPos.z<nearPlane+stepSize ? 1.0 : 0.0;glFragData[1]=normPos.z>=nearPlane+stepSize && normPos.z<nearPlane+2.0*stepSize ? 1.0 : 0.0;glFragData[2]=normPos.z>=nearPlane+2.0*stepSize && normPos.z<nearPlane+3.0*stepSize ? 1.0 : 0.0;glFragData[3]=normPos.z>=nearPlane+3.0*stepSize && normPos.z<nearPlane+4.0*stepSize ? 1.0 : 0.0;
#if MAX_DRAW_BUFFERS>4
glFragData[4]=normPos.z>=nearPlane+4.0*stepSize && normPos.z<nearPlane+5.0*stepSize ? 1.0 : 0.0;glFragData[5]=normPos.z>=nearPlane+5.0*stepSize && normPos.z<nearPlane+6.0*stepSize ? 1.0 : 0.0;glFragData[6]=normPos.z>=nearPlane+6.0*stepSize && normPos.z<nearPlane+7.0*stepSize ? 1.0 : 0.0;glFragData[7]=normPos.z>=nearPlane+7.0*stepSize && normPos.z<nearPlane+8.0*stepSize ? 1.0 : 0.0;
#endif
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblVoxelGridPixelShader",0,{name:c,shader:d}])},256915,a=>{"use strict";var b=a.i(625562);let c="boundingBoxRendererVertexDeclaration",d=`uniform mat4 world;uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(164388);let e="boundingBoxRendererVertexShader",f=`attribute vec3 position;
#include<__decl__boundingBoxRendererVertex>
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef INSTANCES
mat4 finalWorld=mat4(world0,world1,world2,world3);vec4 worldPos=finalWorld*vec4(position,1.0);
#else
vec4 worldPos=world*vec4(position,1.0);
#endif
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;b.ShaderStore.ShadersStore[e]||(b.ShaderStore.ShadersStore[e]=f),a.s(["boundingBoxRendererVertexShader",0,{name:e,shader:f}],256915)},320622,a=>{"use strict";var b=a.i(625562);let c="tonemapPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform _ExposureAdjustment: f32;
#if defined(HABLE_TONEMAPPING)
const A: f32=0.15;const B: f32=0.50;const C: f32=0.10;const D: f32=0.20;const E: f32=0.02;const F: f32=0.30;const W: f32=11.2;
#endif
fn Luminance(c: vec3f)->f32
{return dot(c, vec3f(0.22,0.707,0.071));}
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var colour: vec3f=textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb;
#if defined(REINHARD_TONEMAPPING)
var lum: f32=Luminance(colour.rgb); 
var lumTm: f32=lum*uniforms._ExposureAdjustment;var scale: f32=lumTm/(1.0+lumTm); 
colour*=scale/lum;
#elif defined(HABLE_TONEMAPPING)
colour*=uniforms._ExposureAdjustment;const ExposureBias: f32=2.0;var x: vec3f=ExposureBias*colour;var curr: vec3f=((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;x= vec3f(W,W,W);var whiteScale: vec3f=1.0/(((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F);colour=curr*whiteScale;
#elif defined(OPTIMIZED_HEJIDAWSON_TONEMAPPING)
colour*=uniforms._ExposureAdjustment;var X: vec3f=max( vec3f(0.0,0.0,0.0),colour-0.004);var retColor: vec3f=(X*(6.2*X+0.5))/(X*(6.2*X+1.7)+0.06);colour=retColor*retColor;
#elif defined(PHOTOGRAPHIC_TONEMAPPING)
colour= vec3f(1.0,1.0,1.0)-exp2(-uniforms._ExposureAdjustment*colour);
#endif
fragmentOutputs.color= vec4f(colour.rgb,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["tonemapPixelShaderWGSL",0,{name:c,shader:d}])},281766,a=>{"use strict";var b=a.i(779438),c=a.i(994060),d=a.i(304396);class e extends d.FlowGraphCachedOperationBlock{constructor(a){super(b.RichTypeAny,a),this.config=a,this.object=this.registerDataInput("object",b.RichTypeAny,a.object),this.propertyName=this.registerDataInput("propertyName",b.RichTypeAny,a.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",b.RichTypeAny)}_doOperation(a){let b,c=this.customGetFunction.getValue(a);if(c)b=c(this.object.getValue(a),this.propertyName.getValue(a),a);else{let c=this.object.getValue(a),d=this.propertyName.getValue(a);b=c&&d?this._getPropertyValue(c,d):void 0}return b}_getPropertyValue(a,b){let c=b.split("."),d=a;for(let a of c)if(void 0===(d=d[a]))return;return d}getClassName(){return"FlowGraphGetPropertyBlock"}}(0,c.RegisterClass)("FlowGraphGetPropertyBlock",e),a.s(["FlowGraphGetPropertyBlock",()=>e])},49223,a=>{"use strict";var b=a.i(625562);let c="colorCorrectionPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;varying vUV: vec2f;var colorTableSampler: sampler;var colorTable: texture_2d<f32>;const SLICE_COUNT: f32=16.0; 
fn sampleAs3DTexture(uv: vec3f,width: f32)->vec4f {var sliceSize: f32=1.0/width; 
var slicePixelSize: f32=sliceSize/width; 
var sliceInnerSize: f32=slicePixelSize*(width-1.0); 
var zSlice0: f32=min(floor(uv.z*width),width-1.0);var zSlice1: f32=min(zSlice0+1.0,width-1.0);var xOffset: f32=slicePixelSize*0.5+uv.x*sliceInnerSize;var s0: f32=xOffset+(zSlice0*sliceSize);var s1: f32=xOffset+(zSlice1*sliceSize);var slice0Color: vec4f=textureSample(colorTable,colorTableSampler,vec2f(s0,uv.y));var slice1Color: vec4f=textureSample(colorTable,colorTableSampler,vec2f(s1,uv.y));var zOffset: f32=((uv.z*width)%(1.0));return mix(slice0Color,slice1Color,zOffset);}
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var screen_color: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);fragmentOutputs.color=sampleAs3DTexture(screen_color.rgb,SLICE_COUNT);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["colorCorrectionPixelShaderWGSL",0,{name:c,shader:d}])},383731,a=>{"use strict";var b=a.i(344611),c=a.i(779438),d=a.i(994060),e=a.i(210312);class f extends b.FlowGraphEventBlock{constructor(a){super(a),this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",c.RichTypeNumber),this.targetMesh=this.registerDataInput("targetMesh",c.RichTypeAny,a?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",c.RichTypeAny)}_executeEvent(a,b){let c=this.targetMesh.getValue(a);return this.meshOutOfPointer.setValue(b.mesh,a),this.pointerId.setValue(b.pointerId,a),!(!(b.over&&(0,e._IsDescendantOf)(b.mesh,c))&&(b.mesh===c||(0,e._IsDescendantOf)(b.mesh,c)))||(this._execute(a),!this.config?.stopPropagation)}_preparePendingTasks(a){}_cancelPendingTasks(a){}getClassName(){return"FlowGraphPointerOutEventBlock"}}(0,d.RegisterClass)("FlowGraphPointerOutEventBlock",f),a.s(["FlowGraphPointerOutEventBlock",()=>f])},218589,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererFinaliserPixelShader",d=`precision highp float;varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D maskTextureSampler;uniform vec2 textureSize;void main() {vec4 mask=texture2D(maskTextureSampler,vUV).rgba;if (mask.r>0.5) {gl_FragColor=texture2D(textureSampler,vUV);} else {vec2 texelSize=4.0/textureSize;vec2 uv_p01=vUV+vec2(-1.0,0.0)*texelSize;vec2 uv_p21=vUV+vec2(1.0,0.0)*texelSize;vec2 uv_p10=vUV+vec2(0.0,-1.0)*texelSize;vec2 uv_p12=vUV+vec2(0.0,1.0)*texelSize;float mask_p01=texture2D(maskTextureSampler,uv_p01).r;float mask_p21=texture2D(maskTextureSampler,uv_p21).r;float mask_p10=texture2D(maskTextureSampler,uv_p10).r;float mask_p12=texture2D(maskTextureSampler,uv_p12).r;vec4 col=vec4(0.0,0.0,0.0,0.0);float total_weight=0.0;if (mask_p01>0.5) {col+=texture2D(textureSampler,uv_p01);total_weight+=1.0;}
if (mask_p21>0.5) {col+=texture2D(textureSampler,uv_p21);total_weight+=1.0;}
if (mask_p10>0.5) {col+=texture2D(textureSampler,uv_p10);total_weight+=1.0;}
if (mask_p12>0.5) {col+=texture2D(textureSampler,uv_p12);total_weight+=1.0;}
if (total_weight>0.0) {gl_FragColor=col/total_weight;} else {gl_FragColor=col;}}}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["meshUVSpaceRendererFinaliserPixelShader",0,{name:c,shader:d}])},448701,a=>{"use strict";var b=a.i(779438),c=a.i(542693),d=a.i(994060);class e extends c.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.count=this.registerDataInput("count",b.RichTypeNumber),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",b.RichTypeNumber)}_execute(a,b){if(b===this.reset)return void a._setExecutionVariable(this,"debounceCount",0);let c=this.count.getValue(a),d=a._getExecutionVariable(this,"debounceCount",0)+1;this.currentCount.setValue(d,a),a._setExecutionVariable(this,"debounceCount",d),d>=c&&(this.out._activateSignal(a),a._setExecutionVariable(this,"debounceCount",0))}getClassName(){return"FlowGraphDebounceBlock"}}(0,d.RegisterClass)("FlowGraphDebounceBlock",e),a.s(["FlowGraphDebounceBlock",()=>e])},897420,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(937034),a.i(643926),a.i(306169),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163);let c="pickingVertexShader",d=`attribute vec3 position;
#if defined(INSTANCES)
attribute float instanceMeshID;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform mat4 viewProjection;
#if defined(INSTANCES)
flat varying float vMeshID;
#endif
void main(void) {
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;
#if defined(INSTANCES)
vMeshID=instanceMeshID;
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["pickingVertexShader",0,{name:c,shader:d}])},342184,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060),e=a.i(419809),f=a.i(210312);class g extends b.FlowGraphBlock{constructor(a){super(a),this.config=a,this.array=this.registerDataInput("array",c.RichTypeAny),this.index=this.registerDataInput("index",c.RichTypeAny,new e.FlowGraphInteger(-1)),this.value=this.registerDataOutput("value",c.RichTypeAny)}_updateOutputs(a){let b=this.array.getValue(a),c=(0,f.getNumericValue)(this.index.getValue(a));b&&c>=0&&c<b.length?this.value.setValue(b[c],a):this.value.setValue(null,a)}serialize(a){super.serialize(a)}getClassName(){return"FlowGraphArrayIndexBlock"}}(0,d.RegisterClass)("FlowGraphArrayIndexBlock",g),a.s(["FlowGraphArrayIndexBlock",()=>g])},247381,a=>{"use strict";var b=a.i(625562);let c="depthOfFieldMergePixelShader",d=`#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define TEXTUREFUNC(s,c,lod) texture2DLodEXT(s,c,lod)
#else
#define TEXTUREFUNC(s,c,bias) texture2D(s,c,bias)
#endif
uniform sampler2D textureSampler;varying vec2 vUV;uniform sampler2D circleOfConfusionSampler;uniform sampler2D blurStep0;
#if BLUR_LEVEL>0
uniform sampler2D blurStep1;
#endif
#if BLUR_LEVEL>1
uniform sampler2D blurStep2;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float coc=TEXTUREFUNC(circleOfConfusionSampler,vUV,0.0).r;
#if BLUR_LEVEL==0
vec4 original=TEXTUREFUNC(textureSampler,vUV,0.0);vec4 blurred0=TEXTUREFUNC(blurStep0,vUV,0.0);gl_FragColor=mix(original,blurred0,coc);
#endif
#if BLUR_LEVEL==1
if(coc<0.5){vec4 original=TEXTUREFUNC(textureSampler,vUV,0.0);vec4 blurred1=TEXTUREFUNC(blurStep1,vUV,0.0);gl_FragColor=mix(original,blurred1,coc/0.5);}else{vec4 blurred0=TEXTUREFUNC(blurStep0,vUV,0.0);vec4 blurred1=TEXTUREFUNC(blurStep1,vUV,0.0);gl_FragColor=mix(blurred1,blurred0,(coc-0.5)/0.5);}
#endif
#if BLUR_LEVEL==2
if(coc<0.33){vec4 original=TEXTUREFUNC(textureSampler,vUV,0.0);vec4 blurred2=TEXTUREFUNC(blurStep2,vUV,0.0);gl_FragColor=mix(original,blurred2,coc/0.33);}else if(coc<0.66){vec4 blurred1=TEXTUREFUNC(blurStep1,vUV,0.0);vec4 blurred2=TEXTUREFUNC(blurStep2,vUV,0.0);gl_FragColor=mix(blurred2,blurred1,(coc-0.33)/0.33);}else{vec4 blurred0=TEXTUREFUNC(blurStep0,vUV,0.0);vec4 blurred1=TEXTUREFUNC(blurStep1,vUV,0.0);gl_FragColor=mix(blurred1,blurred0,(coc-0.66)/0.34);}
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["depthOfFieldMergePixelShader",0,{name:c,shader:d}])},2538,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060);class e extends b.FlowGraphBlock{constructor(a){super(a),this.config=a,this.value=this.registerDataOutput("value",c.RichTypeAny,a.initialValue)}_updateOutputs(a){let b=this.config.variable;a.hasVariable(b)&&this.value.setValue(a.getVariable(b),a)}serialize(a){super.serialize(a),a.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}(0,d.RegisterClass)("FlowGraphGetVariableBlock",e),a.s(["FlowGraphGetVariableBlock",()=>e])},204852,a=>{"use strict";var b=a.i(625562);let c="iblShadowGBufferDebugPixelShader",d=`#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D depthSampler;uniform sampler2D normalSampler;uniform sampler2D positionSampler;uniform sampler2D velocitySampler;uniform vec4 sizeParams;uniform float maxDepth;
#define offsetX sizeParams.x
#define offsetY sizeParams.y
#define widthScale sizeParams.z
#define heightScale sizeParams.w
void main(void) {vec2 uv =
vec2((offsetX+vUV.x)*widthScale,(offsetY+vUV.y)*heightScale);vec4 backgroundColour=texture2D(textureSampler,vUV).rgba;vec4 depth=texture2D(depthSampler,vUV);vec4 worldNormal=texture2D(normalSampler,vUV);vec4 worldPosition=texture2D(positionSampler,vUV);vec4 velocityLinear=texture2D(velocitySampler,vUV);if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {gl_FragColor.rgba=backgroundColour;} else {gl_FragColor.a=1.0;if (uv.x<=0.25) {gl_FragColor.rgb=depth.rgb;gl_FragColor.a=1.0;} else if (uv.x<=0.5) {velocityLinear.rg=velocityLinear.rg*0.5+0.5;gl_FragColor.rgb=velocityLinear.rgb;} else if (uv.x<=0.75) {gl_FragColor.rgb=worldPosition.rgb;} else {gl_FragColor.rgb=worldNormal.rgb;}}}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblShadowGBufferDebugPixelShader",0,{name:c,shader:d}])},502036,a=>{"use strict";var b=a.i(625562);let c="rsmFullGlobalIlluminationPixelShader",d=`/**
* The implementation is a direct application of the formula found in http:
*/
precision highp float;varying vec2 vUV;uniform mat4 rsmLightMatrix;uniform vec4 rsmInfo;uniform sampler2D textureSampler;uniform sampler2D normalSampler;uniform sampler2D rsmPositionW;uniform sampler2D rsmNormalW;uniform sampler2D rsmFlux;
#ifdef TRANSFORM_NORMAL
uniform mat4 invView;
#endif
vec3 computeIndirect(vec3 p,vec3 n) {vec3 indirectDiffuse=vec3(0.);float intensity=rsmInfo.z;float edgeArtifactCorrection=rsmInfo.w;vec4 texRSM=rsmLightMatrix*vec4(p,1.);texRSM.xy/=texRSM.w;texRSM.xy=texRSM.xy*0.5+0.5;int width=int(rsmInfo.x);int height=int(rsmInfo.y);for (int j=0; j<height; j++) {for (int i=0; i<width; i++) {ivec2 uv=ivec2(i,j);vec3 vplPositionW=texelFetch(rsmPositionW,uv,0).xyz;vec3 vplNormalW=texelFetch(rsmNormalW,uv,0).xyz*2.0-1.0;vec3 vplFlux=texelFetch(rsmFlux,uv,0).rgb;vplPositionW-=vplNormalW*edgeArtifactCorrection; 
float dist2=dot(vplPositionW-p,vplPositionW-p);indirectDiffuse+=vplFlux*max(0.,dot(n,vplPositionW-p))*max(0.,dot(vplNormalW,p-vplPositionW))/(dist2*dist2);}}
return clamp(indirectDiffuse*intensity,0.0,1.0);}
void main(void) 
{vec3 positionW=texture2D(textureSampler,vUV).xyz;vec3 normalW=texture2D(normalSampler,vUV).xyz;
#ifdef DECODE_NORMAL
normalW=normalW*2.0-1.0;
#endif
#ifdef TRANSFORM_NORMAL
normalW=(invView*vec4(normalW,0.)).xyz;
#endif
gl_FragColor.rgb=computeIndirect(positionW,normalW);gl_FragColor.a=1.0;}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["rsmFullGlobalIlluminationPixelShader",0,{name:c,shader:d}])},13179,a=>{"use strict";var b=a.i(625562);a.i(463068),a.i(136983),a.i(51308),a.i(227387);let c="hdrIrradianceFilteringPixelShader",d=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;
#ifdef IBL_CDF_FILTERING
var icdfTextureSampler: sampler;var icdfTexture: texture_2d<f32>;
#endif
uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=irradiance(inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo,0.0,vec3f(1.0),input.direction
#ifdef IBL_CDF_FILTERING
,icdfTexture,icdfTextureSampler
#endif
);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["hdrIrradianceFilteringPixelShaderWGSL",0,{name:c,shader:d}])},927528,a=>{"use strict";var b=a.i(625562);let c="tonemapPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform float _ExposureAdjustment;
#if defined(HABLE_TONEMAPPING)
const float A=0.15;const float B=0.50;const float C=0.10;const float D=0.20;const float E=0.02;const float F=0.30;const float W=11.2;
#endif
float Luminance(vec3 c)
{return dot(c,vec3(0.22,0.707,0.071));}
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{vec3 colour=texture2D(textureSampler,vUV).rgb;
#if defined(REINHARD_TONEMAPPING)
float lum=Luminance(colour.rgb); 
float lumTm=lum*_ExposureAdjustment;float scale=lumTm/(1.0+lumTm); 
colour*=scale/lum;
#elif defined(HABLE_TONEMAPPING)
colour*=_ExposureAdjustment;const float ExposureBias=2.0;vec3 x=ExposureBias*colour;vec3 curr=((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;x=vec3(W,W,W);vec3 whiteScale=1.0/(((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F);colour=curr*whiteScale;
#elif defined(OPTIMIZED_HEJIDAWSON_TONEMAPPING)
colour*=_ExposureAdjustment;vec3 X=max(vec3(0.0,0.0,0.0),colour-0.004);vec3 retColor=(X*(6.2*X+0.5))/(X*(6.2*X+1.7)+0.06);colour=retColor*retColor;
#elif defined(PHOTOGRAPHIC_TONEMAPPING)
colour= vec3(1.0,1.0,1.0)-exp2(-_ExposureAdjustment*colour);
#endif
gl_FragColor=vec4(colour.rgb,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["tonemapPixelShader",0,{name:c,shader:d}])},32073,a=>{"use strict";var b=a.i(625562);let c="screenSpaceCurvaturePixelShader",d=`precision highp float;varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D normalSampler;uniform float curvature_ridge;uniform float curvature_valley;
#ifndef CURVATURE_OFFSET
#define CURVATURE_OFFSET 1
#endif
float curvature_soft_clamp(float curvature,float control)
{if (curvature<0.5/control)
return curvature*(1.0-curvature*control);return 0.25/control;}
float calculate_curvature(ivec2 texel,float ridge,float valley)
{vec2 normal_up =texelFetch(normalSampler,texel+ivec2(0, CURVATURE_OFFSET),0).rb;vec2 normal_down =texelFetch(normalSampler,texel+ivec2(0,-CURVATURE_OFFSET),0).rb;vec2 normal_left =texelFetch(normalSampler,texel+ivec2(-CURVATURE_OFFSET,0),0).rb;vec2 normal_right=texelFetch(normalSampler,texel+ivec2( CURVATURE_OFFSET,0),0).rb;float normal_diff=((normal_up.g-normal_down.g)+(normal_right.r-normal_left.r));if (normal_diff<0.0)
return -2.0*curvature_soft_clamp(-normal_diff,valley);return 2.0*curvature_soft_clamp(normal_diff,ridge);}
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{ivec2 texel=ivec2(gl_FragCoord.xy);vec4 baseColor=texture2D(textureSampler,vUV);float curvature=calculate_curvature(texel,curvature_ridge,curvature_valley);baseColor.rgb*=curvature+1.0;gl_FragColor=baseColor;}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["screenSpaceCurvaturePixelShader",0,{name:c,shader:d}])},784812,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060),e=a.i(419809);class f extends b.FlowGraphBlock{constructor(a){super(a),this.config=a,this.object=this.registerDataInput("object",c.RichTypeAny),this.array=this.registerDataInput("array",c.RichTypeAny),this.index=this.registerDataOutput("index",c.RichTypeFlowGraphInteger,new e.FlowGraphInteger(-1))}_updateOutputs(a){let b=this.object.getValue(a),c=this.array.getValue(a);c&&this.index.setValue(new e.FlowGraphInteger(c.indexOf(b)),a)}serialize(a){super.serialize(a)}getClassName(){return"FlowGraphIndexOfBlock"}}(0,d.RegisterClass)("FlowGraphIndexOfBlock",f),a.s(["FlowGraphIndexOfBlock",()=>f])},699105,a=>{"use strict";var b=a.i(625562);let c="iblVoxelGrid3dDebugPixelShader",d=`precision highp sampler3D;varying vec2 vUV;uniform sampler3D voxelTexture;uniform sampler2D voxelSlabTexture;uniform sampler2D textureSampler;uniform vec4 sizeParams;
#define offsetX sizeParams.x
#define offsetY sizeParams.y
#define widthScale sizeParams.z
#define heightScale sizeParams.w
uniform float mipNumber;void main(void) {vec2 uv =
vec2((offsetX+vUV.x)*widthScale,(offsetY+vUV.y)*heightScale);vec4 background=texture2D(textureSampler,vUV);vec4 voxelSlab=texture2D(voxelSlabTexture,vUV);ivec3 size=textureSize(voxelTexture,int(mipNumber));float dimension=ceil(sqrt(float(size.z)));vec2 samplePos=fract(uv.xy*vec2(dimension));int sampleIndex=int(floor(uv.x*float(dimension)) +
floor(uv.y*float(dimension))*dimension);float mip_separator=0.0;if (samplePos.x<0.01 || samplePos.y<0.01) {mip_separator=1.0;}
bool outBounds=sampleIndex>size.z-1 ? true : false;sampleIndex=clamp(sampleIndex,0,size.z-1);ivec2 samplePosInt=ivec2(samplePos.xy*vec2(size.xy));vec3 voxel=texelFetch(voxelTexture,
ivec3(samplePosInt.x,samplePosInt.y,sampleIndex),
int(mipNumber))
.rgb;if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {gl_FragColor.rgba=background;} else {if (outBounds) {voxel=vec3(0.15,0.0,0.0);} else {if (voxel.r>0.001) {voxel.g=1.0;}
voxel.r+=mip_separator;}
glFragColor.rgb=mix(background.rgb,voxelSlab.rgb,voxelSlab.a)+voxel;glFragColor.a=1.0;}}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblVoxelGrid3dDebugPixelShader",0,{name:c,shader:d}])},256330,a=>{"use strict";var b=a.i(625562);let c="iblShadowSpatialBlurPixelShader",d=`precision highp sampler2D;
#define PI 3.1415927
varying vec2 vUV;uniform sampler2D depthSampler;uniform sampler2D worldNormalSampler;uniform sampler2D voxelTracingSampler;uniform vec4 blurParameters;
#define stridef blurParameters.x
#define worldScale blurParameters.y
const float weights[5]=float[5](0.0625,0.25,0.375,0.25,0.0625);const int nbWeights=5;vec2 max2(vec2 v,vec2 w) {return vec2(max(v.x,w.x),max(v.y,w.y));}
void main(void)
{vec2 gbufferRes=vec2(textureSize(depthSampler,0));ivec2 gbufferPixelCoord=ivec2(vUV*gbufferRes);vec2 shadowRes=vec2(textureSize(voxelTracingSampler,0));ivec2 shadowPixelCoord=ivec2(vUV*shadowRes);vec3 N=texelFetch(worldNormalSampler,gbufferPixelCoord,0).xyz;if (length(N)<0.01) {glFragColor=vec4(1.0,1.0,0.0,1.0);return;}
float depth=-texelFetch(depthSampler,gbufferPixelCoord,0).x;vec4 X=vec4(0.0);for(int y=0; y<nbWeights; ++y) {for(int x=0; x<nbWeights; ++x) {ivec2 gBufferCoords=gbufferPixelCoord+int(stridef)*ivec2(x-(nbWeights>>1),y-(nbWeights>>1));ivec2 shadowCoords=shadowPixelCoord+int(stridef)*ivec2(x-(nbWeights>>1),y-(nbWeights>>1));vec4 T=texelFetch(voxelTracingSampler,shadowCoords,0);float ddepth=-texelFetch(depthSampler,gBufferCoords,0).x-depth;vec3 dN=texelFetch(worldNormalSampler,gBufferCoords,0).xyz-N;float w=weights[x]*weights[y] *
exp2(max(-1000.0/(worldScale*worldScale),-0.5) *
(ddepth*ddepth) -
1e1*dot(dN,dN));X+=vec4(w*T.x,w*T.y,w*T.z,w);}}
gl_FragColor=vec4(X.x/X.w,X.y/X.w,X.z/X.w,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblShadowSpatialBlurPixelShader",0,{name:c,shader:d}])},398832,a=>{"use strict";var b=a.i(625562);let c="greasedLinePixelShader",d=`precision highp float;uniform sampler2D grlColors;uniform float grlUseColors;uniform float grlUseDash;uniform float grlDashArray;uniform float grlDashOffset;uniform float grlDashRatio;uniform float grlVisibility;uniform float grlColorsWidth;uniform vec2 grl_colorModeAndColorDistributionType;uniform vec3 grlColor;varying float grlCounters;varying float grlColorPointer;void main() {float grlColorMode=grl_colorModeAndColorDistributionType.x;float grlColorDistributionType=grl_colorModeAndColorDistributionType.y;gl_FragColor=vec4(grlColor,1.);gl_FragColor.a=step(grlCounters,grlVisibility);if (gl_FragColor.a==0.) discard;if( grlUseDash==1. ){gl_FragColor.a=ceil(mod(grlCounters+grlDashOffset,grlDashArray)-(grlDashArray*grlDashRatio));if (gl_FragColor.a==0.) discard;}
if (grlUseColors==1.) {vec4 textureColor;if (grlColorDistributionType==COLOR_DISTRIBUTION_TYPE_LINE) { 
textureColor=texture2D(grlColors,vec2(grlCounters,0.),0.);} else {textureColor=texture2D(grlColors,vec2(grlColorPointer/grlColorsWidth,0.),0.);}
if (grlColorMode==COLOR_MODE_SET) {gl_FragColor=textureColor;} else if (grlColorMode==COLOR_MODE_ADD) {gl_FragColor+=textureColor;} else if (grlColorMode==COLOR_MODE_MULTIPLY) {gl_FragColor*=textureColor;}}}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["greasedLinePixelShader",0,{name:c,shader:d}])},568568,a=>{"use strict";var b=a.i(625562);let c="glowBlurPostProcessPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;uniform direction: vec2f;uniform blurWidth: f32;fn getLuminance(color: vec3f)->f32
{return dot(color, vec3f(0.2126,0.7152,0.0722));}
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var weights: array<f32 ,7>;weights[0]=0.05;weights[1]=0.1;weights[2]=0.2;weights[3]=0.3;weights[4]=0.2;weights[5]=0.1;weights[6]=0.05;var texelSize: vec2f= vec2f(1.0/uniforms.screenSize.x,1.0/uniforms.screenSize.y);var texelStep: vec2f=texelSize*uniforms.direction*uniforms.blurWidth;var start: vec2f=input.vUV-3.0*texelStep;var baseColor: vec4f= vec4f(0.,0.,0.,0.);var texelOffset: vec2f= vec2f(0.,0.);for (var i: i32=0; i<7; i++)
{var texel: vec4f=textureSample(textureSampler,textureSamplerSampler,start+texelOffset);baseColor=vec4f(baseColor.rgb,baseColor.a+texel.a*weights[i]);var luminance: f32=getLuminance(baseColor.rgb);var luminanceTexel: f32=getLuminance(texel.rgb);var choice: f32=step(luminanceTexel,luminance);baseColor=vec4f(choice*baseColor.rgb+(1.0-choice)*texel.rgb,baseColor.a);texelOffset+=texelStep;}
fragmentOutputs.color=baseColor;}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["glowBlurPostProcessPixelShaderWGSL",0,{name:c,shader:d}])},650528,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingBilateralBlurPixelShader",d=`uniform sampler2D textureSampler;uniform int maxFilterSize;uniform vec2 blurDir;uniform float projectedParticleConstant;uniform float depthThreshold;varying vec2 vUV;void main(void) {float depth=textureLod(textureSampler,vUV,0.).x;if (depth>=1e6 || depth<=0.) {glFragColor=vec4(vec3(depth),1.);return;}
int filterSize=min(maxFilterSize,int(ceil(projectedParticleConstant/depth)));float sigma=float(filterSize)/3.0;float two_sigma2=2.0*sigma*sigma;float sigmaDepth=depthThreshold/3.0;float two_sigmaDepth2=2.0*sigmaDepth*sigmaDepth;float sum=0.;float wsum=0.;float sumVel=0.;for (int x=-filterSize; x<=filterSize; ++x) {vec2 coords=vec2(x);vec2 sampleDepthVel=textureLod(textureSampler,vUV+coords*blurDir,0.).rg;float r=dot(coords,coords);float w=exp(-r/two_sigma2);float rDepth=sampleDepthVel.r-depth;float wd=exp(-rDepth*rDepth/two_sigmaDepth2);sum+=sampleDepthVel.r*w*wd;sumVel+=sampleDepthVel.g*w*wd;wsum+=w*wd;}
glFragColor=vec4(sum/wsum,sumVel/wsum,0.,1.);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingBilateralBlurPixelShader",0,{name:c,shader:d}])},164388,a=>{"use strict";var b=a.i(625562);let c="boundingBoxRendererUboDeclaration",d=`#ifdef WEBGL2
uniform vec4 color;uniform mat4 world;uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#else
layout(std140,column_major) uniform;uniform BoundingBoxRenderer {vec4 color;mat4 world;mat4 viewProjection;mat4 viewProjectionR;};
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([])},758867,a=>{"use strict";var b=a.i(625562);let c="boundingBoxRendererFragmentDeclaration",d=`uniform vec4 color;
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(164388);let e="boundingBoxRendererPixelShader",f=`#include<__decl__boundingBoxRendererFragment>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[e]||(b.ShaderStore.ShadersStore[e]=f),a.s(["boundingBoxRendererPixelShader",0,{name:e,shader:f}],758867)},857692,a=>{"use strict";var b=a.i(16350);class c extends b.AbstractAudioOutNode{constructor(a,b){super(a,b,3)}}a.s(["AbstractAudioBus",()=>c])},638327,664601,a=>{"use strict";var b=a.i(857692);class c extends b.AbstractAudioBus{constructor(a,b){super(a,b)}}a.s(["MainAudioBus",()=>c],664601);var d=a.i(625080);class e extends c{constructor(a,b){super(a,b),this._subGraph=new e._SubGraph(this)}async _initAsync(a){if(await this._subGraph.initAsync(a),this.engine.mainOut&&!this._connect(this.engine.mainOut))throw Error("Connect failed");this.engine._addMainBus(this)}dispose(){super.dispose(),this.engine._removeMainBus(this)}get _inNode(){return this._subGraph._inNode}get _outNode(){return this._subGraph._outNode}_connect(a){return!!super._connect(a)&&(a._inNode&&this._outNode?.connect(a._inNode),!0)}_disconnect(a){return!!super._disconnect(a)&&(a._inNode&&this._outNode?.disconnect(a._inNode),!0)}getClassName(){return"_WebAudioMainBus"}}e._SubGraph=class extends d._WebAudioBaseSubGraph{get _downstreamNodes(){return this._owner._downstreamNodes??null}},a.s(["_WebAudioMainBus",()=>e],638327)},9414,a=>{"use strict";var b=a.i(542693),c=a.i(779438),d=a.i(994060),e=a.i(210312),f=a.i(419809);class g extends b.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.startIndex=this.registerDataInput("startIndex",c.RichTypeAny,0),this.endIndex=this.registerDataInput("endIndex",c.RichTypeAny),this.step=this.registerDataInput("step",c.RichTypeNumber,1),this.index=this.registerDataOutput("index",c.RichTypeFlowGraphInteger,new f.FlowGraphInteger((0,e.getNumericValue)(a?.initialIndex??0))),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(a){let b=(0,e.getNumericValue)(this.startIndex.getValue(a)),c=this.step.getValue(a),d=(0,e.getNumericValue)(this.endIndex.getValue(a));for(let h=b;h<d&&(this.index.setValue(new f.FlowGraphInteger(h),a),this.executionFlow._activateSignal(a),d=(0,e.getNumericValue)(this.endIndex.getValue(a)),!(h>g.MaxLoopIterations*c));h+=c);this.config?.incrementIndexWhenLoopDone&&this.index.setValue(new f.FlowGraphInteger((0,e.getNumericValue)(this.index.getValue(a))+c),a),this.completed._activateSignal(a)}getClassName(){return"FlowGraphForLoopBlock"}}g.MaxLoopIterations=1e3,(0,d.RegisterClass)("FlowGraphForLoopBlock",g),a.s(["FlowGraphForLoopBlock",()=>g])},764346,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(475114),a.i(549432),a.i(488049),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067);let c="pickingVertexShader",d=`attribute position: vec3f;
#if defined(INSTANCES)
attribute instanceMeshID: f32;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(INSTANCES)
flat varying vMeshID: f32;
#endif
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(input.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=input.instanceMeshID;
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["pickingVertexShaderWGSL",0,{name:c,shader:d}])},166670,a=>{"use strict";var b=a.i(38959),c=a.i(633619),d=a.i(470165),e=a.i(221553),f=a.i(736394);class g extends b.AbstractSoundSource{constructor(a,b,c,d){super(a,c,d),this._stereo=null,this._audioContext=this.engine._audioContext,this._webAudioNode=b,this._subGraph=new g._SubGraph(this)}async _initAsync(a){a.outBus?this.outBus=a.outBus:!1!==a.outBusAutoDefault&&(await this.engine.isReadyPromise,this.outBus=this.engine.defaultMainBus),await this._subGraph.initAsync(a),(0,c._HasSpatialAudioOptions)(a)&&this._initSpatialProperty(),this.engine._addNode(this)}get _inNode(){return this._webAudioNode}get _outNode(){return this._subGraph._outNode}get stereo(){return this._stereo??(this._stereo=new d._StereoAudio(this._subGraph))}dispose(){super.dispose(),this._stereo=null,this._subGraph.dispose(),this.engine._removeNode(this)}getClassName(){return"_WebAudioSoundSource"}_connect(a){return!!super._connect(a)&&(a._inNode&&this._outNode?.connect(a._inNode),!0)}_disconnect(a){return!!super._disconnect(a)&&(a._inNode&&this._outNode?.disconnect(a._inNode),!0)}_createSpatialProperty(a,b){return new f._SpatialWebAudio(this._subGraph,a,b)}}g._SubGraph=class extends e._WebAudioBusAndSoundSubGraph{get _downstreamNodes(){return this._owner._downstreamNodes??null}get _upstreamNodes(){return this._owner._upstreamNodes??null}_onSubNodesChanged(){super._onSubNodesChanged(),this._owner._inNode.disconnect(),this._owner._subGraph._inNode&&this._owner._inNode.connect(this._owner._subGraph._inNode)}},a.s(["_WebAudioSoundSource",()=>g])},303822,a=>{"use strict";var b=a.i(625562);a.i(435),a.i(196025),a.i(160815),a.i(463068),a.i(850492),a.i(842357),a.i(197011),a.i(410897),a.i(316972);let c="particlesPixelShader",d=`varying vUV: vec2f;varying vColor: vec4f;uniform textureMask: vec4f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#include<clipPlaneFragmentDeclaration>
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#ifdef RAMPGRADIENT
varying remapRanges: vec4f;var rampSamplerSampler: sampler;var rampSampler: texture_2d<f32>;
#endif
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var textureColor: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV);var baseColor: vec4f=(textureColor*uniforms.textureMask+( vec4f(1.,1.,1.,1.)-uniforms.textureMask))*input.vColor;
#ifdef RAMPGRADIENT
var alpha: f32=baseColor.a;var remappedColorIndex: f32=clamp((alpha-input.remapRanges.x)/input.remapRanges.y,0.0,1.0);var rampColor: vec4f=textureSample(rampSampler,rampSamplerSampler,vec2f(1.0-remappedColorIndex,0.));baseColor=vec4f(baseColor.rgb*rampColor.rgb,baseColor.a);var finalAlpha: f32=baseColor.a;baseColor.a=clamp((alpha*rampColor.a-input.remapRanges.z)/input.remapRanges.w,0.0,1.0);
#endif
#ifdef BLENDMULTIPLYMODE
var sourceAlpha: f32=input.vColor.a*textureColor.a;baseColor=vec4f(baseColor.rgb*sourceAlpha+ vec3f(1.0)*(1.0-sourceAlpha),baseColor.a);
#endif
#include<logDepthFragment>
#include<fogFragment>(color,baseColor)
#ifdef IMAGEPROCESSINGPOSTPROCESS
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);
#else
#ifdef IMAGEPROCESSING
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);baseColor=applyImageProcessing(baseColor);
#endif
#endif
fragmentOutputs.color=baseColor;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["particlesPixelShaderWGSL",0,{name:c,shader:d}])},189095,a=>{"use strict";var b=a.i(625562);let c="iblCdfDebugPixelShader",d=`precision highp samplerCube;
#define PI 3.1415927
varying vec2 vUV;uniform sampler2D cdfy;uniform sampler2D cdfx;uniform sampler2D icdf;uniform sampler2D pdf;
#ifdef IBL_USE_CUBE_MAP
uniform samplerCube iblSource;
#else
uniform sampler2D iblSource;
#endif
uniform sampler2D textureSampler;
#define cdfyVSize (0.8/3.0)
#define cdfxVSize 0.1
#define cdfyHSize 0.5
uniform vec4 sizeParams;
#define offsetX sizeParams.x
#define offsetY sizeParams.y
#define widthScale sizeParams.z
#define heightScale sizeParams.w
#ifdef IBL_USE_CUBE_MAP
vec3 equirectangularToCubemapDirection(vec2 uv) {float longitude=uv.x*2.0*PI-PI;float latitude=PI*0.5-uv.y*PI;vec3 direction;direction.x=cos(latitude)*sin(longitude);direction.y=sin(latitude);direction.z=cos(latitude)*cos(longitude);return direction;}
#endif
void main(void) {vec3 colour=vec3(0.0);vec2 uv =
vec2((offsetX+vUV.x)*widthScale,(offsetY+vUV.y)*heightScale);vec3 backgroundColour=texture2D(textureSampler,vUV).rgb;int cdfxWidth=textureSize(cdfx,0).x;int cdfyHeight=textureSize(cdfy,0).y;const float iblStart=1.0-cdfyVSize;const float pdfStart=1.0-2.0*cdfyVSize;const float cdfyStart=1.0-3.0*cdfyVSize;const float cdfxStart=1.0-3.0*cdfyVSize-cdfxVSize;const float icdfxStart=1.0-3.0*cdfyVSize-2.0*cdfxVSize;
#ifdef IBL_USE_CUBE_MAP
vec3 direction=equirectangularToCubemapDirection(
(uv-vec2(0.0,iblStart))*vec2(1.0,1.0/cdfyVSize));vec3 iblColour=textureCubeLodEXT(iblSource,direction,0.0).rgb;
#else
vec3 iblColour=texture2D(iblSource,(uv-vec2(0.0,iblStart)) *
vec2(1.0,1.0/cdfyVSize))
.rgb;
#endif
vec3 pdfColour=texture(icdf,(uv-vec2(0.0,pdfStart)) *
vec2(1.0,1.0/cdfyVSize)).zzz;float cdfyColour =
texture2D(cdfy,(uv-vec2(0.0,cdfyStart))*vec2(2.0,1.0/cdfyVSize))
.r;float icdfyColour =
texture2D(icdf,(uv-vec2(0.5,cdfyStart))*vec2(2.0,1.0/cdfyVSize))
.g;float cdfxColour =
texture2D(cdfx,(uv-vec2(0.0,cdfxStart))*vec2(1.0,1.0/cdfxVSize))
.r;float icdfxColour=texture2D(icdf,(uv-vec2(0.0,icdfxStart)) *
vec2(1.0,1.0/cdfxVSize))
.r;if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {colour=backgroundColour;} else if (uv.y>iblStart) {colour+=iblColour;} else if (uv.y>pdfStart) {colour+=pdfColour;} else if (uv.y>cdfyStart && uv.x<0.5) {colour.r+=cdfyColour/float(cdfyHeight);} else if (uv.y>cdfyStart && uv.x>0.5) {colour.r+=icdfyColour;} else if (uv.y>cdfxStart) {colour.r+=cdfxColour/float(cdfxWidth);} else if (uv.y>icdfxStart) {colour.r+=icdfxColour;}
gl_FragColor=vec4(colour,1.0);glFragColor.rgb=mix(gl_FragColor.rgb,backgroundColour,0.5);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblCdfDebugPixelShader",0,{name:c,shader:d}])},546777,a=>{"use strict";var b=a.i(625562);let c="iblShadowAccumulationPixelShader",d=`varying vUV: vec2f;uniform accumulationParameters: vec4f;
#define remanence uniforms.accumulationParameters.x
#define resetb uniforms.accumulationParameters.y
#define sceneSize uniforms.accumulationParameters.z
var motionSampler: texture_2d<f32>;var positionSampler: texture_2d<f32>;var spatialBlurSampler : texture_2d<f32>;var oldAccumulationSamplerSampler: sampler;var oldAccumulationSampler: texture_2d<f32>;var prevPositionSamplerSampler: sampler;var prevPositionSampler: texture_2d<f32>;fn max2(v: vec2f,w: vec2f)->vec2f { 
return vec2f(max(v.x,w.x),max(v.y,w.y)); }
fn lessThan(x: vec2f,y: vec2f)->vec2<bool> {return x<y;}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var reset: bool= bool(resetb);var gbufferRes : vec2f=vec2f(textureDimensions(positionSampler,0));var gbufferPixelCoord: vec2i= vec2i(input.vUV*gbufferRes);var shadowRes : vec2f=vec2f(textureDimensions(spatialBlurSampler,0));var shadowPixelCoord: vec2i= vec2i(input.vUV*shadowRes);var LP: vec4f=textureLoad(positionSampler,gbufferPixelCoord,0);if (0.0==LP.w) {fragmentOutputs.color=vec4f(1.0,0.0,0.0,1.0);return fragmentOutputs;}
var velocityColor: vec2f=textureLoad(motionSampler,gbufferPixelCoord,0).xy;var prevCoord: vec2f=input.vUV+velocityColor;var PrevLP: vec3f=textureSampleLevel(prevPositionSampler,prevPositionSamplerSampler,prevCoord,0.0).xyz;var PrevShadows: vec4f=textureSampleLevel(oldAccumulationSampler,oldAccumulationSamplerSampler,prevCoord,0.0);var newShadows : vec3f=textureLoad(spatialBlurSampler,shadowPixelCoord,0).xyz;PrevShadows.a=select(1.0,max(PrevShadows.a/(1.0+PrevShadows.a),1.0-remanence),!reset && all(lessThan(abs(prevCoord- vec2f(0.5)), vec2f(0.5))) &&
distance(LP.xyz,PrevLP)<5e-2*sceneSize);PrevShadows=max( vec4f(0.0),PrevShadows);fragmentOutputs.color= vec4f(mix(PrevShadows.x,newShadows.x,PrevShadows.a),
mix(PrevShadows.y,newShadows.y,PrevShadows.a),
mix(PrevShadows.z,newShadows.z,PrevShadows.a),PrevShadows.a);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblShadowAccumulationPixelShaderWGSL",0,{name:c,shader:d}])},466691,a=>{"use strict";var b=a.i(625562);a.i(463068),a.i(435),a.i(197011);let c="glowMapGenerationPixelShader",d=`#if defined(DIFFUSE_ISLINEAR) || defined(EMISSIVE_ISLINEAR)
#include<helperFunctions>
#endif
#ifdef DIFFUSE
varying vUVDiffuse: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#ifdef OPACITY
varying vUVOpacity: vec2f;var opacitySamplerSampler: sampler;var opacitySampler: texture_2d<f32>;uniform opacityIntensity: f32;
#endif
#ifdef EMISSIVE
varying vUVEmissive: vec2f;var emissiveSamplerSampler: sampler;var emissiveSampler: texture_2d<f32>;
#endif
#ifdef VERTEXALPHA
varying vColor: vec4f;
#endif
uniform glowColor: vec4f;uniform glowIntensity: f32;
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
var finalColor: vec4f=uniforms.glowColor;
#ifdef DIFFUSE
var albedoTexture: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUVDiffuse);
#ifdef DIFFUSE_ISLINEAR
albedoTexture=toGammaSpace(albedoTexture);
#endif
#ifdef GLOW
finalColor=vec4f(finalColor.rgb,finalColor.a*albedoTexture.a);
#endif
#ifdef HIGHLIGHT
finalColor=vec4f(finalColor.rgb,albedoTexture.a);
#endif
#endif
#ifdef OPACITY
var opacityMap: vec4f=textureSample(opacitySampler,opacitySamplerSampler,fragmentInputs.vUVOpacity);
#ifdef OPACITYRGB
finalColor=vec4f(finalColor.rgb,finalColor.a*getLuminance(opacityMap.rgb));
#else
finalColor=vec4f(finalColor.rgb,finalColor.a*opacityMap.a);
#endif
finalColor=vec4f(finalColor.rgb,finalColor.a*uniforms.opacityIntensity);
#endif
#ifdef VERTEXALPHA
finalColor=vec4f(finalColor.rgb,finalColor.a*fragmentInputs.vColor.a);
#endif
#ifdef ALPHATEST
if (finalColor.a<ALPHATESTVALUE) {discard;}
#endif
#ifdef EMISSIVE
var emissive: vec4f=textureSample(emissiveSampler,emissiveSamplerSampler,fragmentInputs.vUVEmissive);
#ifdef EMISSIVE_ISLINEAR
emissive=toGammaSpace(emissive);
#endif
fragmentOutputs.color=emissive*finalColor*uniforms.glowIntensity;
#else
fragmentOutputs.color=finalColor*uniforms.glowIntensity;
#endif
#ifdef HIGHLIGHT
fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb,uniforms.glowColor.a);
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["glowMapGenerationPixelShaderWGSL",0,{name:c,shader:d}])},832274,a=>{"use strict";var b=a.i(625562);let c="screenSpaceReflection2BlurPixelShader",d=`#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define TEXTUREFUNC(s,c,lod) texture2DLodEXT(s,c,lod)
#else
#define TEXTUREFUNC(s,c,bias) texture2D(s,c,bias)
#endif
uniform sampler2D textureSampler;varying vec2 vUV;uniform vec2 texelOffsetScale;const float weights[8]=float[8] (0.071303,0.131514,0.189879,0.321392,0.452906, 0.584419,0.715932,0.847445);void processSample(vec2 uv,float i,vec2 stepSize,inout vec4 accumulator,inout float denominator)
{vec2 offsetUV=stepSize*i+uv;float coefficient=weights[int(2.0-abs(i))];accumulator+=TEXTUREFUNC(textureSampler,offsetUV,0.0)*coefficient;denominator+=coefficient;}
void main()
{vec4 colorFull=TEXTUREFUNC(textureSampler,vUV,0.0);if (dot(colorFull,vec4(1.0))==0.0) {gl_FragColor=colorFull;return;}
float blurRadius=colorFull.a*255.0; 
vec2 stepSize=texelOffsetScale.xy*blurRadius;vec4 accumulator=TEXTUREFUNC(textureSampler,vUV,0.0)*0.214607;float denominator=0.214607;processSample(vUV,1.0,stepSize,accumulator,denominator);processSample(vUV,1.0*0.2,stepSize,accumulator,denominator);processSample(vUV,1.0*0.4,stepSize,accumulator,denominator);processSample(vUV,1.0*0.6,stepSize,accumulator,denominator);processSample(vUV,1.0*0.8,stepSize,accumulator,denominator);processSample(vUV,1.0*1.2,stepSize,accumulator,denominator);processSample(vUV,1.0*1.4,stepSize,accumulator,denominator);processSample(vUV,1.0*1.6,stepSize,accumulator,denominator);processSample(vUV,1.0*1.8,stepSize,accumulator,denominator);processSample(vUV,1.0*2.0,stepSize,accumulator,denominator);processSample(vUV,-1.0,stepSize,accumulator,denominator);processSample(vUV,-1.0*0.2,stepSize,accumulator,denominator);processSample(vUV,-1.0*0.4,stepSize,accumulator,denominator);processSample(vUV,-1.0*0.6,stepSize,accumulator,denominator);processSample(vUV,-1.0*0.8,stepSize,accumulator,denominator);processSample(vUV,-1.0*1.2,stepSize,accumulator,denominator);processSample(vUV,-1.0*1.4,stepSize,accumulator,denominator);processSample(vUV,-1.0*1.6,stepSize,accumulator,denominator);processSample(vUV,-1.0*1.8,stepSize,accumulator,denominator);processSample(vUV,-1.0*2.0,stepSize,accumulator,denominator);gl_FragColor=vec4(accumulator.rgb/denominator,colorFull.a);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["screenSpaceReflection2BlurPixelShader",0,{name:c,shader:d}])},60777,a=>{"use strict";var b=a.i(625562);let c="chromaticAberrationPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform chromatic_aberration: f32;uniform radialIntensity: f32;uniform direction: vec2f;uniform centerPosition: vec2f;uniform screen_width: f32;uniform screen_height: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var centered_screen_pos: vec2f= vec2f(input.vUV.x-uniforms.centerPosition.x,input.vUV.y-uniforms.centerPosition.y);var directionOfEffect: vec2f=uniforms.direction;if(directionOfEffect.x==0. && directionOfEffect.y==0.){directionOfEffect=normalize(centered_screen_pos);}
var radius2: f32=centered_screen_pos.x*centered_screen_pos.x
+ centered_screen_pos.y*centered_screen_pos.y;var radius: f32=sqrt(radius2);var ref_indices: vec3f= vec3f(-0.3,0.0,0.3);var ref_shiftX: f32=uniforms.chromatic_aberration*pow(radius,uniforms.radialIntensity)*directionOfEffect.x/uniforms.screen_width;var ref_shiftY: f32=uniforms.chromatic_aberration*pow(radius,uniforms.radialIntensity)*directionOfEffect.y/uniforms.screen_height;var ref_coords_r: vec2f=vec2f(input.vUV.x+ref_indices.r*ref_shiftX,input.vUV.y+ref_indices.r*ref_shiftY*0.5);var ref_coords_g: vec2f=vec2f(input.vUV.x+ref_indices.g*ref_shiftX,input.vUV.y+ref_indices.g*ref_shiftY*0.5);var ref_coords_b: vec2f=vec2f(input.vUV.x+ref_indices.b*ref_shiftX,input.vUV.y+ref_indices.b*ref_shiftY*0.5);var r=textureSample(textureSampler,textureSamplerSampler,ref_coords_r);var g=textureSample(textureSampler,textureSamplerSampler,ref_coords_g);var b=textureSample(textureSampler,textureSamplerSampler,ref_coords_b);var a=clamp(r.a+g.a+b.a,0.,1.);fragmentOutputs.color=vec4f(r.r,g.g,b.b,a);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["chromaticAberrationPixelShaderWGSL",0,{name:c,shader:d}])},704594,a=>{"use strict";var b=a.i(542693),c=a.i(779438),d=a.i(994060);class e extends b.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.config=a,this.object=this.registerDataInput("object",c.RichTypeAny,a.target),this.value=this.registerDataInput("value",c.RichTypeAny),this.propertyName=this.registerDataInput("propertyName",c.RichTypeAny,a.propertyName),this.customSetFunction=this.registerDataInput("customSetFunction",c.RichTypeAny)}_execute(a,b){try{let b=this.object.getValue(a),c=this.value.getValue(a),d=this.propertyName.getValue(a);this._stopRunningAnimations(a,b,d);let e=this.customSetFunction.getValue(a);e?e(b,d,c,a):this._setPropertyValue(b,d,c)}catch(b){this._reportError(a,b)}this.out._activateSignal(a)}_stopRunningAnimations(a,b,c){let d=a._getGlobalContextVariable("currentlyRunningAnimationGroups",[]);for(let e of d){let f=a.assetsContext.animationGroups.find(a=>a.uniqueId===e);if(f){for(let g of f.targetedAnimations)if(g.target===b&&g.animation.targetProperty===c){f.stop(!0),f.dispose();let b=d.indexOf(e);-1!==b&&(d.splice(b,1),a._setGlobalContextVariable("currentlyRunningAnimationGroups",d))}}}}_setPropertyValue(a,b,c){let d=b.split("."),e=a;for(let a=0;a<d.length-1;a++){let b=d[a];void 0===e[b]&&(e[b]={}),e=e[b]}e[d[d.length-1]]=c}getClassName(){return"FlowGraphSetPropertyBlock"}}(0,d.RegisterClass)("FlowGraphSetPropertyBlock",e),a.s(["FlowGraphSetPropertyBlock",()=>e])},960805,a=>{"use strict";var b=a.i(625562);a.i(681682),a.i(160721),a.i(544248),a.i(964653),a.i(645308),a.i(972930),a.i(874402),a.i(430783),a.i(384701);let c="particlesPixelShader",d=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
varying vec2 vUV;varying vec4 vColor;uniform vec4 textureMask;uniform sampler2D diffuseSampler;
#include<clipPlaneFragmentDeclaration>
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#ifdef RAMPGRADIENT
varying vec4 remapRanges;uniform sampler2D rampSampler;
#endif
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec4 textureColor=texture2D(diffuseSampler,vUV);vec4 baseColor=(textureColor*textureMask+(vec4(1.,1.,1.,1.)-textureMask))*vColor;
#ifdef RAMPGRADIENT
float alpha=baseColor.a;float remappedColorIndex=clamp((alpha-remapRanges.x)/remapRanges.y,0.0,1.0);vec4 rampColor=texture2D(rampSampler,vec2(1.0-remappedColorIndex,0.));baseColor.rgb*=rampColor.rgb;float finalAlpha=baseColor.a;baseColor.a=clamp((alpha*rampColor.a-remapRanges.z)/remapRanges.w,0.0,1.0);
#endif
#ifdef BLENDMULTIPLYMODE
float sourceAlpha=vColor.a*textureColor.a;baseColor.rgb=baseColor.rgb*sourceAlpha+vec3(1.0)*(1.0-sourceAlpha);
#endif
#include<logDepthFragment>
#include<fogFragment>(color,baseColor)
#ifdef IMAGEPROCESSINGPOSTPROCESS
baseColor.rgb=toLinearSpace(baseColor.rgb);
#else
#ifdef IMAGEPROCESSING
baseColor.rgb=toLinearSpace(baseColor.rgb);baseColor=applyImageProcessing(baseColor);
#endif
#endif
gl_FragColor=baseColor;
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["particlesPixelShader",0,{name:c,shader:d}])},174179,a=>{"use strict";var b=a.i(159695),c=a.i(779438),d=a.i(994060),e=a.i(210312);class f extends b.FlowGraphExecutionBlock{constructor(a){for(const b of(super(a),this.config=a,this.default=this._registerSignalOutput("default"),this._caseToOutputFlow=new Map,this.case=this.registerDataInput("case",c.RichTypeAny),this.config.cases||[]))this._caseToOutputFlow.set(b,this._registerSignalOutput(`out_${b}`))}_execute(a,b){let c,d=this.case.getValue(a);(c=(0,e.isNumeric)(d)?this._getOutputFlowForCase((0,e.getNumericValue)(d)):this._getOutputFlowForCase(d))?c._activateSignal(a):this.default._activateSignal(a)}addCase(a){this.config.cases.includes(a)||(this.config.cases.push(a),this._caseToOutputFlow.set(a,this._registerSignalOutput(`out_${a}`)))}removeCase(a){if(!this.config.cases.includes(a))return;let b=this.config.cases.indexOf(a);this.config.cases.splice(b,1),this._caseToOutputFlow.delete(a)}_getOutputFlowForCase(a){return this._caseToOutputFlow.get(a)}getClassName(){return"FlowGraphSwitchBlock"}serialize(a){super.serialize(a),a.cases=this.config.cases}}(0,d.RegisterClass)("FlowGraphSwitchBlock",f),a.s(["FlowGraphSwitchBlock",()=>f])},170688,a=>{"use strict";var b=a.i(625562);let c="motionBlurPixelShader",d=`varying vec2 vUV;uniform sampler2D textureSampler;uniform float motionStrength;uniform float motionScale;uniform vec2 screenSize;
#ifdef OBJECT_BASED
uniform sampler2D velocitySampler;
#else
uniform sampler2D depthSampler;uniform mat4 inverseViewProjection;uniform mat4 prevViewProjection;uniform mat4 projection;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#ifdef GEOMETRY_SUPPORTED
#ifdef OBJECT_BASED
vec2 texelSize=1.0/screenSize;vec4 velocityColor=textureLod(velocitySampler,vUV,0.0);velocityColor.rg=velocityColor.rg*2.0-vec2(1.0);vec2 signs=sign(velocityColor.rg);vec2 velocity=pow(abs(velocityColor.rg),vec2(3.0))*signs*velocityColor.a;velocity*=motionScale*motionStrength;float speed=length(velocity/texelSize);int samplesCount=int(clamp(speed,1.0,SAMPLES));velocity=normalize(velocity)*texelSize;float hlim=float(-samplesCount)*0.5+0.5;vec4 result=textureLod(textureSampler,vUV,0.0);for (int i=1; i<int(SAMPLES); ++i)
{if (i>=samplesCount)
break;vec2 offset=vUV+velocity*(hlim+float(i));result+=textureLod(textureSampler,offset,0.0);}
gl_FragColor=result/float(samplesCount);gl_FragColor.a=1.0;
#else
vec4 result=textureLod(textureSampler,vUV,0.0);vec2 texelSize=1.0/screenSize;float depth=textureLod(depthSampler,vUV,0.0).r;if (depth==0.0) {gl_FragColor=result;return;}
depth=projection[2].z+projection[3].z/depth; 
vec4 cpos=vec4(vUV*2.0-1.0,depth,1.0);cpos=inverseViewProjection*cpos;cpos/=cpos.w;vec4 ppos=prevViewProjection*cpos;ppos/=ppos.w;ppos.xy=ppos.xy*0.5+0.5;vec2 velocity=(ppos.xy-vUV)*motionScale*motionStrength;float speed=length(velocity/texelSize);int nSamples=int(clamp(speed,1.0,SAMPLES));for (int i=1; i<int(SAMPLES); ++i) {if (i>=nSamples)
break;vec2 offset1=vUV+velocity*(float(i)/float(nSamples-1)-0.5);result+=textureLod(textureSampler,offset1,0.0);}
gl_FragColor=result/float(nSamples);
#endif
#else
gl_FragColor=texture2D(textureSampler,vUV);
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["motionBlurPixelShader",0,{name:c,shader:d}])},895218,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(475114),a.i(549432),a.i(488049),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067);let c="meshUVSpaceRendererVertexShader",d=`attribute position: vec3f;attribute normal: vec3f;attribute uv: vec2f;uniform projMatrix: mat4x4f;varying vDecalTC: vec2f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=input.position;var normalUpdated: vec3f=input.normal;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);var normWorldSM: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);var vNormalW: vec3f;
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vNormalW=normalUpdated/ vec3f(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vNormalW=normalize(normWorldSM*normalUpdated);
#endif
var normalView: vec3f=normalize((uniforms.projMatrix* vec4f(vNormalW,0.0)).xyz);var decalTC: vec3f=(uniforms.projMatrix*worldPos).xyz;vertexOutputs.vDecalTC=decalTC.xy;vertexOutputs.position=vec4f(input.uv*2.0-1.0,select(decalTC.z,2.,normalView.z>0.0),1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["meshUVSpaceRendererVertexShaderWGSL",0,{name:c,shader:d}])},434964,a=>{"use strict";var b=a.i(625562);let c="depthOfFieldMergePixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var circleOfConfusionSamplerSampler: sampler;var circleOfConfusionSampler: texture_2d<f32>;var blurStep0Sampler: sampler;var blurStep0: texture_2d<f32>;
#if BLUR_LEVEL>0
var blurStep1Sampler: sampler;var blurStep1: texture_2d<f32>;
#endif
#if BLUR_LEVEL>1
var blurStep2Sampler: sampler;var blurStep2: texture_2d<f32>;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var coc: f32=textureSampleLevel(circleOfConfusionSampler,circleOfConfusionSamplerSampler,input.vUV,0.0).r;
#if BLUR_LEVEL==0
var original: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0);var blurred0: vec4f=textureSampleLevel(blurStep0,blurStep0Sampler,input.vUV,0.0);fragmentOutputs.color=mix(original,blurred0,coc);
#endif
#if BLUR_LEVEL==1
if(coc<0.5){var original: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0);var blurred1: vec4f=textureSampleLevel(blurStep1,blurStep1Sampler,input.vUV,0.0);fragmentOutputs.color=mix(original,blurred1,coc/0.5);}else{var blurred0: vec4f=textureSampleLevel(blurStep0,blurStep0Sampler,input.vUV,0.0);var blurred1: vec4f=textureSampleLevel(blurStep1,blurStep1Sampler,input.vUV,0.0);fragmentOutputs.color=mix(blurred1,blurred0,(coc-0.5)/0.5);}
#endif
#if BLUR_LEVEL==2
if(coc<0.33){var original: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0);var blurred2: vec4f=textureSampleLevel(blurStep2,blurStep2Sampler,input.vUV,0.0);fragmentOutputs.color=mix(original,blurred2,coc/0.33);}else if(coc<0.66){var blurred1: vec4f=textureSampleLevel(blurStep1,blurStep1Sampler,input.vUV,0.0);var blurred2: vec4f=textureSampleLevel(blurStep2,blurStep2Sampler,input.vUV,0.0);fragmentOutputs.color=mix(blurred2,blurred1,(coc-0.33)/0.33);}else{var blurred0: vec4f=textureSampleLevel(blurStep0,blurStep0Sampler,input.vUV,0.0);var blurred1: vec4f=textureSampleLevel(blurStep1,blurStep1Sampler,input.vUV,0.0);fragmentOutputs.color=mix(blurred1,blurred0,(coc-0.66)/0.34);}
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["depthOfFieldMergePixelShaderWGSL",0,{name:c,shader:d}])},13316,a=>{"use strict";var b=a.i(625562);let c="iblShadowGBufferDebugPixelShader",d=`varying vUV : vec2f;var textureSamplerSampler : sampler;var textureSampler : texture_2d<f32>;var depthSamplerSampler : sampler;var depthSampler : texture_2d<f32>;var normalSamplerSampler : sampler;var normalSampler : texture_2d<f32>;var positionSamplerSampler : sampler;var positionSampler : texture_2d<f32>;var velocitySamplerSampler : sampler;var velocitySampler : texture_2d<f32>;uniform sizeParams : vec4f;
#define offsetX uniforms.sizeParams.x
#define offsetY uniforms.sizeParams.y
#define widthScale uniforms.sizeParams.z
#define heightScale uniforms.sizeParams.w
@fragment fn main(input : FragmentInputs)->FragmentOutputs {var uv : vec2f=
vec2f((offsetX+input.vUV.x)*widthScale,(offsetY+input.vUV.y)*heightScale);var backgroundColour: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV).rgba;var depth : vec4f=textureSample(depthSampler,depthSamplerSampler,input.vUV);var worldNormal: vec4f=textureSample(normalSampler,normalSamplerSampler,input.vUV);var worldPosition : vec4f=textureSample(positionSampler,positionSamplerSampler,input.vUV);var velocityLinear : vec4f=textureSample(velocitySampler,velocitySamplerSampler,input.vUV);if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {fragmentOutputs.color=backgroundColour;} else {if (uv.x<=0.25) {fragmentOutputs.color=vec4f(depth.rgb,1.0);} else if (uv.x<=0.5) {velocityLinear =
vec4f(velocityLinear.r*0.5+0.5,velocityLinear.g*0.5+0.5,
velocityLinear.b,velocityLinear.a);fragmentOutputs.color=vec4f(velocityLinear.rgb,1.0);} else if (uv.x<=0.75) {fragmentOutputs.color=vec4f(worldPosition.rgb,1.0);} else {fragmentOutputs.color=vec4f(worldNormal.rgb,1.0);}}}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblShadowGBufferDebugPixelShaderWGSL",0,{name:c,shader:d}])},804707,a=>{"use strict";var b=a.i(625562);a.i(681682),a.i(544248),a.i(972930),a.i(430783),a.i(384701);let c="gaussianSplattingFragmentDeclaration",d=`vec4 gaussianColor(vec4 inColor)
{float A=-dot(vPosition,vPosition);if (A<-4.0) discard;float B=exp(A)*inColor.a;
#include<logDepthFragment>
vec3 color=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4(color,B);}
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(874402);let e="gaussianSplattingPixelShader",f=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vec4 vColor;varying vec2 vPosition;
#include<gaussianSplattingFragmentDeclaration>
void main () { 
#include<clipPlaneFragment>
gl_FragColor=gaussianColor(vColor);}
`;b.ShaderStore.ShadersStore[e]||(b.ShaderStore.ShadersStore[e]=f),a.s(["gaussianSplattingPixelShader",0,{name:e,shader:f}],804707)},68460,a=>{"use strict";var b=a.i(625562);let c="bilateralBlurPixelShader",d=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var normalSamplerSampler: sampler;var normalSampler: texture_2d<f32>;var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;uniform filterSize: i32;uniform blurDir: vec2f;uniform depthThreshold: f32;uniform normalThreshold: f32;varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.).rgb;var depth: f32=textureSampleLevel(depthSampler,depthSamplerSampler,input.vUV,0.).x;if (depth>=1e6 || depth<=0.) {fragmentOutputs.color= vec4f(color,1.);return fragmentOutputs;}
var normal: vec3f=textureSampleLevel(normalSampler,normalSamplerSampler,input.vUV,0.).rgb;
#ifdef DECODE_NORMAL
normal=normal*2.0-1.0;
#endif
var sigma: f32= f32(uniforms.filterSize);var two_sigma2: f32=2.0*sigma*sigma;var sigmaDepth: f32=uniforms.depthThreshold;var two_sigmaDepth2: f32=2.0*sigmaDepth*sigmaDepth;var sigmaNormal: f32=uniforms.normalThreshold;var two_sigmaNormal2: f32=2.0*sigmaNormal*sigmaNormal;var sum: vec3f= vec3f(0.);var wsum: f32=0.;for (var x: i32=-uniforms.filterSize; x<=uniforms.filterSize; x++) {var coords=vec2f(f32(x));var sampleColor: vec3f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV+coords*uniforms.blurDir,0.).rgb;var sampleDepth: f32=textureSampleLevel(depthSampler,depthSamplerSampler,input.vUV+coords*uniforms.blurDir,0.).r;var sampleNormal: vec3f=textureSampleLevel(normalSampler,normalSamplerSampler,input.vUV+coords*uniforms.blurDir,0.).rgb;
#ifdef DECODE_NORMAL
sampleNormal=sampleNormal*2.0-1.0;
#endif
var r: f32=dot(coords,coords);var w: f32=exp(-r/two_sigma2);var depthDelta: f32=abs(sampleDepth-depth);var wd: f32=step(depthDelta,uniforms.depthThreshold);var normalDelta: vec3f=abs(sampleNormal-normal);var wn: f32=step(normalDelta.x+normalDelta.y+normalDelta.z,uniforms.normalThreshold);sum+=sampleColor*w*wd*wn;wsum+=w*wd*wn;}
fragmentOutputs.color= vec4f(sum/wsum,1.);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["bilateralBlurPixelShaderWGSL",0,{name:c,shader:d}])},57756,a=>{"use strict";var b=a.i(625562);let c="iblVoxelGrid3dDebugPixelShader",d=`varying vUV: vec2f;var voxelTextureSampler: sampler;var voxelTexture: texture_3d<f32>;var voxelSlabTextureSampler: sampler;var voxelSlabTexture: texture_2d<f32>;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform sizeParams: vec4f;
#define offsetX uniforms.sizeParams.x
#define offsetY uniforms.sizeParams.y
#define widthScale uniforms.sizeParams.z
#define heightScale uniforms.sizeParams.w
uniform mipNumber: f32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var uv: vec2f =
vec2f((offsetX+input.vUV.x)*widthScale,(offsetY+input.vUV.y)*heightScale);var background: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);var voxelSlab: vec4f=textureSample(voxelSlabTexture,voxelSlabTextureSampler,input.vUV);var size: vec3u=textureDimensions(voxelTexture, i32(uniforms.mipNumber));var dimension: f32=ceil(sqrt( f32(size.z)));var samplePos: vec2f=fract(uv.xy* vec2f(dimension));var sampleIndex: u32= u32(floor(uv.x* f32(dimension)) +
floor(uv.y* f32(dimension))*dimension);var mip_separator: f32=0.0;if (samplePos.x<0.01 || samplePos.y<0.01) {mip_separator=1.0;}
var outBounds: bool=select(false,true,sampleIndex>size.z-1);sampleIndex=clamp(sampleIndex,0,size.z-1);var samplePosInt: vec2i= vec2i(samplePos.xy* vec2f(size.xy));var voxel: vec3f=textureLoad(voxelTexture,
vec3i(i32(samplePosInt.x),i32(samplePosInt.y),i32(sampleIndex)),
i32(uniforms.mipNumber)).rgb;if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {fragmentOutputs.color=background;} else {if (outBounds) {voxel= vec3f(0.15,0.0,0.0);} else {voxel.r+=mip_separator;}
fragmentOutputs.color=vec4f(mix(background.rgb,voxelSlab.rgb,voxelSlab.a)+voxel,1.0);}}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblVoxelGrid3dDebugPixelShaderWGSL",0,{name:c,shader:d}])},335502,a=>{"use strict";var b=a.i(625562);let c="rsmFullGlobalIlluminationPixelShader",d=`/**
* The implementation is a direct application of the formula found in http:
*/
varying vUV: vec2f;uniform rsmLightMatrix: mat4x4f;uniform rsmInfo: vec4f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var normalSamplerSampler: sampler;var normalSampler: texture_2d<f32>;var rsmPositionW: texture_2d<f32>;var rsmNormalW: texture_2d<f32>;var rsmFlux: texture_2d<f32>;
#ifdef TRANSFORM_NORMAL
uniform invView: mat4x4f;
#endif
fn computeIndirect(p: vec3f,n: vec3f)->vec3f {var indirectDiffuse: vec3f= vec3f(0.);var intensity: f32=uniforms.rsmInfo.z;var edgeArtifactCorrection: f32=uniforms.rsmInfo.w;var texRSM: vec4f=uniforms.rsmLightMatrix* vec4f(p,1.);texRSM=vec4f(texRSM.xy/texRSM.w,texRSM.z,texRSM.w);texRSM=vec4f(texRSM.xy*0.5+0.5,texRSM.z,texRSM.w);var width: i32= i32(uniforms.rsmInfo.x);var height: i32= i32(uniforms.rsmInfo.y);for (var j: i32=0; j<height; j++) {for (var i: i32=0; i<width; i++) {var uv=vec2<i32>(i,j);var vplPositionW: vec3f=textureLoad(rsmPositionW,uv,0).xyz;var vplNormalW: vec3f=textureLoad(rsmNormalW,uv,0).xyz*2.0-1.0;var vplFlux: vec3f=textureLoad(rsmFlux,uv,0).rgb;vplPositionW-=vplNormalW*edgeArtifactCorrection; 
var dist2: f32=dot(vplPositionW-p,vplPositionW-p);indirectDiffuse+=vplFlux*max(0.,dot(n,vplPositionW-p))*max(0.,dot(vplNormalW,p-vplPositionW))/(dist2*dist2);}}
return clamp(indirectDiffuse*intensity,vec3f(0.0),vec3f(1.0));}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var positionW: vec3f=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.vUV).xyz;var normalW: vec3f=textureSample(normalSampler,normalSamplerSampler,fragmentInputs.vUV).xyz;
#ifdef DECODE_NORMAL
normalW=normalW*2.0-1.0;
#endif
#ifdef TRANSFORM_NORMAL
normalW=(uniforms.invView* vec4f(normalW,0.)).xyz;
#endif
fragmentOutputs.color=vec4f(computeIndirect(positionW,normalW),1.0);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["rsmFullGlobalIlluminationPixelShaderWGSL",0,{name:c,shader:d}])},177814,a=>{"use strict";var b=a.i(625562);let c="iblShadowAccumulationPixelShader",d=`#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUV;uniform vec4 accumulationParameters;
#define remanence accumulationParameters.x
#define resetb accumulationParameters.y
#define sceneSize accumulationParameters.z
uniform sampler2D motionSampler;uniform sampler2D positionSampler;uniform sampler2D spatialBlurSampler;uniform sampler2D oldAccumulationSampler;uniform sampler2D prevPositionSampler;vec2 max2(vec2 v,vec2 w) { return vec2(max(v.x,w.x),max(v.y,w.y)); }
void main(void) {bool reset=bool(resetb);vec2 gbufferRes=vec2(textureSize(motionSampler,0));ivec2 gbufferPixelCoord=ivec2(vUV*gbufferRes);vec2 shadowRes=vec2(textureSize(spatialBlurSampler,0));ivec2 shadowPixelCoord=ivec2(vUV*shadowRes);vec4 LP=texelFetch(positionSampler,gbufferPixelCoord,0);if (0.0==LP.w) {gl_FragColor=vec4(1.0,0.0,0.0,1.0);return;}
vec2 velocityColor=texelFetch(motionSampler,gbufferPixelCoord,0).xy;vec2 prevCoord=vUV+velocityColor;vec3 PrevLP=texture(prevPositionSampler,prevCoord).xyz;vec4 PrevShadows=texture(oldAccumulationSampler,prevCoord);vec3 newShadows=texelFetch(spatialBlurSampler,shadowPixelCoord,0).xyz;PrevShadows.a =
!reset && all(lessThan(abs(prevCoord-vec2(0.5)),vec2(0.5))) &&
distance(LP.xyz,PrevLP)<5e-2*sceneSize
? max(PrevShadows.a/(1.0+PrevShadows.a),1.0-remanence)
: 1.0;PrevShadows=max(vec4(0.0),PrevShadows);gl_FragColor =
vec4(mix(PrevShadows.x,newShadows.x,PrevShadows.a),
mix(PrevShadows.y,newShadows.y,PrevShadows.a),
mix(PrevShadows.z,newShadows.z,PrevShadows.a),PrevShadows.a);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblShadowAccumulationPixelShader",0,{name:c,shader:d}])},950128,a=>{"use strict";var b=a.i(625562);let c="meshUVSpaceRendererFinaliserPixelShader",d=`#define DISABLE_UNIFORMITY_ANALYSIS
varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var maskTextureSamplerSampler: sampler;var maskTextureSampler: texture_2d<f32>;uniform textureSize: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var mask: vec4f=textureSample(maskTextureSampler,maskTextureSamplerSampler,input.vUV).rgba;if (mask.r>0.5) {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);} else {var texelSize: vec2f=4.0/uniforms.textureSize;var uv_p01: vec2f=input.vUV+ vec2f(-1.0,0.0)*texelSize;var uv_p21: vec2f=input.vUV+ vec2f(1.0,0.0)*texelSize;var uv_p10: vec2f=input.vUV+ vec2f(0.0,-1.0)*texelSize;var uv_p12: vec2f=input.vUV+ vec2f(0.0,1.0)*texelSize;var mask_p01: f32=textureSample(maskTextureSampler,maskTextureSamplerSampler,uv_p01).r;var mask_p21: f32=textureSample(maskTextureSampler,maskTextureSamplerSampler,uv_p21).r;var mask_p10: f32=textureSample(maskTextureSampler,maskTextureSamplerSampler,uv_p10).r;var mask_p12: f32=textureSample(maskTextureSampler,maskTextureSamplerSampler,uv_p12).r;var col: vec4f= vec4f(0.0,0.0,0.0,0.0);var total_weight: f32=0.0;if (mask_p01>0.5) {col+=textureSample(textureSampler,textureSamplerSampler,uv_p01);total_weight+=1.0;}
if (mask_p21>0.5) {col+=textureSample(textureSampler,textureSamplerSampler,uv_p21);total_weight+=1.0;}
if (mask_p10>0.5) {col+=textureSample(textureSampler,textureSamplerSampler,uv_p10);total_weight+=1.0;}
if (mask_p12>0.5) {col+=textureSample(textureSampler,textureSamplerSampler,uv_p12);total_weight+=1.0;}
if (total_weight>0.0) {fragmentOutputs.color=col/total_weight;} else {fragmentOutputs.color=col;}}}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["meshUVSpaceRendererFinaliserPixelShaderWGSL",0,{name:c,shader:d}])},48147,519493,a=>{"use strict";var b=a.i(625562);a.i(435),a.i(160815),a.i(842357),a.i(410897),a.i(316972);let c="gaussianSplattingFragmentDeclaration",d=`fn gaussianColor(inColor: vec4f,inPosition: vec2f)->vec4f
{var A : f32=-dot(inPosition,inPosition);if (A>-4.0)
{var B: f32=exp(A)*inColor.a;
#include<logDepthFragment>
var color: vec3f=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4f(color,B);} else {return vec4f(0.0);}}
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([],519493),a.i(197011);let e="gaussianSplattingPixelShader",f=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vColor: vec4f;varying vPosition: vec2f;
#include<gaussianSplattingFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
fragmentOutputs.color=gaussianColor(input.vColor,input.vPosition);}
`;b.ShaderStore.ShadersStoreWGSL[e]||(b.ShaderStore.ShadersStoreWGSL[e]=f),a.s(["gaussianSplattingPixelShaderWGSL",0,{name:e,shader:f}],48147)},736149,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(937034),a.i(643926),a.i(896790),a.i(306169),a.i(544248),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163),a.i(403470),a.i(705551);let c="outlineVertexShader",d=`attribute vec3 position;attribute vec3 normal;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform float offset;
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef ALPHATEST
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;vec3 normalUpdated=normal;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
vec3 offsetPosition=positionUpdated+(normalUpdated*offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(offsetPosition,1.0);gl_Position=viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["outlineVertexShader",0,{name:c,shader:d}])},950484,a=>{"use strict";var b=a.i(625562);a.i(964653);let c="iblIcdfPixelShader",d=`precision highp sampler2D;
#include<helperFunctions>
varying vec2 vUV;
#ifdef IBL_USE_CUBE_MAP
uniform samplerCube iblSource;
#else
uniform sampler2D iblSource;
#endif
uniform sampler2D scaledLuminanceSampler;uniform int iblWidth;uniform int iblHeight;uniform sampler2D cdfx;uniform sampler2D cdfy;float fetchLuminance(vec2 coords) {
#ifdef IBL_USE_CUBE_MAP
vec3 direction=equirectangularToCubemapDirection(coords);vec3 color=textureCubeLodEXT(iblSource,direction,0.0).rgb;
#else
vec3 color=textureLod(iblSource,coords,0.0).rgb;
#endif
return dot(color,LuminanceEncodeApprox);}
float fetchCDFx(int x) { return texelFetch(cdfx,ivec2(x,0),0).x; }
float bisectx(int size,float targetValue) {int a=0,b=size-1;while (b-a>1) {int c=a+b>>1;if (fetchCDFx(c)<targetValue)
a=c;else
b=c;}
return mix(float(a),float(b),
(targetValue-fetchCDFx(a))/(fetchCDFx(b)-fetchCDFx(a))) /
float(size-1);}
float fetchCDFy(int y,int invocationId) {return texelFetch(cdfy,ivec2(invocationId,y),0).x;}
float bisecty(int size,float targetValue,int invocationId) {int a=0,b=size-1;while (b-a>1) {int c=a+b>>1;if (fetchCDFy(c,invocationId)<targetValue)
a=c;else
b=c;}
return mix(float(a),float(b),
(targetValue-fetchCDFy(a,invocationId)) /
(fetchCDFy(b,invocationId)-fetchCDFy(a,invocationId))) /
float(size-1);}
void main(void) {ivec2 cdfxSize=textureSize(cdfx,0);int cdfWidth=cdfxSize.x;int icdfWidth=cdfWidth-1;ivec2 currentPixel=ivec2(gl_FragCoord.xy);vec3 outputColor=vec3(1.0);if (currentPixel.x==0) {outputColor.x=0.0;} else if (currentPixel.x==icdfWidth-1) {outputColor.x=1.0;} else {float targetValue=fetchCDFx(cdfWidth-1)*vUV.x;outputColor.x=bisectx(cdfWidth,targetValue);}
ivec2 cdfySize=textureSize(cdfy,0);int cdfHeight=cdfySize.y;if (currentPixel.y==0) {outputColor.y=0.0;} else if (currentPixel.y==cdfHeight-2) {outputColor.y=1.0;} else {float targetValue=fetchCDFy(cdfHeight-1,currentPixel.x)*vUV.y;outputColor.y=max(bisecty(cdfHeight,targetValue,currentPixel.x),0.0);}
vec2 size=vec2(textureSize(scaledLuminanceSampler,0));float highestMip=floor(log2(size.x));float normalization=texture(scaledLuminanceSampler,vUV,highestMip).r;float pixelLuminance=fetchLuminance(vUV);outputColor.z=pixelLuminance/(2.0*PI*normalization);gl_FragColor=vec4(outputColor,1.0);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblIcdfPixelShader",0,{name:c,shader:d}])},517221,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(896790),a.i(506404),a.i(306169),a.i(37668),a.i(252115),a.i(175163),a.i(403470),a.i(164403),a.i(9902);let c="colorVertexShader",d=`attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform mat4 view;
#endif
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["colorVertexShader",0,{name:c,shader:d}])},859229,a=>{"use strict";var b=a.i(625562);let c="iblShadowSpatialBlurPixelShader",d=`#define PI 3.1415927
varying vUV: vec2f;var depthSampler: texture_2d<f32>;var worldNormalSampler: texture_2d<f32>;var voxelTracingSampler : texture_2d<f32>;uniform blurParameters: vec4f;
#define stridef uniforms.blurParameters.x
#define worldScale uniforms.blurParameters.y
const weights=array<f32,5>(0.0625,0.25,0.375,0.25,0.0625);const nbWeights: i32=5;fn max2(v: vec2f,w: vec2f)->vec2f {return vec2f(max(v.x,w.x),max(v.y,w.y));}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var gbufferRes=vec2f(textureDimensions(depthSampler,0));var gbufferPixelCoord= vec2i(fragmentInputs.vUV*gbufferRes);var shadowRes=vec2f(textureDimensions(voxelTracingSampler,0));var shadowPixelCoord= vec2i(fragmentInputs.vUV*shadowRes);var N: vec3f=textureLoad(worldNormalSampler,gbufferPixelCoord,0).xyz;if (length(N)<0.01) {fragmentOutputs.color=vec4f(1.0,1.0,0.0,1.0);return fragmentOutputs;}
var depth: f32=-textureLoad(depthSampler,gbufferPixelCoord,0).x;var X: vec4f= vec4f(0.0);for(var y: i32=0; y<nbWeights; y++) {for(var x: i32=0; x<nbWeights; x++) {var gBufferCoords: vec2i=gbufferPixelCoord+i32(stridef)*vec2i(x-(nbWeights>>1),y-(nbWeights>>1));var shadowCoords: vec2i=shadowPixelCoord+i32(stridef)*vec2i(x-(nbWeights>>1),y-(nbWeights>>1));var T : vec3f=textureLoad(voxelTracingSampler,shadowCoords,0).xyz;var ddepth: f32=-textureLoad(depthSampler,gBufferCoords,0).x-depth;var dN: vec3f=textureLoad(worldNormalSampler,gBufferCoords,0).xyz-N;var w: f32=weights[x]*weights[y] *
exp2(max(-1000.0/(worldScale*worldScale),-0.5) *
(ddepth*ddepth) -
1e1*dot(dN,dN));X+= vec4f(w*T.x,w*T.y,w*T.z,w);}}
fragmentOutputs.color= vec4f(X.x/X.w,X.y/X.w,X.z/X.w,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblShadowSpatialBlurPixelShaderWGSL",0,{name:c,shader:d}])},29405,a=>{"use strict";var b=a.i(625562);a.i(488049),a.i(315937),a.i(284660),a.i(142967),a.i(160815),a.i(707101),a.i(736380),a.i(5021);let c="lineVertexShader",d=`#define ADDITIONAL_VERTEX_DECLARATION
#include<instancesDeclaration>
#include<clipPlaneVertexDeclaration>
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position: vec3f;attribute normal: vec4f;uniform width: f32;uniform aspectRatio: f32;
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
var worldViewProjection: mat4x4f=scene.viewProjection*finalWorld;var viewPosition: vec4f=worldViewProjection* vec4f(input.position,1.0);var viewPositionNext: vec4f=worldViewProjection* vec4f(input.normal.xyz,1.0);var currentScreen: vec2f=viewPosition.xy/viewPosition.w;var nextScreen: vec2f=viewPositionNext.xy/viewPositionNext.w;currentScreen=vec2f(currentScreen.x*uniforms.aspectRatio,currentScreen.y);nextScreen=vec2f(nextScreen.x*uniforms.aspectRatio,nextScreen.y);var dir: vec2f=normalize(nextScreen-currentScreen);var normalDir: vec2f= vec2f(-dir.y,dir.x);normalDir*=uniforms.width/2.0;normalDir=vec2f(normalDir.x/uniforms.aspectRatio,normalDir.y);var offset: vec4f= vec4f(normalDir*input.normal.w,0.0,0.0);vertexOutputs.position=viewPosition+offset;
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
var worldPos: vec4f=finalWorld*vec4f(input.position,1.0);
#include<clipPlaneVertex>
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["lineVertexShaderWGSL",0,{name:c,shader:d}])},311781,a=>{"use strict";var b=a.i(625562);let c="kernelBlurVaryingDeclaration";b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]="varying sampleCoord{X}: vec2f;"),a.s([])},604667,a=>{"use strict";var b=a.i(625562);a.i(311781);let c="kernelBlurVertex";b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]="vertexOutputs.sampleCoord{X}=vertexOutputs.sampleCenter+uniforms.delta*KERNEL_OFFSET{X};");let d="kernelBlurVertexShader",e=`attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(input.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[d]||(b.ShaderStore.ShadersStoreWGSL[d]=e),a.s(["kernelBlurVertexShaderWGSL",0,{name:d,shader:e}],604667)},452779,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(210312),e=a.i(994060);class f extends b.FlowGraphBlock{constructor(a){for(let b of(super(a),this.config=a,this._inputCases=new Map,this.case=this.registerDataInput("case",c.RichTypeAny,NaN),this.default=this.registerDataInput("default",c.RichTypeAny),this.value=this.registerDataOutput("value",c.RichTypeAny),this.config.cases||[])){if(b=(0,d.getNumericValue)(b),this.config.treatCasesAsIntegers&&(b|=0,this._inputCases.has(b)))return;this._inputCases.set(b,this.registerDataInput(`in_${b}`,c.RichTypeAny))}}_updateOutputs(a){let b,c=this.case.getValue(a);(0,d.isNumeric)(c)&&(b=this._getOutputValueForCase((0,d.getNumericValue)(c),a)),b||(b=this.default.getValue(a)),this.value.setValue(b,a)}_getOutputValueForCase(a,b){return this._inputCases.get(a)?.getValue(b)}getClassName(){return"FlowGraphDataSwitchBlock"}}(0,e.RegisterClass)("FlowGraphDataSwitchBlock",f),a.s(["FlowGraphDataSwitchBlock",()=>f])},190848,a=>{"use strict";var b=a.i(625562);a.i(964653),a.i(681682),a.i(874402);let c="glowMapGenerationPixelShader",d=`#if defined(DIFFUSE_ISLINEAR) || defined(EMISSIVE_ISLINEAR)
#include<helperFunctions>
#endif
#ifdef DIFFUSE
varying vec2 vUVDiffuse;uniform sampler2D diffuseSampler;
#endif
#ifdef OPACITY
varying vec2 vUVOpacity;uniform sampler2D opacitySampler;uniform float opacityIntensity;
#endif
#ifdef EMISSIVE
varying vec2 vUVEmissive;uniform sampler2D emissiveSampler;
#endif
#ifdef VERTEXALPHA
varying vec4 vColor;
#endif
uniform vec4 glowColor;uniform float glowIntensity;
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
vec4 finalColor=glowColor;
#ifdef DIFFUSE
vec4 albedoTexture=texture2D(diffuseSampler,vUVDiffuse);
#ifdef DIFFUSE_ISLINEAR
albedoTexture=toGammaSpace(albedoTexture);
#endif
#ifdef GLOW
finalColor.a*=albedoTexture.a;
#endif
#ifdef HIGHLIGHT
finalColor.a=albedoTexture.a;
#endif
#endif
#ifdef OPACITY
vec4 opacityMap=texture2D(opacitySampler,vUVOpacity);
#ifdef OPACITYRGB
finalColor.a*=getLuminance(opacityMap.rgb);
#else
finalColor.a*=opacityMap.a;
#endif
finalColor.a*=opacityIntensity;
#endif
#ifdef VERTEXALPHA
finalColor.a*=vColor.a;
#endif
#ifdef ALPHATEST
if (finalColor.a<ALPHATESTVALUE)
discard;
#endif
#ifdef EMISSIVE
vec4 emissive=texture2D(emissiveSampler,vUVEmissive);
#ifdef EMISSIVE_ISLINEAR
emissive=toGammaSpace(emissive);
#endif
gl_FragColor=emissive*finalColor*glowIntensity;
#else
gl_FragColor=finalColor*glowIntensity;
#endif
#ifdef HIGHLIGHT
gl_FragColor.a=glowColor.a;
#endif
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["glowMapGenerationPixelShader",0,{name:c,shader:d}])},495587,307485,a=>{"use strict";var b=a.i(625562);a.i(972930),a.i(544248),a.i(430783),a.i(384701);let c="imageProcessingCompatibility",d=`#ifdef IMAGEPROCESSINGPOSTPROCESS
gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(2.2));
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([],307485);let e="spritesPixelShader",f=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform bool alphaTest;varying vec4 vColor;varying vec2 vUV;uniform sampler2D diffuseSampler;
#include<fogFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
#ifdef PIXEL_PERFECT
vec2 uvPixelPerfect(vec2 uv) {vec2 res=vec2(textureSize(diffuseSampler,0));uv=uv*res;vec2 seam=floor(uv+0.5);uv=seam+clamp((uv-seam)/fwidth(uv),-0.5,0.5);return uv/res;}
#endif
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#ifdef PIXEL_PERFECT
vec2 uv=uvPixelPerfect(vUV);
#else
vec2 uv=vUV;
#endif
vec4 color=texture2D(diffuseSampler,uv);float fAlphaTest=float(alphaTest);if (fAlphaTest != 0.)
{if (color.a<0.95)
discard;}
color*=vColor;
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStore[e]||(b.ShaderStore.ShadersStore[e]=f),a.s(["spritesPixelShader",0,{name:e,shader:f}],495587)},334229,a=>{"use strict";var b=a.i(779438),c=a.i(542693),d=a.i(994060);class e extends c.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.reset=this._registerSignalInput("reset"),this.duration=this.registerDataInput("duration",b.RichTypeNumber),this.lastRemainingTime=this.registerDataOutput("lastRemainingTime",b.RichTypeNumber,NaN)}_execute(a,b){if(b===this.reset){this.lastRemainingTime.setValue(NaN,a),a._setExecutionVariable(this,"lastRemainingTime",NaN),a._setExecutionVariable(this,"timestamp",0);return}let c=this.duration.getValue(a);if(c<=0||isNaN(c)||!isFinite(c))return this._reportError(a,"Invalid duration in Throttle block");let d=a._getExecutionVariable(this,"lastRemainingTime",NaN),e=Date.now();if(isNaN(d))return this.lastRemainingTime.setValue(0,a),a._setExecutionVariable(this,"lastRemainingTime",0),a._setExecutionVariable(this,"timestamp",e),this.out._activateSignal(a);{let b=e-a._getExecutionVariable(this,"timestamp",0),d=1e3*c;if(d<=b)return this.lastRemainingTime.setValue(0,a),a._setExecutionVariable(this,"lastRemainingTime",0),a._setExecutionVariable(this,"timestamp",e),this.out._activateSignal(a);{let c=d-b;this.lastRemainingTime.setValue(c/1e3,a),a._setExecutionVariable(this,"lastRemainingTime",c)}}}getClassName(){return"FlowGraphThrottleBlock"}}(0,d.RegisterClass)("FlowGraphThrottleBlock",e),a.s(["FlowGraphThrottleBlock",()=>e])},90693,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(937034),a.i(643926),a.i(306169),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163);let c="meshUVSpaceRendererVertexShader",d=`precision highp float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 projMatrix;varying vec2 vDecalTC;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
void main(void) {vec3 positionUpdated=position;vec3 normalUpdated=normal;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);mat3 normWorldSM=mat3(finalWorld);vec3 vNormalW;
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vNormalW=normalize(normWorldSM*normalUpdated);
#endif
vec3 normalView=normalize((projMatrix*vec4(vNormalW,0.0)).xyz);vec3 decalTC=(projMatrix*worldPos).xyz;vDecalTC=decalTC.xy;gl_Position=vec4(uv*2.0-1.0,normalView.z>0.0 ? 2. : decalTC.z,1.0);}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["meshUVSpaceRendererVertexShader",0,{name:c,shader:d}])},216516,a=>{"use strict";var b=a.i(625562);a.i(431801),a.i(160815),a.i(5021);let c="spritesVertexShader",d=`attribute position: vec4f;attribute options: vec2f;attribute offsets: vec2f;attribute inverts: vec2f;attribute cellInfo: vec4f;attribute color: vec4f;uniform view: mat4x4f;uniform projection: mat4x4f;varying vUV: vec2f;varying vColor: vec4f;
#include<fogVertexDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var viewPos: vec3f=(uniforms.view* vec4f(input.position.xyz,1.0)).xyz; 
var cornerPos: vec2f;var angle: f32=input.position.w;var size: vec2f= vec2f(input.options.x,input.options.y);var offset: vec2f=input.offsets.xy;cornerPos= vec2f(offset.x-0.5,offset.y -0.5)*size;var rotatedCorner: vec3f;rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);rotatedCorner.y=cornerPos.x*sin(angle)+cornerPos.y*cos(angle);rotatedCorner.z=0.;viewPos+=rotatedCorner;vertexOutputs.position=uniforms.projection*vec4f(viewPos,1.0); 
vertexOutputs.vColor=input.color;var uvOffset: vec2f= vec2f(abs(offset.x-input.inverts.x),abs(1.0-offset.y-input.inverts.y));var uvPlace: vec2f=input.cellInfo.xy;var uvSize: vec2f=input.cellInfo.zw;vertexOutputs.vUV.x=uvPlace.x+uvSize.x*uvOffset.x;vertexOutputs.vUV.y=uvPlace.y+uvSize.y*uvOffset.y;
#ifdef FOG
vertexOutputs.vFogDistance=viewPos;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["spritesVertexShaderWGSL",0,{name:c,shader:d}])},418018,a=>{"use strict";var b=a.i(625562);a.i(284660),a.i(680354);let c="lightProxyVertexShader",d=`attribute position: vec3f;flat varying vOffset: u32;flat varying vMask: u32;
#include<sceneUboDeclaration>
var lightDataTexture: texture_2d<f32>;uniform tileMaskResolution: vec3f;uniform halfTileRes: vec2f;
#include<clusteredLightingFunctions>
@vertex
fn main(input: VertexInputs)->FragmentInputs {let light=getClusteredLight(lightDataTexture,vertexInputs.instanceIndex);let range=light.vLightFalloff.x;let viewPosition=scene.view*vec4f(light.vLightData.xyz,1);let viewPositionSq=viewPosition*viewPosition;let distSq=viewPositionSq.xy+viewPositionSq.z;let sinSq=(range*range)/distSq;let cosSq=max(1.0-sinSq,vec2f(0.01));let sinCos=vertexInputs.position.xy*sqrt(sinSq*cosSq);let rotatedX=mat2x2f(cosSq.x,-sinCos.x,sinCos.x,cosSq.x)*viewPosition.xz;let rotatedY=mat2x2f(cosSq.y,-sinCos.y,sinCos.y,cosSq.y)*viewPosition.yz;let projX=scene.projection*vec4f(rotatedX.x,0,rotatedX.y,1);let projY=scene.projection*vec4f(0,rotatedY.x,rotatedY.y,1);var projPosition=vec2f(projX.x/max(projX.w,0.01),projY.y/max(projY.w,0.01));projPosition=select(vertexInputs.position.xy,projPosition,cosSq>vec2(0.01));let halfTileRes=uniforms.tileMaskResolution.xy/2.0;var tilePosition=(projPosition+1.0)*halfTileRes;tilePosition=select(floor(tilePosition)-0.01,ceil(tilePosition)+0.01,vertexInputs.position.xy>vec2f(0));vertexOutputs.position=vec4f(tilePosition/halfTileRes-1.0,0,1);vertexOutputs.vOffset=vertexInputs.instanceIndex/CLUSTLIGHT_BATCH;vertexOutputs.vMask=1u<<(vertexInputs.instanceIndex % CLUSTLIGHT_BATCH);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["lightProxyVertexShaderWGSL",0,{name:c,shader:d}])},356139,a=>{"use strict";var b=a.i(625562);a.i(842357),a.i(160815),a.i(410897),a.i(316972);let c="imageProcessingCompatibility",d=`#ifdef IMAGEPROCESSINGPOSTPROCESS
fragmentOutputs.color=vec4f(pow(fragmentOutputs.color.rgb, vec3f(2.2)),fragmentOutputs.color.a);
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d);let e="spritesPixelShader",f=`uniform alphaTest: i32;varying vColor: vec4f;varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#include<fogFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
#ifdef PIXEL_PERFECT
fn uvPixelPerfect(uv: vec2f)->vec2f {var res: vec2f= vec2f(textureDimensions(diffuseSampler,0));var uvTemp=uv*res;var seam: vec2f=floor(uvTemp+0.5);uvTemp=seam+clamp((uvTemp-seam)/fwidth(uvTemp),vec2f(-0.5),vec2f(0.5));return uvTemp/res;}
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#ifdef PIXEL_PERFECT
var uv: vec2f=uvPixelPerfect(input.vUV);
#else
var uv: vec2f=input.vUV;
#endif
var color: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,uv);var fAlphaTest: f32= f32(uniforms.alphaTest);if (fAlphaTest != 0.)
{if (color.a<0.95) {discard;}}
color*=input.vColor;
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[e]||(b.ShaderStore.ShadersStoreWGSL[e]=f),a.s(["spritesPixelShaderWGSL",0,{name:e,shader:f}],356139)},738559,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(306169),a.i(937034),a.i(643926),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163);let c="iblVoxelGridVertexShader",d=`attribute vec3 position;varying vec3 vNormalizedPosition;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
uniform mat4 invWorldScale;uniform mat4 viewMatrix;void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewMatrix*invWorldScale*worldPos;vNormalizedPosition.xyz=gl_Position.xyz*0.5+0.5;
#ifdef IS_NDC_HALF_ZRANGE
gl_Position.z=gl_Position.z*0.5+0.5;
#endif
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblVoxelGridVertexShader",0,{name:c,shader:d}])},775659,a=>{"use strict";var b=a.i(625562);let c="rsmGlobalIlluminationPixelShader",d=`/**
* The implementation is an application of the formula found in http:
* For better results,it also adds a random (noise) rotation to the RSM samples (the noise artifacts are easier to remove than the banding artifacts).
*/
precision highp float;varying vec2 vUV;uniform mat4 rsmLightMatrix;uniform vec4 rsmInfo;uniform vec4 rsmInfo2;uniform sampler2D textureSampler;uniform sampler2D normalSampler;uniform sampler2D rsmPositionW;uniform sampler2D rsmNormalW;uniform sampler2D rsmFlux;uniform sampler2D rsmSamples;
#ifdef TRANSFORM_NORMAL
uniform mat4 invView;
#endif
float mod289(float x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 perm(vec4 x){return mod289(((x*34.0)+1.0)*x);}
float noise(vec3 p){vec3 a=floor(p);vec3 d=p-a;d=d*d*(3.0-2.0*d);vec4 b=a.xxyy+vec4(0.0,1.0,0.0,1.0);vec4 k1=perm(b.xyxy);vec4 k2=perm(k1.xyxy+b.zzww);vec4 c=k2+a.zzzz;vec4 k3=perm(c);vec4 k4=perm(c+1.0);vec4 o1=fract(k3*(1.0/41.0));vec4 o2=fract(k4*(1.0/41.0));vec4 o3=o2*d.z+o1*(1.0-d.z);vec2 o4=o3.yw*d.x+o3.xz*(1.0-d.x);return o4.y*d.y+o4.x*(1.0-d.y);}
vec3 computeIndirect(vec3 p,vec3 n) {vec3 indirectDiffuse=vec3(0.);int numSamples=int(rsmInfo.x);float radius=rsmInfo.y;float intensity=rsmInfo.z;float edgeArtifactCorrection=rsmInfo.w;vec4 texRSM=rsmLightMatrix*vec4(p,1.);texRSM.xy/=texRSM.w;texRSM.xy=texRSM.xy*0.5+0.5;float angle=noise(p*rsmInfo2.x);float c=cos(angle);float s=sin(angle);for (int i=0; i<numSamples; i++) {vec3 rsmSample=texelFetch(rsmSamples,ivec2(i,0),0).xyz;float weightSquare=rsmSample.z;if (rsmInfo2.y==1.0) rsmSample.xy=vec2(rsmSample.x*c+rsmSample.y*s,-rsmSample.x*s+rsmSample.y*c);vec2 uv=texRSM.xy+rsmSample.xy*radius;if (uv.x<0. || uv.x>1. || uv.y<0. || uv.y>1.) continue;vec3 vplPositionW=textureLod(rsmPositionW,uv,0.).xyz;vec3 vplNormalW=textureLod(rsmNormalW,uv,0.).xyz*2.0-1.0;vec3 vplFlux=textureLod(rsmFlux,uv,0.).rgb;vplPositionW-=vplNormalW*edgeArtifactCorrection; 
float dist2=dot(vplPositionW-p,vplPositionW-p);indirectDiffuse+=vplFlux*weightSquare*max(0.,dot(n,vplPositionW-p))*max(0.,dot(vplNormalW,p-vplPositionW))/(dist2*dist2);}
return clamp(indirectDiffuse*intensity,0.0,1.0);}
void main(void) 
{vec3 positionW=texture2D(textureSampler,vUV).xyz;vec3 normalW=texture2D(normalSampler,vUV).xyz;
#ifdef DECODE_NORMAL
normalW=normalW*2.0-1.0;
#endif
#ifdef TRANSFORM_NORMAL
normalW=(invView*vec4(normalW,0.)).xyz;
#endif
gl_FragColor.rgb=computeIndirect(positionW,normalW);gl_FragColor.a=1.0;}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["rsmGlobalIlluminationPixelShader",0,{name:c,shader:d}])},507578,a=>{"use strict";var b=a.i(625562);a.i(306169),a.i(37668);let c="greasedLineVertexShader",d=`precision highp float;
#include<instancesDeclaration>
attribute float grl_widths;attribute vec3 grl_offsets;attribute float grl_colorPointers;attribute vec3 position;uniform mat4 viewProjection;uniform mat4 projection;varying float grlCounters;varying float grlColorPointer;
#ifdef GREASED_LINE_CAMERA_FACING
attribute vec4 grl_nextAndCounters;attribute vec4 grl_previousAndSide;uniform vec2 grlResolution;uniform float grlAspect;uniform float grlWidth;uniform float grlSizeAttenuation;vec2 grlFix( vec4 i,float aspect ) {vec2 res=i.xy/i.w;res.x*=aspect;return res;}
#else
attribute vec3 grl_slopes;attribute float grl_counters;
#endif
void main() {
#include<instancesVertex>
grlColorPointer=grl_colorPointers;mat4 grlMatrix=viewProjection*finalWorld ;
#ifdef GREASED_LINE_CAMERA_FACING
float grlBaseWidth=grlWidth;vec3 grlPrevious=grl_previousAndSide.xyz;float grlSide=grl_previousAndSide.w;vec3 grlNext=grl_nextAndCounters.xyz;grlCounters=grl_nextAndCounters.w;float grlWidth=grlBaseWidth*grl_widths;vec3 positionUpdated=position+grl_offsets;vec3 worldDir=normalize(grlNext-grlPrevious);vec3 nearPosition=positionUpdated+(worldDir*0.01);vec4 grlFinalPosition=grlMatrix*vec4( positionUpdated ,1.0);vec4 screenNearPos=grlMatrix*vec4(nearPosition,1.0);vec2 grlLinePosition=grlFix(grlFinalPosition,grlAspect);vec2 grlLineNearPosition=grlFix(screenNearPos,grlAspect);vec2 grlDir=normalize(grlLineNearPosition-grlLinePosition);vec4 grlNormal=vec4( -grlDir.y,grlDir.x,0.,1. );
#ifdef GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM
grlNormal.xy*=-.5*grlWidth;
#else
grlNormal.xy*=.5*grlWidth;
#endif
grlNormal*=projection;if (grlSizeAttenuation==1.) {grlNormal.xy*=grlFinalPosition.w;grlNormal.xy/=( vec4( grlResolution,0.,1. )*projection ).xy;}
grlFinalPosition.xy+=grlNormal.xy*grlSide;gl_Position=grlFinalPosition;
#else
grlCounters=grl_counters;vec4 grlFinalPosition=grlMatrix*vec4( (position+grl_offsets)+grl_slopes*grl_widths ,1.0 ) ;gl_Position=grlFinalPosition;
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["greasedLineVertexShader",0,{name:c,shader:d}])},133450,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(719984),e=a.i(994060);class f extends b.FlowGraphBlock{constructor(a){super(a),this.sourceSystem=this.registerDataInput("sourceSystem",c.RichTypeAny),this.destinationSystem=this.registerDataInput("destinationSystem",c.RichTypeAny),this.inputCoordinates=this.registerDataInput("inputCoordinates",c.RichTypeVector3),this.outputCoordinates=this.registerDataOutput("outputCoordinates",c.RichTypeVector3)}_updateOutputs(a){let b=this.sourceSystem.getValue(a),c=this.destinationSystem.getValue(a),e=this.inputCoordinates.getValue(a),f=b.getWorldMatrix(),g=c.getWorldMatrix(),h=d.TmpVectors.Matrix[0].copyFrom(g);h.invert();let i=d.TmpVectors.Matrix[1];h.multiplyToRef(f,i);let j=this.outputCoordinates.getValue(a);d.Vector3.TransformCoordinatesToRef(e,i,j)}getClassName(){return"FlowGraphTransformCoordinatesSystemBlock"}}(0,e.RegisterClass)("FlowGraphTransformCoordinatesSystemBlock",f),a.s(["FlowGraphTransformCoordinatesSystemBlock",()=>f])},77219,a=>{"use strict";var b=a.i(542693),c=a.i(779438),d=a.i(994060),e=a.i(392511);class f extends b.FlowGraphExecutionBlockWithOutSignal{constructor(a){if(super(a),this.message=this.registerDataInput("message",c.RichTypeAny),this.logType=this.registerDataInput("logType",c.RichTypeAny,"log"),a?.messageTemplate)for(const b of this._getTemplateMatches(a.messageTemplate))this.registerDataInput(b,c.RichTypeAny)}_execute(a){let b=this.logType.getValue(a),c=this._getMessageValue(a);"warn"===b?e.Logger.Warn(c):"error"===b?e.Logger.Error(c):e.Logger.Log(c),this.out._activateSignal(a)}getClassName(){return"FlowGraphConsoleLogBlock"}_getMessageValue(a){if(!this.config?.messageTemplate)return this.message.getValue(a);{let b=this.config.messageTemplate;for(let c of this._getTemplateMatches(b)){let d=this.getDataInput(c)?.getValue(a);void 0!==d&&(b=b.replace(RegExp(`\\{${c}\\}`,"g"),d.toString()))}return b}}_getTemplateMatches(a){let b,c=/\{([^}]+)\}/g,d=[];for(;null!==(b=c.exec(a));)d.push(b[1]);return d}}(0,d.RegisterClass)("FlowGraphConsoleLogBlock",f),a.s(["FlowGraphConsoleLogBlock",()=>f])},907224,a=>{"use strict";var b=a.i(625562);let c="greasedLinePixelShader",d=`var grlColors: texture_2d<f32>;var grlColorsSampler: sampler;uniform grlUseColors: f32;uniform grlUseDash: f32;uniform grlDashArray: f32;uniform grlDashOffset: f32;uniform grlDashRatio: f32;uniform grlVisibility: f32;uniform grlColorsWidth: f32;uniform grl_colorModeAndColorDistributionType: vec2f;uniform grlColor: vec3f;varying grlCounters: f32;varying grlColorPointer: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
let grlColorMode: f32=uniforms.grl_colorModeAndColorDistributionType.x;let grlColorDistributionType: f32=uniforms.grl_colorModeAndColorDistributionType.y;var outColor=vec4(uniforms.grlColor,1.);outColor.a=step(fragmentInputs.grlCounters,uniforms.grlVisibility);if (outColor.a==0.0) {discard;}
if (uniforms.grlUseDash==1.0) {let dashPosition=(fragmentInputs.grlCounters+uniforms.grlDashOffset) % uniforms.grlDashArray;outColor.a*=ceil(dashPosition-(uniforms.grlDashArray*uniforms.grlDashRatio));if (outColor.a==0.0) {discard;}}
if (uniforms.grlUseColors==1.) {
#ifdef GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE
let grlColor: vec4f=textureSample(grlColors,grlColorsSampler,vec2f(fragmentInputs.grlCounters,0.));
#else
let lookup: vec2f=vec2(fract(fragmentInputs.grlColorPointer/uniforms.grlColorsWidth),1.0-floor(fragmentInputs.grlColorPointer/uniforms.grlColorsWidth));let grlColor: vec4f=textureSample(grlColors,grlColorsSampler,lookup);
#endif
if (grlColorMode==COLOR_MODE_SET) {outColor=grlColor;} else if (grlColorMode==COLOR_MODE_ADD) {outColor+=grlColor;} else if (grlColorMode==COLOR_MODE_MULTIPLY) {outColor*=grlColor;}}
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=outColor;
#endif
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+outColor.rgb*outColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-outColor.a));} else {fragmentOutputs.backColor+=outColor;}
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["greasedLinePixelShaderWGSL",0,{name:c,shader:d}])},928029,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(315937),a.i(431801),a.i(488049),a.i(707101),a.i(304277),a.i(83067),a.i(736380),a.i(43607),a.i(700778);let c="colorVertexShader",d=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(input.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["colorVertexShaderWGSL",0,{name:c,shader:d}])},464797,a=>{"use strict";var b=a.i(625562);let c="convolutionPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;uniform kernel: array<f32,9>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var onePixel: vec2f= vec2f(1.0,1.0)/uniforms.screenSize;var colorSum: vec4f =
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(-1,-1))*uniforms.kernel[0] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(0,-1))*uniforms.kernel[1] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(1,-1))*uniforms.kernel[2] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(-1,0))*uniforms.kernel[3] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(0,0))*uniforms.kernel[4] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(1,0))*uniforms.kernel[5] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(-1,1))*uniforms.kernel[6] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(0,1))*uniforms.kernel[7] +
textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel* vec2f(1,1))*uniforms.kernel[8];var kernelWeight: f32 =
uniforms.kernel[0] +
uniforms.kernel[1] +
uniforms.kernel[2] +
uniforms.kernel[3] +
uniforms.kernel[4] +
uniforms.kernel[5] +
uniforms.kernel[6] +
uniforms.kernel[7] +
uniforms.kernel[8];if (kernelWeight<=0.0) {kernelWeight=1.0;}
fragmentOutputs.color= vec4f((colorSum/kernelWeight).rgb,1);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["convolutionPixelShaderWGSL",0,{name:c,shader:d}])},571456,a=>{"use strict";var b=a.i(625562);let c="bilateralBlurQualityPixelShader",d=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var normalSamplerSampler: sampler;var normalSampler: texture_2d<f32>;var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;uniform filterSize: i32;uniform blurDir: vec2f;uniform depthThreshold: f32;uniform normalThreshold: f32;varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.).rgb;var depth: f32=textureSampleLevel(depthSampler,depthSamplerSampler,input.vUV,0.).x;if (depth>=1e6 || depth<=0.) {fragmentOutputs.color= vec4f(color,1.);return fragmentOutputs;}
var normal: vec3f=textureSampleLevel(normalSampler,normalSamplerSampler,input.vUV,0.).rgb;
#ifdef DECODE_NORMAL
normal=normal*2.0-1.0;
#endif
var sigma: f32= f32(uniforms.filterSize);var two_sigma2: f32=2.0*sigma*sigma;var sigmaDepth: f32=uniforms.depthThreshold;var two_sigmaDepth2: f32=2.0*sigmaDepth*sigmaDepth;var sigmaNormal: f32=uniforms.normalThreshold;var two_sigmaNormal2: f32=2.0*sigmaNormal*sigmaNormal;var sum: vec3f= vec3f(0.);var wsum: f32=0.;for (var x: i32=-uniforms.filterSize; x<=uniforms.filterSize; x++) {for (var y: i32=-uniforms.filterSize; y<=uniforms.filterSize; y++) {var coords: vec2f= vec2f(f32(x),f32(y))*uniforms.blurDir;var sampleColor: vec3f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV+coords,0.).rgb;var sampleDepth: f32=textureSampleLevel(depthSampler,depthSamplerSampler,input.vUV+coords,0.).r;var sampleNormal: vec3f=textureSampleLevel(normalSampler,normalSamplerSampler,input.vUV+coords,0.).rgb;
#ifdef DECODE_NORMAL
sampleNormal=sampleNormal*2.0-1.0;
#endif
var r: f32=dot(coords,coords);var w: f32=exp(-r/two_sigma2);var rDepth: f32=sampleDepth-depth;var wd: f32=exp(-rDepth*rDepth/two_sigmaDepth2);var rNormal: f32=abs(sampleNormal.x-normal.x)+abs(sampleNormal.y-normal.y)+abs(sampleNormal.z-normal.z);var wn: f32=exp(-rNormal*rNormal/two_sigmaNormal2);sum+=sampleColor*w*wd*wn;wsum+=w*wd*wn;}}
fragmentOutputs.color= vec4f(sum/wsum,1.);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["bilateralBlurQualityPixelShaderWGSL",0,{name:c,shader:d}])},520563,a=>{"use strict";var b=a.i(625562);let c="sceneVertexDeclaration",d=`uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
uniform mat4 view;uniform mat4 projection;uniform vec4 vEyePosition;
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([])},596021,a=>{"use strict";var b=a.i(625562);a.i(520563),a.i(658057),a.i(20632);let c="lightProxyVertexShader",d=`attribute vec3 position;flat varying vec2 vLimits;flat varying highp uint vMask;
#include<__decl__sceneVertex>
uniform sampler2D lightDataTexture;uniform vec3 tileMaskResolution;
#include<clusteredLightingFunctions>
void main(void) {ClusteredLight light=getClusteredLight(lightDataTexture,gl_InstanceID);float range=light.vLightFalloff.x;vec4 viewPosition=view*vec4(light.vLightData.xyz,1);vec4 viewPositionSq=viewPosition*viewPosition;vec2 distSq=viewPositionSq.xy+viewPositionSq.z;vec2 sinSq=(range*range)/distSq;vec2 cosSq=max(1.0-sinSq,0.01);vec2 sinCos=position.xy*sqrt(sinSq*cosSq);vec2 rotatedX=mat2(cosSq.x,-sinCos.x,sinCos.x,cosSq.x)*viewPosition.xz;vec2 rotatedY=mat2(cosSq.y,-sinCos.y,sinCos.y,cosSq.y)*viewPosition.yz;vec4 projX=projection*vec4(rotatedX.x,0,rotatedX.y,1);vec4 projY=projection*vec4(0,rotatedY.x,rotatedY.y,1);vec2 projPosition=vec2(projX.x/max(projX.w,0.01),projY.y/max(projY.w,0.01));projPosition=mix(position.xy,projPosition,greaterThan(cosSq,vec2(0.01)));vec2 halfTileRes=tileMaskResolution.xy/2.0;vec2 tilePosition=(projPosition+1.0)*halfTileRes;tilePosition=mix(floor(tilePosition)-0.01,ceil(tilePosition)+0.01,greaterThan(position.xy,vec2(0)));float offset=float(gl_InstanceID/CLUSTLIGHT_BATCH)*tileMaskResolution.y;tilePosition.y=(tilePosition.y+offset)/tileMaskResolution.z;gl_Position=vec4(tilePosition/halfTileRes-1.0,0,1);vLimits=vec2(offset,offset+tileMaskResolution.y);vMask=1u<<(gl_InstanceID % CLUSTLIGHT_BATCH);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["lightProxyVertexShader",0,{name:c,shader:d}])},203217,a=>{"use strict";var b=a.i(625562);let c="screenSpaceReflection2BlurPixelShader",d=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;varying vUV: vec2f;uniform texelOffsetScale: vec2f;const weights: array<f32,8>=array<f32,8>(0.071303,0.131514,0.189879,0.321392,0.452906, 0.584419,0.715932,0.847445);fn processSample(uv: vec2f,i: f32,stepSize: vec2f,accumulator: ptr<function,vec4f>,denominator: ptr<function,f32>)
{var offsetUV: vec2f=stepSize*i+uv;var coefficient: f32=weights[ i32(2.0-abs(i))];*accumulator+=textureSampleLevel(textureSampler,textureSamplerSampler,offsetUV,0.0)*coefficient;*denominator+=coefficient;}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var colorFull: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0);if (dot(colorFull, vec4f(1.0))==0.0) {fragmentOutputs.color=colorFull;return fragmentOutputs;}
var blurRadius: f32=colorFull.a*255.0; 
var stepSize: vec2f=uniforms.texelOffsetScale.xy*blurRadius;var accumulator: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0)*0.214607;var denominator: f32=0.214607;processSample(input.vUV,1.0,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*0.2,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*0.4,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*0.6,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*0.8,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*1.2,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*1.4,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*1.6,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*1.8,stepSize,&accumulator,&denominator);processSample(input.vUV,1.0*2.0,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*0.2,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*0.4,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*0.6,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*0.8,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*1.2,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*1.4,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*1.6,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*1.8,stepSize,&accumulator,&denominator);processSample(input.vUV,-1.0*2.0,stepSize,&accumulator,&denominator);fragmentOutputs.color= vec4f(accumulator.rgb/denominator,colorFull.a);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["screenSpaceReflection2BlurPixelShaderWGSL",0,{name:c,shader:d}])},733642,a=>{"use strict";var b,c;function d(a,b,c,d){switch(b){case"Animation":return d?a.animations.find(a=>a.uniqueId===c)??null:a.animations[c]??null;case"AnimationGroup":return d?a.animationGroups.find(a=>a.uniqueId===c)??null:a.animationGroups[c]??null;case"Mesh":return d?a.meshes.find(a=>a.uniqueId===c)??null:a.meshes[c]??null;case"Material":return d?a.materials.find(a=>a.uniqueId===c)??null:a.materials[c]??null;case"Camera":return d?a.cameras.find(a=>a.uniqueId===c)??null:a.cameras[c]??null;case"Light":return d?a.lights.find(a=>a.uniqueId===c)??null:a.lights[c]??null;default:return null}}(c=b||(b={})).Animation="Animation",c.AnimationGroup="AnimationGroup",c.Mesh="Mesh",c.Material="Material",c.Camera="Camera",c.Light="Light",a.s(["GetFlowGraphAssetWithType",()=>d])},82167,a=>{"use strict";var b=a.i(733642),c=a.i(503102),d=a.i(779438),e=a.i(994060),f=a.i(419809),g=a.i(210312);class h extends c.FlowGraphBlock{constructor(a){super(a),this.config=a,this.type=this.registerDataInput("type",d.RichTypeAny,a.type),this.value=this.registerDataOutput("value",d.RichTypeAny),this.index=this.registerDataInput("index",d.RichTypeAny,new f.FlowGraphInteger((0,g.getNumericValue)(a.index??-1)))}_updateOutputs(a){let c=this.type.getValue(a),d=this.index.getValue(a),e=(0,b.GetFlowGraphAssetWithType)(a.assetsContext,c,(0,g.getNumericValue)(d),this.config.useIndexAsUniqueId);this.value.setValue(e,a)}getClassName(){return"FlowGraphGetAssetBlock"}}(0,e.RegisterClass)("FlowGraphGetAssetBlock",h),a.s(["FlowGraphGetAssetBlock",()=>h])},968674,a=>{"use strict";var b=a.i(625562);a.i(311781),a.i(492619);let c="kernelBlurFragment",d=`#ifdef DOF
factor=sampleCoC(fragmentInputs.sampleCoord{X}); 
computedWeight=KERNEL_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCoord{X}))*computedWeight;
#else
blend+=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCoord{X})*computedWeight;
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d);let e="kernelBlurFragment2",f=`#ifdef DOF
factor=sampleCoC(fragmentInputs.sampleCenter+uniforms.delta*KERNEL_DEP_OFFSET{X});computedWeight=KERNEL_DEP_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_DEP_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCenter+uniforms.delta*KERNEL_DEP_OFFSET{X}))*computedWeight;
#else
blend+=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCenter+uniforms.delta*KERNEL_DEP_OFFSET{X})*computedWeight;
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[e]||(b.ShaderStore.IncludesShadersStoreWGSL[e]=f);let g="kernelBlurPixelShader",h=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform delta: vec2f;varying sampleCenter: vec2f;
#ifdef DOF
var circleOfConfusionSamplerSampler: sampler;var circleOfConfusionSampler: texture_2d<f32>;fn sampleCoC(offset: vec2f)->f32 {var coc: f32=textureSample(circleOfConfusionSampler,circleOfConfusionSamplerSampler,offset).r;return coc; }
#endif
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#ifdef PACKEDFLOAT
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var computedWeight: f32=0.0;
#ifdef PACKEDFLOAT
var blend: f32=0.;
#else
var blend: vec4f= vec4f(0.);
#endif
#ifdef DOF
var sumOfWeights: f32=CENTER_WEIGHT; 
var factor: f32=0.0;
#ifdef PACKEDFLOAT
blend+=unpack(textureSample(textureSampler,textureSamplerSampler,input.sampleCenter))*CENTER_WEIGHT;
#else
blend+=textureSample(textureSampler,textureSamplerSampler,input.sampleCenter)*CENTER_WEIGHT;
#endif
#endif
#include<kernelBlurFragment>[0..varyingCount]
#include<kernelBlurFragment2>[0..depCount]
#ifdef PACKEDFLOAT
fragmentOutputs.color=pack(blend);
#else
fragmentOutputs.color=blend;
#endif
#ifdef DOF
fragmentOutputs.color/=sumOfWeights;
#endif
}`;b.ShaderStore.ShadersStoreWGSL[g]||(b.ShaderStore.ShadersStoreWGSL[g]=h),a.s(["kernelBlurPixelShaderWGSL",0,{name:g,shader:h}],968674)},200977,a=>{"use strict";var b=a.i(542693),c=a.i(994060),d=a.i(779438),e=a.i(419809);class f extends b.FlowGraphExecutionBlockWithOutSignal{constructor(a){super(a),this.config=a,this.inFlows=[],this._cachedActivationState=[],this.reset=this._registerSignalInput("reset"),this.completed=this._registerSignalOutput("completed"),this.remainingInputs=this.registerDataOutput("remainingInputs",d.RichTypeFlowGraphInteger,new e.FlowGraphInteger(this.config.inputSignalCount||0));for(let a=0;a<this.config.inputSignalCount;a++)this.inFlows.push(this._registerSignalInput(`in_${a}`));this._unregisterSignalInput("in")}_getCurrentActivationState(a){let b=this._cachedActivationState;if(b.length=0,a._hasExecutionVariable(this,"activationState")){let c=a._getExecutionVariable(this,"activationState",[]);for(let a=0;a<c.length;a++)b.push(c[a])}else for(let a=0;a<this.config.inputSignalCount;a++)b.push(!1);return b}_execute(a,b){let c=this._getCurrentActivationState(a);if(b===this.reset)for(let a=0;a<this.config.inputSignalCount;a++)c[a]=!1;else{let a=this.inFlows.indexOf(b);a>=0&&(c[a]=!0)}if(this.remainingInputs.setValue(new e.FlowGraphInteger(c.filter(a=>!a).length),a),a._setExecutionVariable(this,"activationState",c.slice()),c.includes(!1))b!==this.reset&&this.out._activateSignal(a);else{this.completed._activateSignal(a);for(let a=0;a<this.config.inputSignalCount;a++)c[a]=!1}}getClassName(){return"FlowGraphWaitAllBlock"}serialize(a){super.serialize(a),a.config.inputFlows=this.config.inputSignalCount}}(0,c.RegisterClass)("FlowGraphWaitAllBlock",f),a.s(["FlowGraphWaitAllBlock",()=>f])},912249,a=>{"use strict";var b=a.i(625562);let c="lineVertexDeclaration",d=`uniform mat4 viewProjection;
#define ADDITIONAL_VERTEX_DECLARATION
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(658057),a.i(386919);let e="lineUboDeclaration",f=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;b.ShaderStore.IncludesShadersStore[e]||(b.ShaderStore.IncludesShadersStore[e]=f),a.i(306169),a.i(896790),a.i(544248),a.i(37668),a.i(403470),a.i(705551);let g="lineVertexShader",h=`#include<__decl__lineVertex>
#include<instancesDeclaration>
#include<clipPlaneVertexDeclaration>
attribute vec3 position;attribute vec4 normal;uniform float width;uniform float aspectRatio;
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
mat4 worldViewProjection=viewProjection*finalWorld;vec4 viewPosition=worldViewProjection*vec4(position,1.0);vec4 viewPositionNext=worldViewProjection*vec4(normal.xyz,1.0);vec2 currentScreen=viewPosition.xy/viewPosition.w;vec2 nextScreen=viewPositionNext.xy/viewPositionNext.w;currentScreen.x*=aspectRatio;nextScreen.x*=aspectRatio;vec2 dir=normalize(nextScreen-currentScreen);vec2 normalDir=vec2(-dir.y,dir.x);normalDir*=width/2.0;normalDir.x/=aspectRatio;vec4 offset=vec4(normalDir*normal.w,0.0,0.0);gl_Position=viewPosition+offset;
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
vec4 worldPos=finalWorld*vec4(position,1.0);
#include<clipPlaneVertex>
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[g]||(b.ShaderStore.ShadersStore[g]=h),a.s(["lineVertexShader",0,{name:g,shader:h}],912249)},667902,952376,a=>{"use strict";function b(a){return Math.floor(a/8)}class c{constructor(a){this.size=a,this._byteArray=new Uint8Array(Math.ceil(this.size/8))}get(a){if(a>=this.size)throw RangeError("Bit index out of range");let c=b(a),d=1<<a%8;return(this._byteArray[c]&d)!=0}set(a,c){if(a>=this.size)throw RangeError("Bit index out of range");let d=b(a),e=1<<a%8;c?this._byteArray[d]|=e:this._byteArray[d]&=~e}}function d(a){let b=[],d=a.length/3;for(let c=0;c<d;c++)b.push([a[3*c],a[3*c+1],a[3*c+2]]);let e=new Map;for(let a=0;a<b.length;a++)for(let c of b[a]){let b=e.get(c);b||e.set(c,b=[]),b.push(a)}let f=new c(d),g=[],h=a=>{let c=[a];for(;c.length>0;){let a=c.pop();if(!f.get(a))for(let d of(f.set(a,!0),g.push(b[a]),b[a])){let a=e.get(d);if(!a)return;for(let b of a)f.get(b)||c.push(b)}}};for(let a=0;a<d;a++)f.get(a)||h(a);let i=0;for(let b of g)a[i++]=b[0],a[i++]=b[1],a[i++]=b[2]}a.s(["BitArray",()=>c],952376),a.s(["OptimizeIndices",()=>d],667902)},523321,a=>{"use strict";var b=a.i(625562);let c="rsmGlobalIlluminationPixelShader",d=`/**
* The implementation is an application of the formula found in http:
* For better results,it also adds a random (noise) rotation to the RSM samples (the noise artifacts are easier to remove than the banding artifacts).
*/
varying vUV: vec2f;uniform rsmLightMatrix: mat4x4f;uniform rsmInfo: vec4f;uniform rsmInfo2: vec4f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var normalSamplerSampler: sampler;var normalSampler: texture_2d<f32>;var rsmPositionWSampler: sampler;var rsmPositionW: texture_2d<f32>;var rsmNormalWSampler: sampler;var rsmNormalW: texture_2d<f32>;var rsmFluxSampler: sampler;var rsmFlux: texture_2d<f32>;var rsmSamples: texture_2d<f32>;
#ifdef TRANSFORM_NORMAL
uniform invView: mat4x4f;
#endif
fn mod289(x: f32)->f32{return x-floor(x*(1.0/289.0))*289.0;}
fn mod289Vec4(x: vec4f)->vec4f {return x-floor(x*(1.0/289.0))* 289.0;}
fn perm(x: vec4f)->vec4f {return mod289Vec4(((x*34.0)+1.0)*x) ;}
fn noise(p: vec3f)->f32{var a: vec3f=floor(p);var d: vec3f=p-a;d=d*d*(3.0-2.0*d);var b: vec4f=a.xxyy+ vec4f(0.0,1.0,0.0,1.0);var k1: vec4f=perm(b.xyxy);var k2: vec4f=perm(k1.xyxy+b.zzww);var c: vec4f=k2+a.zzzz;var k3: vec4f=perm(c);var k4: vec4f=perm(c+1.0);var o1: vec4f=fract(k3*(1.0/41.0));var o2: vec4f=fract(k4*(1.0/41.0));var o3: vec4f=o2*d.z+o1*(1.0-d.z);var o4: vec2f=o3.yw*d.x+o3.xz*(1.0-d.x);return o4.y*d.y+o4.x*(1.0-d.y);}
fn computeIndirect(p: vec3f,n: vec3f)->vec3f {var indirectDiffuse: vec3f= vec3f(0.);var numSamples: i32= i32(uniforms.rsmInfo.x);var radius: f32=uniforms.rsmInfo.y;var intensity: f32=uniforms.rsmInfo.z;var edgeArtifactCorrection: f32=uniforms.rsmInfo.w;var texRSM: vec4f=uniforms.rsmLightMatrix* vec4f(p,1.);texRSM=vec4f(texRSM.xy/texRSM.w,texRSM.z,texRSM.w);texRSM=vec4f(texRSM.xy*0.5+0.5,texRSM.z,texRSM.w);var angle: f32=noise(p*uniforms.rsmInfo2.x);var c: f32=cos(angle);var s: f32=sin(angle);for (var i: i32=0; i<numSamples; i++) {var rsmSample: vec3f=textureLoad(rsmSamples,vec2<i32>(i,0),0).xyz;var weightSquare: f32=rsmSample.z;if (uniforms.rsmInfo2.y==1.0){rsmSample=vec3f(rsmSample.x*c+rsmSample.y*s,-rsmSample.x*s+rsmSample.y*c,rsmSample.z);}
var uv: vec2f=texRSM.xy+rsmSample.xy*radius;if (uv.x<0. || uv.x>1. || uv.y<0. || uv.y>1.) {continue;}
var vplPositionW: vec3f=textureSampleLevel(rsmPositionW,rsmPositionWSampler,uv,0.).xyz;var vplNormalW: vec3f=textureSampleLevel(rsmNormalW,rsmNormalWSampler,uv,0.).xyz*2.0-1.0;var vplFlux: vec3f=textureSampleLevel(rsmFlux,rsmFluxSampler,uv,0.).rgb;vplPositionW-=vplNormalW*edgeArtifactCorrection; 
var dist2: f32=dot(vplPositionW-p,vplPositionW-p);indirectDiffuse+=vplFlux*weightSquare*max(0.,dot(n,vplPositionW-p))*max(0.,dot(vplNormalW,p-vplPositionW))/(dist2*dist2);}
return clamp(indirectDiffuse*intensity,vec3f(0.0),vec3f(1.0));}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var positionW: vec3f=textureSample(textureSampler,textureSamplerSampler,input.vUV).xyz;var normalW: vec3f=textureSample(normalSampler,normalSamplerSampler,input.vUV).xyz;
#ifdef DECODE_NORMAL
normalW=normalW*2.0-1.0;
#endif
#ifdef TRANSFORM_NORMAL
normalW=(uniforms.invView* vec4f(normalW,0.)).xyz;
#endif
fragmentOutputs.color=vec4f(computeIndirect(positionW,normalW),1.0);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["rsmGlobalIlluminationPixelShaderWGSL",0,{name:c,shader:d}])},101306,a=>{"use strict";var b=a.i(994060),c=a.i(159695),d=a.i(779438),e=a.i(419809);class f extends c.FlowGraphExecutionBlock{constructor(a){super(a),this.config=a,this.outputSignals=[],this.reset=this._registerSignalInput("reset"),this.lastIndex=this.registerDataOutput("lastIndex",d.RichTypeFlowGraphInteger,new e.FlowGraphInteger(-1)),this.setNumberOfOutputSignals(a?.outputSignalCount)}_getNextIndex(a){if(!a.includes(!1)&&this.config.isLoop&&a.fill(!1),!this.config.isRandom)return a.indexOf(!1);{let b=a.map((a,b)=>a?-1:b).filter(a=>-1!==a);return b.length?b[Math.floor(Math.random()*b.length)]:-1}}setNumberOfOutputSignals(a=1){for(;this.outputSignals.length>a;){let a=this.outputSignals.pop();a&&(a.disconnectFromAll(),this._unregisterSignalOutput(a.name))}for(;this.outputSignals.length<a;)this.outputSignals.push(this._registerSignalOutput(`out_${this.outputSignals.length}`))}_execute(a,b){if(a._hasExecutionVariable(this,"indexesUsed")||a._setExecutionVariable(this,"indexesUsed",this.outputSignals.map(()=>!1)),b===this.reset){a._deleteExecutionVariable(this,"indexesUsed"),this.lastIndex.setValue(new e.FlowGraphInteger(-1),a);return}let c=a._getExecutionVariable(this,"indexesUsed",[]),d=this._getNextIndex(c);d>-1&&(this.lastIndex.setValue(new e.FlowGraphInteger(d),a),c[d]=!0,a._setExecutionVariable(this,"indexesUsed",c),this.outputSignals[d]._activateSignal(a))}getClassName(){return"FlowGraphMultiGateBlock"}serialize(a){super.serialize(a),a.config.outputSignalCount=this.config.outputSignalCount,a.config.isRandom=this.config.isRandom,a.config.loop=this.config.isLoop,a.config.startIndex=this.config.startIndex}}(0,b.RegisterClass)("FlowGraphMultiGateBlock",f),a.s(["FlowGraphMultiGateBlock",()=>f])},35193,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(475114),a.i(549432),a.i(315937),a.i(488049),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067),a.i(736380);let c="glowMapGenerationVertexShader",d=`attribute position: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;varying vPosition: vec4f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#ifdef DIFFUSE
varying vUVDiffuse: vec2f;uniform diffuseMatrix: mat4x4f;
#endif
#ifdef OPACITY
varying vUVOpacity: vec2f;uniform opacityMatrix: mat4x4f;
#endif
#ifdef EMISSIVE
varying vUVEmissive: vec2f;uniform emissiveMatrix: mat4x4f;
#endif
#ifdef VERTEXALPHA
attribute color: vec4f;varying vColor: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=input.position;
#ifdef UV1
var uvUpdated: vec2f=input.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=input.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);
#ifdef CUBEMAP
vertexOutputs.vPosition=worldPos;vertexOutputs.position=uniforms.viewProjection*finalWorld* vec4f(input.position,1.0);
#else
vertexOutputs.vPosition=uniforms.viewProjection*worldPos;vertexOutputs.position=vertexOutputs.vPosition;
#endif
#ifdef DIFFUSE
#ifdef DIFFUSEUV1
vertexOutputs.vUVDiffuse= (uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef DIFFUSEUV2
vertexOutputs.vUVDiffuse= (uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#ifdef OPACITY
#ifdef OPACITYUV1
vertexOutputs.vUVOpacity= (uniforms.opacityMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef OPACITYUV2
vertexOutputs.vUVOpacity= (uniforms.opacityMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#ifdef EMISSIVE
#ifdef EMISSIVEUV1
vertexOutputs.vUVEmissive= (uniforms.emissiveMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef EMISSIVEUV2
vertexOutputs.vUVEmissive= (uniforms.emissiveMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#ifdef VERTEXALPHA
vertexOutputs.vColor=vertexInputs.color;
#endif
#include<clipPlaneVertex>
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["glowMapGenerationVertexShaderWGSL",0,{name:c,shader:d}])},319962,a=>{"use strict";var b=a.i(625562);a.i(391617),a.i(597202);let c="kernelBlurFragment",d=`#ifdef DOF
factor=sampleCoC(sampleCoord{X}); 
computedWeight=KERNEL_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCoord{X}))*computedWeight;
#else
blend+=texture2D(textureSampler,sampleCoord{X})*computedWeight;
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d);let e="kernelBlurFragment2",f=`#ifdef DOF
factor=sampleCoC(sampleCenter+delta*KERNEL_DEP_OFFSET{X});computedWeight=KERNEL_DEP_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_DEP_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X}))*computedWeight;
#else
blend+=texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X})*computedWeight;
#endif
`;b.ShaderStore.IncludesShadersStore[e]||(b.ShaderStore.IncludesShadersStore[e]=f);let g="kernelBlurPixelShader",h=`uniform sampler2D textureSampler;uniform vec2 delta;varying vec2 sampleCenter;
#ifdef DOF
uniform sampler2D circleOfConfusionSampler;float sampleCoC(in vec2 offset) {float coc=texture2D(circleOfConfusionSampler,offset).r;return coc; }
#endif
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#ifdef PACKEDFLOAT
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float computedWeight=0.0;
#ifdef PACKEDFLOAT
float blend=0.;
#else
vec4 blend=vec4(0.);
#endif
#ifdef DOF
float sumOfWeights=CENTER_WEIGHT; 
float factor=0.0;
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCenter))*CENTER_WEIGHT;
#else
blend+=texture2D(textureSampler,sampleCenter)*CENTER_WEIGHT;
#endif
#endif
#include<kernelBlurFragment>[0..varyingCount]
#include<kernelBlurFragment2>[0..depCount]
#ifdef PACKEDFLOAT
gl_FragColor=pack(blend);
#else
gl_FragColor=blend;
#endif
#ifdef DOF
gl_FragColor/=sumOfWeights;
#endif
}`;b.ShaderStore.ShadersStore[g]||(b.ShaderStore.ShadersStore[g]=h),a.s(["kernelBlurPixelShader",0,{name:g,shader:h}],319962)},599027,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(475114),a.i(549432),a.i(315937),a.i(488049),a.i(160815),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067),a.i(736380),a.i(5021);let c="outlineVertexShader",d=`attribute position: vec3f;attribute normal: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform offset: f32;
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#ifdef ALPHATEST
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f; 
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input: VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;var normalUpdated: vec3f=vertexInputs.normal;
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
var offsetPosition: vec3f=positionUpdated+(normalUpdated*uniforms.offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(offsetPosition,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["outlineVertexShaderWGSL",0,{name:c,shader:d}])},50709,a=>{"use strict";var b=a.i(625562);let c="iblCdfDebugPixelShader",d=`#define PI 3.1415927
varying vUV: vec2f;var cdfySampler: sampler;var cdfy: texture_2d<f32>;var cdfxSampler: sampler;var cdfx: texture_2d<f32>;var icdfSampler: sampler;var icdf: texture_2d<f32>;
#ifdef IBL_USE_CUBE_MAP
var iblSourceSampler: sampler;var iblSource: texture_cube<f32>;
#else
var iblSourceSampler: sampler;var iblSource: texture_2d<f32>;
#endif
var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define cdfyVSize (0.8/3.0)
#define cdfxVSize 0.1
#define cdfyHSize 0.5
uniform sizeParams: vec4f;
#ifdef IBL_USE_CUBE_MAP
fn equirectangularToCubemapDirection(uv: vec2f)->vec3f {var longitude: f32=uv.x*2.0*PI-PI;var latitude: f32=PI*0.5-uv.y*PI;var direction: vec3f;direction.x=cos(latitude)*sin(longitude);direction.y=sin(latitude);direction.z=cos(latitude)*cos(longitude);return direction;}
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs { 
var colour: vec3f= vec3f(0.0);var uv: vec2f =
vec2f((uniforms.sizeParams.x+input.vUV.x)*uniforms.sizeParams.z,(uniforms.sizeParams.y+input.vUV.y)*uniforms.sizeParams.w);var backgroundColour: vec3f=textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb;var cdfxWidth: u32=textureDimensions(cdfx,0).x;var cdfyHeight: u32=textureDimensions(cdfy,0).y;const iblStart: f32=1.0-cdfyVSize;const pdfStart: f32=1.0-2.0*cdfyVSize;const cdfyStart: f32=1.0-3.0*cdfyVSize;const cdfxStart: f32=1.0-3.0*cdfyVSize-cdfxVSize;const icdfxStart: f32=1.0-3.0*cdfyVSize-2.0*cdfxVSize;
#ifdef IBL_USE_CUBE_MAP
var direction: vec3f=equirectangularToCubemapDirection(
(uv- vec2f(0.0,iblStart))* vec2f(1.0,1.0/cdfyVSize));var iblColour: vec3f=textureSampleLevel(iblSource,iblSourceSampler,direction,0.0).rgb;
#else
var iblColour: vec3f=textureSample(iblSource,iblSourceSampler,(uv- vec2f(0.0,iblStart)) *
vec2f(1.0,1.0/cdfyVSize))
.rgb;
#endif
var pdfColour: vec3f =
textureSample(icdf,icdfSampler,(uv- vec2f(0.0,pdfStart))* vec2f(1.0,1.0/cdfyVSize)).zzz;var cdfyColour: f32 =
textureSample(cdfy,cdfySampler,(uv- vec2f(0.0,cdfyStart))* vec2f(2.0,1.0/cdfyVSize)).r;var icdfyColour: f32 =
textureSample(icdf,icdfSampler,(uv- vec2f(0.5,cdfyStart))* vec2f(2.0,1.0/cdfyVSize)).g;var cdfxColour: f32 =
textureSample(cdfx,cdfxSampler,(uv- vec2f(0.0,cdfxStart))* vec2f(1.0,1.0/cdfxVSize)).r;var icdfxColour: f32=textureSample(icdf,icdfSampler,(uv- vec2f(0.0,icdfxStart)) *
vec2f(1.0,1.0/cdfxVSize)).r;if (uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) {colour=backgroundColour;} else if (uv.y>iblStart) {colour+=iblColour;} else if (uv.y>pdfStart) {colour+=pdfColour;} else if (uv.y>cdfyStart && uv.x<0.5) {colour.r+=cdfyColour/f32(cdfyHeight);} else if (uv.y>cdfyStart && uv.x>0.5) {colour.r+=icdfyColour;} else if (uv.y>cdfxStart) {colour.r+=cdfxColour/f32(cdfxWidth);} else if (uv.y>icdfxStart) {colour.r+=icdfxColour;}
fragmentOutputs.color =vec4(mix(colour,backgroundColour,0.5),1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblCdfDebugPixelShaderWGSL",0,{name:c,shader:d}])},163633,243355,a=>{"use strict";var b=a.i(857692);class c extends b.AbstractAudioBus{constructor(a,b,c){super(a,b),this._spatialAutoUpdate=!0,this._spatialMinUpdateTime=0,this._outBus=null,this._spatial=null,this._onOutBusDisposed=()=>{this.outBus=this.engine.defaultMainBus},"boolean"==typeof c.spatialAutoUpdate&&(this._spatialAutoUpdate=c.spatialAutoUpdate),"number"==typeof c.spatialMinUpdateTime&&(this._spatialMinUpdateTime=c.spatialMinUpdateTime)}get outBus(){return this._outBus}set outBus(a){if(this._outBus!==a){if(this._outBus&&(this._outBus.onDisposeObservable.removeCallback(this._onOutBusDisposed),!this._disconnect(this._outBus)))throw Error("Disconnect failed");if(this._outBus=a,this._outBus&&(this._outBus.onDisposeObservable.add(this._onOutBusDisposed),!this._connect(this._outBus)))throw Error("Connect failed")}}get spatial(){return this._spatial?this._spatial:this._initSpatialProperty()}dispose(){super.dispose(),this._spatial?.dispose(),this._spatial=null,this._outBus=null}_initSpatialProperty(){return this._spatial=this._createSpatialProperty(this._spatialAutoUpdate,this._spatialMinUpdateTime)}}a.s(["AudioBus",()=>c],243355);var d=a.i(633619),e=a.i(470165),f=a.i(221553),g=a.i(736394);class h extends c{constructor(a,b,c){super(a,b,c),this._stereo=null,this._subGraph=new h._SubGraph(this)}async _initAsync(a){a.outBus?this.outBus=a.outBus:(await this.engine.isReadyPromise,this.outBus=this.engine.defaultMainBus),await this._subGraph.initAsync(a),(0,d._HasSpatialAudioOptions)(a)&&this._initSpatialProperty(),this.engine._addNode(this)}dispose(){super.dispose(),this._stereo=null,this.engine._removeNode(this)}get _inNode(){return this._subGraph._inNode}get _outNode(){return this._subGraph._outNode}get stereo(){return this._stereo??(this._stereo=new e._StereoAudio(this._subGraph))}getClassName(){return"_WebAudioBus"}_createSpatialProperty(a,b){return new g._SpatialWebAudio(this._subGraph,a,b)}_connect(a){return!!super._connect(a)&&(a._inNode&&this._outNode?.connect(a._inNode),!0)}_disconnect(a){return!!super._disconnect(a)&&(a._inNode&&this._outNode?.disconnect(a._inNode),!0)}}h._SubGraph=class extends f._WebAudioBusAndSoundSubGraph{get _downstreamNodes(){return this._owner._downstreamNodes??null}get _upstreamNodes(){return this._owner._upstreamNodes??null}},a.s(["_WebAudioBus",()=>h],163633)},928894,a=>{"use strict";var b=a.i(625562);let c="motionBlurPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform motionStrength: f32;uniform motionScale: f32;uniform screenSize: vec2f;
#ifdef OBJECT_BASED
var velocitySamplerSampler: sampler;var velocitySampler: texture_2d<f32>;
#else
var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;uniform inverseViewProjection: mat4x4f;uniform prevViewProjection: mat4x4f;uniform projection: mat4x4f;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#ifdef GEOMETRY_SUPPORTED
#ifdef OBJECT_BASED
var texelSize: vec2f=1.0/uniforms.screenSize;var velocityColor: vec4f=textureSampleLevel(velocitySampler,velocitySamplerSampler,input.vUV,0.0);velocityColor=vec4f(velocityColor.rg*2.0- vec2f(1.0),velocityColor.b,velocityColor.a);let signs=sign(velocityColor.rg);var velocity=pow(abs(velocityColor.rg),vec2f(3.0))*signs*velocityColor.a;velocity*=uniforms.motionScale*uniforms.motionStrength;var speed: f32=length(velocity/texelSize);var samplesCount: i32= i32(clamp(speed,1.0,SAMPLES));velocity=normalize(velocity)*texelSize;var hlim: f32= f32(-samplesCount)*0.5+0.5;var result: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler, input.vUV,0.0);for (var i: i32=1; i< i32(SAMPLES); i++)
{if (i>=samplesCount) {break;}
var offset: vec2f=input.vUV+velocity*(hlim+ f32(i));result+=textureSampleLevel(textureSampler,textureSamplerSampler, offset,0.0);}
fragmentOutputs.color=vec4f(result.rgb/ f32(samplesCount),1.0);
#else
var result: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler, input.vUV,0.0);var texelSize: vec2f=1.0/uniforms.screenSize;var depth: f32=textureSampleLevel(depthSampler,depthSamplerSampler,input.vUV,0.0).r;if (depth==0.0) {fragmentOutputs.color=result;return fragmentOutputs;}
depth=uniforms.projection[2].z+uniforms.projection[3].z/depth; 
var cpos: vec4f= vec4f(input.vUV*2.0-1.0,depth,1.0);cpos=uniforms.inverseViewProjection*cpos;cpos/=cpos.w;var ppos: vec4f=uniforms.prevViewProjection*cpos;ppos/=ppos.w;ppos=vec4f(ppos.xy*0.5+0.5,ppos.zw);var velocity: vec2f=(ppos.xy-input.vUV)*uniforms.motionScale*uniforms.motionStrength;var speed: f32=length(velocity/texelSize);var nSamples: i32= i32(clamp(speed,1.0,SAMPLES));for (var i: i32=1; i< i32(SAMPLES); i++) {if (i>=nSamples) {break;}
var offset1: vec2f=input.vUV+velocity*( f32(i)/ f32(nSamples-1)-0.5);result+=textureSampleLevel(textureSampler,textureSamplerSampler, offset1,0.0);}
fragmentOutputs.color=result/ f32(nSamples);
#endif
#else
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler, input.vUV);
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["motionBlurPixelShaderWGSL",0,{name:c,shader:d}])},914949,a=>{"use strict";var b=a.i(625562);a.i(475114),a.i(549432);let c="iblVoxelGridVertexShader",d=`#include <bakedVertexAnimationDeclaration>
#include <bonesDeclaration>
#include <helperFunctions>
#include <instancesDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef VERTEX_PULLING_USE_INDEX_BUFFER
var<storage,read> indices : array<u32>;
#endif
var<storage,read> position : array<f32>;uniform world : mat4x4f;uniform invWorldScale: mat4x4f;varying vNormalizedPosition : vec3f;flat varying f_swizzle: i32;fn readVertexPosition(index : u32)->vec3f {var pos : vec3f;pos.x=position[index*3];pos.y=position[index*3+1];pos.z=position[index*3+2];return pos;}
fn readVertexIndex(index : u32)->u32 {
#ifndef VERTEX_PULLING_USE_INDEX_BUFFER
return index;
#else
#ifdef VERTEX_PULLING_INDEX_BUFFER_32BITS
return indices[index];
#else
let u32_index=index/2u;let bit_offset=(index & 1u)*16u;return (indices[u32_index]>>bit_offset) & 0xFFFFu;
#endif
#endif
}
fn calculateTriangleNormal(v0
: vec3<f32>,v1
: vec3<f32>,v2
: vec3<f32>)
->vec3<f32> {let edge1=v1-v0;let edge2=v2-v0;let triangleNormal=cross(edge1,edge2);let normalizedTriangleNormal=normalize(triangleNormal);return normalizedTriangleNormal;}
@vertex
fn main(input : VertexInputs)->FragmentInputs {var vertIdx=readVertexIndex(input.vertexIndex);var positionUpdated=readVertexPosition(vertIdx);
#include <morphTargetsVertexGlobal>
let inputPosition: vec3f=positionUpdated;
#include <morphTargetsVertex>(vertexInputs.position\\),inputPosition))[0..maxSimultaneousMorphTargets]
#include <instancesVertex>
#include <bakedVertexAnimation>
#include <bonesVertex>
let worldPos=finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.position=uniforms.invWorldScale*worldPos;var provokingVertNum : u32=input.vertexIndex/3*3;var pos0=readVertexPosition(readVertexIndex(provokingVertNum));var pos1=readVertexPosition(readVertexIndex(provokingVertNum+1));var pos2=readVertexPosition(readVertexIndex(provokingVertNum+2));var N : vec3<f32>=calculateTriangleNormal(pos0,pos1,pos2);N=abs(N);if (N.x>N.y && N.x>N.z) {vertexOutputs.f_swizzle=0;vertexOutputs.position=vec4f(vertexOutputs.position.yzx,1.0);} else if (N.y>N.z) {vertexOutputs.f_swizzle=1;vertexOutputs.position=vec4f(vertexOutputs.position.zxy,1.0);} else {vertexOutputs.f_swizzle=2;vertexOutputs.position=vec4f(vertexOutputs.position.xyz,1.0);}
vertexOutputs.vNormalizedPosition=vertexOutputs.position.xyz*0.5+0.5;vertexOutputs.position.z =
vertexOutputs.vNormalizedPosition.z; }
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblVoxelGridVertexShaderWGSL",0,{name:c,shader:d}])},586319,a=>{"use strict";var b=a.i(994060),c=a.i(542693),d=a.i(779438);class e extends c.FlowGraphExecutionBlockWithOutSignal{constructor(a){if(super(a),!a.variable&&!a.variables)throw Error("FlowGraphSetVariableBlock: variable/variables is not defined");if(a.variables&&a.variable)throw Error("FlowGraphSetVariableBlock: variable and variables are both defined");if(a.variables)for(const b of a.variables)this.registerDataInput(b,d.RichTypeAny);else this.registerDataInput("value",d.RichTypeAny)}_execute(a,b){if(this.config?.variables)for(let b of this.config.variables)this._saveVariable(a,b);else this._saveVariable(a,this.config?.variable,"value");this.out._activateSignal(a)}_saveVariable(a,b,c){let d=a._getGlobalContextVariable("currentlyRunningAnimationGroups",[]);for(let c of d){let e=a.assetsContext.animationGroups.find(a=>a.uniqueId==c);if(e){for(let f of e.targetedAnimations)if(f.target===a&&f.animation.targetProperty===b){e.stop();let b=d.indexOf(c);b>-1&&d.splice(b,1),a._setGlobalContextVariable("currentlyRunningAnimationGroups",d);break}}}let e=this.getDataInput(c||b)?.getValue(a);a.setVariable(b,e)}getClassName(){return"FlowGraphSetVariableBlock"}serialize(a){super.serialize(a),a.config.variable=this.config?.variable}}(0,b.RegisterClass)("FlowGraphSetVariableBlock",e),a.s(["FlowGraphSetVariableBlock",()=>e])},696595,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(937034),a.i(643926),a.i(896790),a.i(306169),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163),a.i(403470);let c="glowMapGenerationVertexShader",d=`attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;varying vec4 vPosition;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef DIFFUSE
varying vec2 vUVDiffuse;uniform mat4 diffuseMatrix;
#endif
#ifdef OPACITY
varying vec2 vUVOpacity;uniform mat4 opacityMatrix;
#endif
#ifdef EMISSIVE
varying vec2 vUVEmissive;uniform mat4 emissiveMatrix;
#endif
#ifdef VERTEXALPHA
attribute vec4 color;varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef CUBEMAP
vPosition=worldPos;gl_Position=viewProjection*finalWorld*vec4(position,1.0);
#else
vPosition=viewProjection*worldPos;gl_Position=vPosition;
#endif
#ifdef DIFFUSE
#ifdef DIFFUSEUV1
vUVDiffuse=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef DIFFUSEUV2
vUVDiffuse=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef OPACITY
#ifdef OPACITYUV1
vUVOpacity=vec2(opacityMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef OPACITYUV2
vUVOpacity=vec2(opacityMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef EMISSIVE
#ifdef EMISSIVEUV1
vUVEmissive=vec2(emissiveMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef EMISSIVEUV2
vUVEmissive=vec2(emissiveMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef VERTEXALPHA
vColor=color;
#endif
#include<clipPlaneVertex>
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["glowMapGenerationVertexShader",0,{name:c,shader:d}])},833327,a=>{"use strict";var b=a.i(625562);a.i(488049),a.i(284660),a.i(142967),a.i(707101);let c="greasedLineVertexShader",d=`#include<instancesDeclaration>
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute grl_widths: f32;
#ifdef GREASED_LINE_USE_OFFSETS
attribute grl_offsets: vec3f; 
#endif
attribute grl_colorPointers: f32;attribute position: vec3f;varying grlCounters: f32;varying grlColorPointer: f32;
#ifdef GREASED_LINE_CAMERA_FACING
attribute grl_nextAndCounters: vec4f;attribute grl_previousAndSide: vec4f;uniform grlResolution: vec2f;uniform grlAspect: f32;uniform grlWidth: f32;uniform grlSizeAttenuation: f32;fn grlFix(i: vec4f,aspect: f32)->vec2f {var res=i.xy/i.w;res.x*=aspect;return res;}
#else
attribute grl_slopes: vec3f;attribute grl_counters: f32;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
vertexOutputs.grlColorPointer=input.grl_colorPointers;let grlMatrix: mat4x4f=scene.viewProjection*mesh.world ;
#ifdef GREASED_LINE_CAMERA_FACING
let grlBaseWidth: f32=uniforms.grlWidth;let grlPrevious: vec3f=input.grl_previousAndSide.xyz;let grlSide: f32=input.grl_previousAndSide.w;let grlNext: vec3f=input.grl_nextAndCounters.xyz;vertexOutputs.grlCounters=input.grl_nextAndCounters.w;let grlWidth:f32=grlBaseWidth*input.grl_widths;
#ifdef GREASED_LINE_USE_OFFSETS
var grlPositionOffset: vec3f=input.grl_offsets;
#else
var grlPositionOffset=vec3f(0.);
#endif
let positionUpdated: vec3f=vertexInputs.position+grlPositionOffset;let worldDir: vec3f=normalize(grlNext-grlPrevious);let nearPosition: vec3f=positionUpdated+(worldDir*0.001);let grlFinalPosition: vec4f=grlMatrix*vec4f(positionUpdated,1.0);let screenNearPos: vec4f=grlMatrix*vec4(nearPosition,1.0);let grlLinePosition: vec2f=grlFix(grlFinalPosition,uniforms.grlAspect);let grlLineNearPosition: vec2f=grlFix(screenNearPos,uniforms.grlAspect);let grlDir: vec2f=normalize(grlLineNearPosition-grlLinePosition);var grlNormal: vec4f=vec4f(-grlDir.y,grlDir.x,0.0,1.0);let grlHalfWidth: f32=0.5*grlWidth;
#if defined(GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM)
grlNormal.x*=-grlHalfWidth;grlNormal.y*=-grlHalfWidth;
#else
grlNormal.x*=grlHalfWidth;grlNormal.y*=grlHalfWidth;
#endif
grlNormal*=scene.projection;if (uniforms.grlSizeAttenuation==1.) {grlNormal.x*=grlFinalPosition.w;grlNormal.y*=grlFinalPosition.w;let pr=vec4f(uniforms.grlResolution,0.0,1.0)*scene.projection;grlNormal.x/=pr.x;grlNormal.y/=pr.y;}
vertexOutputs.position=vec4f(grlFinalPosition.xy+grlNormal.xy*grlSide,grlFinalPosition.z,grlFinalPosition.w);
#else
vertexOutputs.grlCounters=input.grl_counters;vertexOutputs.position=grlMatrix*vec4f((vertexInputs.position+input.grl_offsets)+input.grl_slopes*input.grl_widths,1.0) ;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["greasedLineVertexShaderWGSL",0,{name:c,shader:d}])},593595,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(475114),a.i(549432),a.i(315937),a.i(488049),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067),a.i(736380);let c="depthVertexShader",d=`attribute position: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;uniform depthValues: vec2f;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform view: mat4x4f;varying vViewPos: vec4f;
#endif
varying vDepthMetric: f32;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=input.position;
#ifdef UV1
var uvUpdated: vec2f=input.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=input.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);
#include<clipPlaneVertex>
vertexOutputs.position=uniforms.viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vertexOutputs.vViewPos=uniforms.view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vertexOutputs.vDepthMetric=((-vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#else
vertexOutputs.vDepthMetric=((vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["depthVertexShaderWGSL",0,{name:c,shader:d}])},213586,a=>{"use strict";var b=a.i(344611),c=a.i(422393),d=a.i(994060),e=a.i(210312),f=a.i(779438);class g extends b.FlowGraphEventBlock{constructor(a){super(a),this.config=a,this.type="MeshPick",this.asset=this.registerDataInput("asset",f.RichTypeAny,a?.targetMesh),this.pickedPoint=this.registerDataOutput("pickedPoint",f.RichTypeVector3),this.pickOrigin=this.registerDataOutput("pickOrigin",f.RichTypeVector3),this.pointerId=this.registerDataOutput("pointerId",f.RichTypeNumber),this.pickedMesh=this.registerDataOutput("pickedMesh",f.RichTypeAny),this.pointerType=this.registerDataInput("pointerType",f.RichTypeAny,c.PointerEventTypes.POINTERPICK)}_getReferencedMesh(a){return this.asset.getValue(a)}_executeEvent(a,b){if(this.pointerType.getValue(a)!==b.type)return!0;let c=this._getReferencedMesh(a);return c&&b.pickInfo?.pickedMesh&&(b.pickInfo?.pickedMesh===c||(0,e._IsDescendantOf)(b.pickInfo?.pickedMesh,c))?(this.pointerId.setValue(b.event.pointerId,a),this.pickOrigin.setValue(b.pickInfo.ray?.origin,a),this.pickedPoint.setValue(b.pickInfo.pickedPoint,a),this.pickedMesh.setValue(b.pickInfo.pickedMesh,a),this._execute(a),!this.config?.stopPropagation):(this.pointerId.resetToDefaultValue(a),this.pickOrigin.resetToDefaultValue(a),this.pickedPoint.resetToDefaultValue(a),this.pickedMesh.resetToDefaultValue(a),!0)}_preparePendingTasks(a){}_cancelPendingTasks(a){}getClassName(){return"FlowGraphMeshPickEventBlock"}}(0,d.RegisterClass)("FlowGraphMeshPickEventBlock",g),a.s(["FlowGraphMeshPickEventBlock",()=>g])},784154,a=>{"use strict";var b=a.i(943517),c=a.i(262392);class d{constructor(){this.supportCascades=!0}loadCubeData(a,d,e,f){let g,h=d.getEngine(),i=!1,j=1e3;if(Array.isArray(a))for(let b=0;b<a.length;b++){let e=a[b];d.width=(g=c.DDSTools.GetDDSInfo(e)).width,d.height=g.height,i=(g.isRGB||g.isLuminance||g.mipmapCount>1)&&d.generateMipMaps,h._unpackFlipY(g.isCompressed),c.DDSTools.UploadDDSLevels(h,d,e,g,i,6,-1,b),g.isFourCC||1!==g.mipmapCount?j=g.mipmapCount-1:h.generateMipMapsForCubemap(d)}else d.width=(g=c.DDSTools.GetDDSInfo(a)).width,d.height=g.height,e&&(g.sphericalPolynomial=new b.SphericalPolynomial),i=(g.isRGB||g.isLuminance||g.mipmapCount>1)&&d.generateMipMaps,h._unpackFlipY(g.isCompressed),c.DDSTools.UploadDDSLevels(h,d,a,g,i,6),g.isFourCC||1!==g.mipmapCount?j=g.mipmapCount-1:h.generateMipMapsForCubemap(d,!1);h._setCubeMapTextureParams(d,i,j),d.isReady=!0,d.onLoadedObservable.notifyObservers(d),d.onLoadedObservable.clear(),f&&f({isDDS:!0,width:d.width,info:g,data:a,texture:d})}loadData(a,b,d){let e=c.DDSTools.GetDDSInfo(a),f=(e.isRGB||e.isLuminance||e.mipmapCount>1)&&b.generateMipMaps&&Math.max(e.width,e.height)>>e.mipmapCount-1==1;d(e.width,e.height,f,e.isFourCC,()=>{c.DDSTools.UploadDDSLevels(b.getEngine(),b,a,e,f,1)})}}a.s(["_DDSTextureLoader",()=>d])},551592,a=>{"use strict";var b=a.i(625562);a.i(463068);let c="iblIcdfPixelShader",d=`#include<helperFunctions>
varying vUV: vec2f;
#ifdef IBL_USE_CUBE_MAP
var iblSourceSampler: sampler;var iblSource: texture_cube<f32>;
#else
var iblSourceSampler: sampler;var iblSource: texture_2d<f32>;
#endif
var scaledLuminanceSamplerSampler : sampler;var scaledLuminanceSampler : texture_2d<f32>;var cdfx: texture_2d<f32>;var cdfy: texture_2d<f32>;fn fetchLuminance(coords: vec2f)->f32 {
#ifdef IBL_USE_CUBE_MAP
var direction: vec3f=equirectangularToCubemapDirection(coords);var color: vec3f=textureSampleLevel(iblSource,iblSourceSampler,direction,0.0).rgb;
#else
var color: vec3f=textureSampleLevel(iblSource,iblSourceSampler,coords,0.0).rgb;
#endif
return dot(color,LuminanceEncodeApprox);}
fn fetchCDFx(x: u32)->f32 {return textureLoad(cdfx, vec2u(x,0),0).x;}
fn bisectx(size: u32,targetValue: f32)->f32
{var a: u32=0;var b=size-1;while (b-a>1) {var c: u32=(a+b)>>1;if (fetchCDFx(c)<targetValue) {a=c;}
else {b=c;}}
return mix( f32(a), f32(b),(targetValue-fetchCDFx(a))/(fetchCDFx(b)-fetchCDFx(a)))/ f32(size-1);}
fn fetchCDFy(y: u32,invocationId: u32)->f32 {return textureLoad(cdfy, vec2u(invocationId,y),0).x;}
fn bisecty(size: u32,targetValue: f32,invocationId: u32)->f32
{var a: u32=0;var b=size-1;while (b-a>1) {var c=(a+b)>>1;if (fetchCDFy(c,invocationId)<targetValue) {a=c;}
else {b=c;}}
return mix( f32(a), f32(b),(targetValue-fetchCDFy(a,invocationId))/(fetchCDFy(b,invocationId)-fetchCDFy(a,invocationId)))/ f32(size-1);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var cdfxSize: vec2u=textureDimensions(cdfx,0);var cdfWidth: u32=cdfxSize.x;var icdfWidth: u32=cdfWidth-1;var currentPixel: vec2u= vec2u(fragmentInputs.position.xy);var outputColor: vec3f=vec3f(1.0);if (currentPixel.x==0)
{outputColor.x= 0.0;}
else if (currentPixel.x==icdfWidth-1) {outputColor.x= 1.0;} else {var targetValue: f32=fetchCDFx(cdfWidth-1)*input.vUV.x;outputColor.x= bisectx(cdfWidth,targetValue);}
var cdfySize: vec2u=textureDimensions(cdfy,0);var cdfHeight: u32=cdfySize.y;if (currentPixel.y==0) {outputColor.y= 0.0;}
else if (currentPixel.y==cdfHeight-2) {outputColor.y= 1.0;} else {var targetValue: f32=fetchCDFy(cdfHeight-1,currentPixel.x)*input.vUV.y;outputColor.y= max(bisecty(cdfHeight,targetValue,currentPixel.x),0.0);}
var size : vec2f=vec2f(textureDimensions(scaledLuminanceSampler,0));var highestMip: f32=floor(log2(size.x));var normalization : f32=textureSampleLevel(scaledLuminanceSampler,
scaledLuminanceSamplerSampler,
input.vUV,highestMip)
.r;var pixelLuminance: f32=fetchLuminance(input.vUV);outputColor.z=pixelLuminance/(2.0*PI*normalization);fragmentOutputs.color=vec4( outputColor,1.0);}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblIcdfPixelShaderWGSL",0,{name:c,shader:d}])},913759,a=>{"use strict";var b=a.i(625562);let c="ssao2PixelShader",d=`precision highp float;uniform sampler2D textureSampler;varying vec2 vUV;
#ifdef SSAO
float scales[16]=float[16](
0.1,
0.11406250000000001,
0.131640625,
0.15625,
0.187890625,
0.2265625,
0.272265625,
0.325,
0.384765625,
0.4515625,
0.525390625,
0.60625,
0.694140625,
0.7890625,
0.891015625,
1.0
);uniform float near;uniform float radius;uniform sampler2D depthSampler;uniform sampler2D randomSampler;uniform sampler2D normalSampler;uniform float randTextureTiles;uniform float samplesFactor;uniform vec3 sampleSphere[SAMPLES];uniform float totalStrength;uniform float base;
#ifdef ORTHOGRAPHIC_CAMERA
uniform vec4 viewport;
#else
uniform float xViewport;uniform float yViewport;
#endif
uniform mat3 depthProjection;uniform float maxZ;uniform float minZAspect;uniform vec2 texelSize;uniform mat4 projection;void main()
{vec3 random=textureLod(randomSampler,vUV*randTextureTiles,0.0).rgb;float depth=textureLod(depthSampler,vUV,0.0).r;float depthSign=sign(depth);depth=depth*depthSign;vec3 normal=textureLod(normalSampler,vUV,0.0).rgb;float occlusion=0.0;float correctedRadius=min(radius,minZAspect*depth/near);
#ifdef ORTHOGRAPHIC_CAMERA
vec3 vViewRay=vec3(mix(viewport.x,viewport.y,vUV.x),mix(viewport.z,viewport.w,vUV.y),depthSign);
#else
vec3 vViewRay=vec3((vUV.x*2.0-1.0)*xViewport,(vUV.y*2.0-1.0)*yViewport,depthSign);
#endif
vec3 vDepthFactor=depthProjection*vec3(1.0,1.0,depth);vec3 origin=vViewRay*vDepthFactor;vec3 rvec=random*2.0-1.0;rvec.z=0.0;float dotProduct=dot(rvec,normal);rvec=1.0-abs(dotProduct)>1e-2 ? rvec : vec3(-rvec.y,0.0,rvec.x);vec3 tangent=normalize(rvec-normal*dot(rvec,normal));vec3 bitangent=cross(normal,tangent);mat3 tbn=mat3(tangent,bitangent,normal);float difference;for (int i=0; i<SAMPLES; ++i) {vec3 samplePosition=scales[(i+int(random.x*16.0)) % 16]*tbn*sampleSphere[(i+int(random.y*16.0)) % 16];samplePosition=samplePosition*correctedRadius+origin;vec4 offset=vec4(samplePosition,1.0);offset=projection*offset;offset.xyz/=offset.w;offset.xy=offset.xy*0.5+0.5;if (offset.x<0.0 || offset.y<0.0 || offset.x>1.0 || offset.y>1.0) {continue;}
float sampleDepth=abs(textureLod(depthSampler,offset.xy,0.0).r);difference=depthSign*samplePosition.z-sampleDepth;float rangeCheck=1.0-smoothstep(correctedRadius*0.5,correctedRadius,difference);occlusion+=step(EPSILON,difference)*rangeCheck;}
occlusion=occlusion*(1.0-smoothstep(maxZ*0.75,maxZ,depth));float ao=1.0-totalStrength*occlusion*samplesFactor;float result=clamp(ao+base,0.0,1.0);gl_FragColor=vec4(vec3(result),1.0);}
#endif
#ifdef BLUR
uniform float outSize;uniform float soften;uniform float tolerance;uniform int samples;
#ifndef BLUR_BYPASS
uniform sampler2D depthSampler;
#ifdef BLUR_LEGACY
#define inline
float blur13Bilateral(sampler2D image,vec2 uv,vec2 step) {float result=0.0;vec2 off1=vec2(1.411764705882353)*step;vec2 off2=vec2(3.2941176470588234)*step;vec2 off3=vec2(5.176470588235294)*step;float compareDepth=abs(textureLod(depthSampler,uv,0.0).r);float sampleDepth;float weight;float weightSum=30.0;result+=textureLod(image,uv,0.0).r*30.0;sampleDepth=abs(textureLod(depthSampler,uv+off1,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+= weight;result+=textureLod(image,uv+off1,0.0).r*weight;sampleDepth=abs(textureLod(depthSampler,uv-off1,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+= weight;result+=textureLod(image,uv-off1,0.0).r*weight;sampleDepth=abs(textureLod(depthSampler,uv+off2,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureLod(image,uv+off2,0.0).r*weight;sampleDepth=abs(textureLod(depthSampler,uv-off2,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureLod(image,uv-off2,0.0).r*weight;sampleDepth=abs(textureLod(depthSampler,uv+off3,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureLod(image,uv+off3,0.0).r*weight;sampleDepth=abs(textureLod(depthSampler,uv-off3,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureLod(image,uv-off3,0.0).r*weight;return result/weightSum;}
#endif
#endif
void main()
{float result=0.0;
#ifdef BLUR_BYPASS
result=textureLod(textureSampler,vUV,0.0).r;
#else
#ifdef BLUR_H
vec2 step=vec2(1.0/outSize,0.0);
#else
vec2 step=vec2(0.0,1.0/outSize);
#endif
#ifdef BLUR_LEGACY
result=blur13Bilateral(textureSampler,vUV,step);
#else
float compareDepth=abs(textureLod(depthSampler,vUV,0.0).r);float weightSum=0.0;for (int i=-samples; i<samples; i+=2)
{vec2 samplePos=vUV+step*(float(i)+0.5);float sampleDepth=abs(textureLod(depthSampler,samplePos,0.0).r);float falloff=smoothstep(0.0,
float(samples),
float(samples)-abs(float(i))*soften);float minDivider=tolerance*0.5+0.003;float weight=falloff/( minDivider+abs(compareDepth-sampleDepth));result+=textureLod(textureSampler,samplePos,0.0).r*weight;weightSum+=weight;}
result/=weightSum;
#endif
#endif
gl_FragColor.rgb=vec3(result);gl_FragColor.a=1.0;}
#endif
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["ssao2PixelShader",0,{name:c,shader:d}])},162105,a=>{"use strict";var b,c,d=a.i(523686),e=a.i(503102),f=a.i(779438),g=a.i(994060);(b=c||(c={}))[b.CircleEase=0]="CircleEase",b[b.BackEase=1]="BackEase",b[b.BounceEase=2]="BounceEase",b[b.CubicEase=3]="CubicEase",b[b.ElasticEase=4]="ElasticEase",b[b.ExponentialEase=5]="ExponentialEase",b[b.PowerEase=6]="PowerEase",b[b.QuadraticEase=7]="QuadraticEase",b[b.QuarticEase=8]="QuarticEase",b[b.QuinticEase=9]="QuinticEase",b[b.SineEase=10]="SineEase",b[b.BezierCurveEase=11]="BezierCurveEase";class h extends e.FlowGraphBlock{constructor(a){super(a),this.config=a,this._easingFunctions={},this.type=this.registerDataInput("type",f.RichTypeAny,11),this.mode=this.registerDataInput("mode",f.RichTypeNumber,0),this.parameters=this.registerDataInput("parameters",f.RichTypeAny,[1,0,0,1]),this.easingFunction=this.registerDataOutput("easingFunction",f.RichTypeAny)}_updateOutputs(a){let b=this.type.getValue(a),c=this.mode.getValue(a),e=this.parameters.getValue(a);if(void 0===b||void 0===c)return;let f=`${b}-${c}-${e.join("-")}`;if(!this._easingFunctions[f]){let a=function(a,...b){switch(a){case 11:return new d.BezierCurveEase(...b);case 0:return new d.CircleEase;case 1:return new d.BackEase(...b);case 2:return new d.BounceEase(...b);case 3:return new d.CubicEase;case 4:return new d.ElasticEase(...b);case 5:return new d.ExponentialEase(...b);default:throw Error("Easing type not yet implemented")}}(b,...e);a.setEasingMode(c),this._easingFunctions[f]=a}this.easingFunction.setValue(this._easingFunctions[f],a)}getClassName(){return"FlowGraphEasingBlock"}}(0,g.RegisterClass)("FlowGraphEasingBlock",h),a.s(["EasingFunctionType",()=>c,"FlowGraphEasingBlock",()=>h])},830144,a=>{"use strict";var b=a.i(625562);let c="fxaaPixelShader",d=`#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define TEXTUREFUNC(s,c,l) texture2DLodEXT(s,c,l)
#else
#define TEXTUREFUNC(s,c,b) texture2D(s,c,b)
#endif
uniform sampler2D textureSampler;uniform vec2 texelSize;varying vec2 vUV;varying vec2 sampleCoordS;varying vec2 sampleCoordE;varying vec2 sampleCoordN;varying vec2 sampleCoordW;varying vec2 sampleCoordNW;varying vec2 sampleCoordSE;varying vec2 sampleCoordNE;varying vec2 sampleCoordSW;const float fxaaQualitySubpix=1.0;const float fxaaQualityEdgeThreshold=0.166;const float fxaaQualityEdgeThresholdMin=0.0833;const vec3 kLumaCoefficients=vec3(0.2126,0.7152,0.0722);
#define FxaaLuma(rgba) dot(rgba.rgb,kLumaCoefficients)
void main(){vec2 posM;posM.x=vUV.x;posM.y=vUV.y;vec4 rgbyM=TEXTUREFUNC(textureSampler,vUV,0.0);float lumaM=FxaaLuma(rgbyM);float lumaS=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordS,0.0));float lumaE=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordE,0.0));float lumaN=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordN,0.0));float lumaW=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordW,0.0));float maxSM=max(lumaS,lumaM);float minSM=min(lumaS,lumaM);float maxESM=max(lumaE,maxSM);float minESM=min(lumaE,minSM);float maxWN=max(lumaN,lumaW);float minWN=min(lumaN,lumaW);float rangeMax=max(maxWN,maxESM);float rangeMin=min(minWN,minESM);float rangeMaxScaled=rangeMax*fxaaQualityEdgeThreshold;float range=rangeMax-rangeMin;float rangeMaxClamped=max(fxaaQualityEdgeThresholdMin,rangeMaxScaled);
#ifndef MALI
if(range<rangeMaxClamped) 
{gl_FragColor=rgbyM;return;}
#endif
float lumaNW=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordNW,0.0));float lumaSE=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordSE,0.0));float lumaNE=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordNE,0.0));float lumaSW=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordSW,0.0));float lumaNS=lumaN+lumaS;float lumaWE=lumaW+lumaE;float subpixRcpRange=1.0/range;float subpixNSWE=lumaNS+lumaWE;float edgeHorz1=(-2.0*lumaM)+lumaNS;float edgeVert1=(-2.0*lumaM)+lumaWE;float lumaNESE=lumaNE+lumaSE;float lumaNWNE=lumaNW+lumaNE;float edgeHorz2=(-2.0*lumaE)+lumaNESE;float edgeVert2=(-2.0*lumaN)+lumaNWNE;float lumaNWSW=lumaNW+lumaSW;float lumaSWSE=lumaSW+lumaSE;float edgeHorz4=(abs(edgeHorz1)*2.0)+abs(edgeHorz2);float edgeVert4=(abs(edgeVert1)*2.0)+abs(edgeVert2);float edgeHorz3=(-2.0*lumaW)+lumaNWSW;float edgeVert3=(-2.0*lumaS)+lumaSWSE;float edgeHorz=abs(edgeHorz3)+edgeHorz4;float edgeVert=abs(edgeVert3)+edgeVert4;float subpixNWSWNESE=lumaNWSW+lumaNESE;float lengthSign=texelSize.x;bool horzSpan=edgeHorz>=edgeVert;float subpixA=subpixNSWE*2.0+subpixNWSWNESE;if (!horzSpan)
{lumaN=lumaW;}
if (!horzSpan) 
{lumaS=lumaE;}
if (horzSpan) 
{lengthSign=texelSize.y;}
float subpixB=(subpixA*(1.0/12.0))-lumaM;float gradientN=lumaN-lumaM;float gradientS=lumaS-lumaM;float lumaNN=lumaN+lumaM;float lumaSS=lumaS+lumaM;bool pairN=abs(gradientN)>=abs(gradientS);float gradient=max(abs(gradientN),abs(gradientS));if (pairN)
{lengthSign=-lengthSign;}
float subpixC=clamp(abs(subpixB)*subpixRcpRange,0.0,1.0);vec2 posB;posB.x=posM.x;posB.y=posM.y;vec2 offNP;offNP.x=(!horzSpan) ? 0.0 : texelSize.x;offNP.y=(horzSpan) ? 0.0 : texelSize.y;if (!horzSpan) 
{posB.x+=lengthSign*0.5;}
if (horzSpan)
{posB.y+=lengthSign*0.5;}
vec2 posN;posN.x=posB.x-offNP.x*1.5;posN.y=posB.y-offNP.y*1.5;vec2 posP;posP.x=posB.x+offNP.x*1.5;posP.y=posB.y+offNP.y*1.5;float subpixD=((-2.0)*subpixC)+3.0;float lumaEndN=FxaaLuma(TEXTUREFUNC(textureSampler,posN,0.0));float subpixE=subpixC*subpixC;float lumaEndP=FxaaLuma(TEXTUREFUNC(textureSampler,posP,0.0));if (!pairN) 
{lumaNN=lumaSS;}
float gradientScaled=gradient*1.0/4.0;float lumaMM=lumaM-lumaNN*0.5;float subpixF=subpixD*subpixE;bool lumaMLTZero=lumaMM<0.0;lumaEndN-=lumaNN*0.5;lumaEndP-=lumaNN*0.5;bool doneN=abs(lumaEndN)>=gradientScaled;bool doneP=abs(lumaEndP)>=gradientScaled;if (!doneN) 
{posN.x-=offNP.x*3.0;}
if (!doneN) 
{posN.y-=offNP.y*3.0;}
bool doneNP=(!doneN) || (!doneP);if (!doneP) 
{posP.x+=offNP.x*3.0;}
if (!doneP)
{posP.y+=offNP.y*3.0;}
if (doneNP)
{if (!doneN) lumaEndN=FxaaLuma(TEXTUREFUNC(textureSampler,posN.xy,0.0));if (!doneP) lumaEndP=FxaaLuma(TEXTUREFUNC(textureSampler,posP.xy,0.0));if (!doneN) lumaEndN=lumaEndN-lumaNN*0.5;if (!doneP) lumaEndP=lumaEndP-lumaNN*0.5;doneN=abs(lumaEndN)>=gradientScaled;doneP=abs(lumaEndP)>=gradientScaled;if (!doneN) posN.x-=offNP.x*12.0;if (!doneN) posN.y-=offNP.y*12.0;doneNP=(!doneN) || (!doneP);if (!doneP) posP.x+=offNP.x*12.0;if (!doneP) posP.y+=offNP.y*12.0;}
float dstN=posM.x-posN.x;float dstP=posP.x-posM.x;if (!horzSpan)
{dstN=posM.y-posN.y;}
if (!horzSpan) 
{dstP=posP.y-posM.y;}
bool goodSpanN=(lumaEndN<0.0) != lumaMLTZero;float spanLength=(dstP+dstN);bool goodSpanP=(lumaEndP<0.0) != lumaMLTZero;float spanLengthRcp=1.0/spanLength;bool directionN=dstN<dstP;float dst=min(dstN,dstP);bool goodSpan=directionN ? goodSpanN : goodSpanP;float subpixG=subpixF*subpixF;float pixelOffset=(dst*(-spanLengthRcp))+0.5;float subpixH=subpixG*fxaaQualitySubpix;float pixelOffsetGood=goodSpan ? pixelOffset : 0.0;float pixelOffsetSubpix=max(pixelOffsetGood,subpixH);if (!horzSpan)
{posM.x+=pixelOffsetSubpix*lengthSign;}
if (horzSpan)
{posM.y+=pixelOffsetSubpix*lengthSign;}
#ifdef MALI
if(range<rangeMaxClamped) 
{gl_FragColor=rgbyM;}
else
{gl_FragColor=TEXTUREFUNC(textureSampler,posM,0.0);}
#else
gl_FragColor=TEXTUREFUNC(textureSampler,posM,0.0);
#endif
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fxaaPixelShader",0,{name:c,shader:d}])},786137,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingRenderPixelShader",d=`#define DISABLE_UNIFORMITY_ANALYSIS
#define IOR 1.333
#define ETA 1.0/IOR
#define F0 0.02
uniform sampler2D textureSampler;uniform sampler2D depthSampler;
#ifdef FLUIDRENDERING_DIFFUSETEXTURE
uniform sampler2D diffuseSampler;
#else
uniform vec3 diffuseColor;
#endif
#ifdef FLUIDRENDERING_FIXED_THICKNESS
uniform float thickness;uniform sampler2D bgDepthSampler;
#else
uniform float minimumThickness;uniform sampler2D thicknessSampler;
#endif
#ifdef FLUIDRENDERING_ENVIRONMENT
uniform samplerCube reflectionSampler;
#endif
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_TEXTURE)
uniform sampler2D debugSampler;
#endif
uniform mat4 viewMatrix;uniform mat4 projectionMatrix;uniform mat4 invProjectionMatrix;uniform vec2 texelSize;uniform vec3 dirLight;uniform float cameraFar;uniform float density;uniform float refractionStrength;uniform float fresnelClamp;uniform float specularPower;varying vec2 vUV;vec3 computeViewPosFromUVDepth(vec2 texCoord,float depth) {vec4 ndc;ndc.xy=texCoord*2.0-1.0;
#ifdef FLUIDRENDERING_RHS
ndc.z=-projectionMatrix[2].z+projectionMatrix[3].z/depth;
#else
ndc.z=projectionMatrix[2].z+projectionMatrix[3].z/depth;
#endif
ndc.w=1.0;vec4 eyePos=invProjectionMatrix*ndc;eyePos.xyz/=eyePos.w;return eyePos.xyz;}
vec3 getViewPosFromTexCoord(vec2 texCoord) {float depth=textureLod(depthSampler,texCoord,0.).x;return computeViewPosFromUVDepth(texCoord,depth);}
void main(void) {vec2 texCoord=vUV;
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_TEXTURE)
vec4 color=texture2D(debugSampler,texCoord);
#ifdef FLUIDRENDERING_DEBUG_DEPTH
glFragColor=vec4(color.rgb/vec3(2.0),1.);if (color.r>0.999 && color.g>0.999) {glFragColor=texture2D(textureSampler,texCoord);}
#else
glFragColor=vec4(color.rgb,1.);if (color.r<0.001 && color.g<0.001 && color.b<0.001) {glFragColor=texture2D(textureSampler,texCoord);}
#endif
return;
#endif
vec2 depthVel=textureLod(depthSampler,texCoord,0.).rg;float depth=depthVel.r;
#ifndef FLUIDRENDERING_FIXED_THICKNESS
float thickness=texture2D(thicknessSampler,texCoord).x;
#else
float bgDepth=texture2D(bgDepthSampler,texCoord).x;float depthNonLinear=projectionMatrix[2].z+projectionMatrix[3].z/depth;depthNonLinear=depthNonLinear*0.5+0.5;
#endif
vec4 backColor=texture2D(textureSampler,texCoord);
#ifndef FLUIDRENDERING_FIXED_THICKNESS
if (depth>=cameraFar || depth<=0. || thickness<=minimumThickness) {
#else
if (depth>=cameraFar || depth<=0. || bgDepth<=depthNonLinear) {
#endif
#ifdef FLUIDRENDERING_COMPOSITE_MODE
glFragColor.rgb=backColor.rgb*backColor.a;glFragColor.a=backColor.a;
#else
glFragColor=backColor;
#endif
return;}
vec3 viewPos=computeViewPosFromUVDepth(texCoord,depth);vec3 ddx=getViewPosFromTexCoord(texCoord+vec2(texelSize.x,0.))-viewPos;vec3 ddy=getViewPosFromTexCoord(texCoord+vec2(0.,texelSize.y))-viewPos;vec3 ddx2=viewPos-getViewPosFromTexCoord(texCoord+vec2(-texelSize.x,0.));if (abs(ddx.z)>abs(ddx2.z)) {ddx=ddx2;}
vec3 ddy2=viewPos-getViewPosFromTexCoord(texCoord+vec2(0.,-texelSize.y));if (abs(ddy.z)>abs(ddy2.z)) {ddy=ddy2;}
vec3 normal=normalize(cross(ddy,ddx));
#ifdef FLUIDRENDERING_RHS
normal=-normal;
#endif
#ifndef WEBGPU
if(isnan(normal.x) || isnan(normal.y) || isnan(normal.z) || isinf(normal.x) || isinf(normal.y) || isinf(normal.z)) {normal=vec3(0.,0.,-1.);}
#endif
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_SHOWNORMAL)
glFragColor=vec4(normal*0.5+0.5,1.0);return;
#endif
vec3 rayDir=normalize(viewPos); 
#ifdef FLUIDRENDERING_DIFFUSETEXTURE
vec3 diffuseColor=textureLod(diffuseSampler,texCoord,0.0).rgb;
#endif
vec3 lightDir=normalize(vec3(viewMatrix*vec4(-dirLight,0.)));vec3 H =normalize(lightDir-rayDir);float specular=pow(max(0.0,dot(H,normal)),specularPower);
#ifdef FLUIDRENDERING_DEBUG_DIFFUSERENDERING
float diffuse =max(0.0,dot(lightDir,normal))*1.0;glFragColor=vec4(vec3(0.1) /*ambient*/+vec3(0.42,0.50,1.00)*diffuse+vec3(0,0,0.2)+specular,1.);return;
#endif
vec3 refractionDir=refract(rayDir,normal,ETA);vec4 transmitted=textureLod(textureSampler,vec2(texCoord+refractionDir.xy*thickness*refractionStrength),0.0);
#ifdef FLUIDRENDERING_COMPOSITE_MODE
if (transmitted.a==0.) transmitted.a=thickness;
#endif
vec3 transmittance=exp(-density*thickness*(1.0-diffuseColor)); 
vec3 refractionColor=transmitted.rgb*transmittance;
#ifdef FLUIDRENDERING_ENVIRONMENT
vec3 reflectionDir=reflect(rayDir,normal);vec3 reflectionColor=(textureCube(reflectionSampler,reflectionDir).rgb);float fresnel=clamp(F0+(1.0-F0)*pow(1.0-dot(normal,-rayDir),5.0),0.,fresnelClamp);vec3 finalColor=mix(refractionColor,reflectionColor,fresnel)+specular;
#else
vec3 finalColor=refractionColor+specular;
#endif
#ifdef FLUIDRENDERING_VELOCITY
float velocity=depthVel.g;finalColor=mix(finalColor,vec3(1.0),smoothstep(0.3,1.0,velocity/6.0));
#endif
glFragColor=vec4(finalColor,transmitted.a);}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["fluidRenderingRenderPixelShader",0,{name:c,shader:d}])},881753,a=>{"use strict";var b=a.i(625562);let c="shadowMapFragment",d=`float depthSM=vDepthMetricSM;
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
#if SM_USEDISTANCE==1
depthSM=(length(vPositionWSM-lightDataSM)+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
depthSM=(-zSM+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#else
depthSM=(zSM+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#endif
depthSM=clamp(depthSM,0.0,1.0);
#ifdef USE_REVERSE_DEPTHBUFFER
gl_FragDepth=clamp(1.0-depthSM,0.0,1.0);
#else
gl_FragDepth=clamp(depthSM,0.0,1.0); 
#endif
#elif SM_USEDISTANCE==1
depthSM=(length(vPositionWSM-lightDataSM)+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#if SM_ESM==1
depthSM=clamp(exp(-min(87.,biasAndScaleSM.z*depthSM)),0.,1.);
#endif
#if SM_FLOAT==1
gl_FragColor=vec4(depthSM,1.0,1.0,1.0);
#else
gl_FragColor=pack(depthSM);
#endif
return;`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s(["shadowMapFragment",0,{name:c,shader:d}])},60799,a=>{"use strict";var b=a.i(625562);a.i(597202);let c="bayerDitherFunctions",d=`float bayerDither2(vec2 _P) {return mod(2.0*_P.y+_P.x+1.0,4.0);}
float bayerDither4(vec2 _P) {vec2 P1=mod(_P,2.0); 
vec2 P2=floor(0.5*mod(_P,4.0)); 
return 4.0*bayerDither2(P1)+bayerDither2(P2);}
float bayerDither8(vec2 _P) {vec2 P1=mod(_P,2.0); 
vec2 P2=floor(0.5 *mod(_P,4.0)); 
vec2 P4=floor(0.25*mod(_P,8.0)); 
return 4.0*(4.0*bayerDither2(P1)+bayerDither2(P2))+bayerDither2(P4);}
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d);let e="shadowMapFragmentExtraDeclaration",f=`#if SM_FLOAT==0
#include<packingFunctions>
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#include<bayerDitherFunctions>
uniform vec2 softTransparentShadowSM;
#endif
varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
uniform vec3 lightDataSM;varying vec3 vPositionWSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`;b.ShaderStore.IncludesShadersStore[e]||(b.ShaderStore.IncludesShadersStore[e]=f),a.i(681682),a.i(874402),a.i(881753);let g="shadowMapPixelShader",h=`#include<shadowMapFragmentExtraDeclaration>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
#ifdef ALPHATEXTURE
vec4 opacityMap=texture2D(diffuseSampler,vUV);float alphaFromAlphaTexture=opacityMap.a;
#if SM_SOFTTRANSPARENTSHADOW==1
if (softTransparentShadowSM.y==1.0) {opacityMap.rgb=opacityMap.rgb*vec3(0.3,0.59,0.11);alphaFromAlphaTexture=opacityMap.x+opacityMap.y+opacityMap.z;}
#endif
#ifdef ALPHATESTVALUE
if (alphaFromAlphaTexture<ALPHATESTVALUE)
discard;
#endif
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#ifdef ALPHATEXTURE
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alphaFromAlphaTexture) discard;
#else
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x) discard;
#endif
#endif
#include<shadowMapFragment>
}`;b.ShaderStore.ShadersStore[g]||(b.ShaderStore.ShadersStore[g]=h),a.s(["shadowMapPixelShader",0,{name:g,shader:h}],60799)},291396,a=>{"use strict";var b=a.i(625562);a.i(315937),a.i(431801),a.i(160815),a.i(736380),a.i(43607),a.i(5021);let c="particlesVertexShader",d=`attribute position: vec3f;attribute color: vec4f;attribute angle: f32;attribute size: vec2f;
#ifdef ANIMATESHEET
attribute cellIndex: f32;
#endif
#ifndef BILLBOARD
attribute direction: vec3f;
#endif
#ifdef BILLBOARDSTRETCHED
attribute direction: vec3f;
#endif
#ifdef RAMPGRADIENT
attribute remapData: vec4f;
#endif
attribute offset: vec2f;uniform view: mat4x4f;uniform projection: mat4x4f;uniform translationPivot: vec2f;
#ifdef ANIMATESHEET
uniform particlesInfos: vec3f; 
#endif
varying vUV: vec2f;varying vColor: vec4f;
#ifdef RAMPGRADIENT
varying remapRanges: vec4f;
#endif
#if defined(BILLBOARD) && !defined(BILLBOARDY) && !defined(BILLBOARDSTRETCHED)
uniform invView: mat4x4f;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<logDepthDeclaration>
#ifdef BILLBOARD
uniform eyePosition: vec3f;
#endif
fn rotate(yaxis: vec3f,rotatedCorner: vec3f)->vec3f {var xaxis: vec3f=normalize(cross( vec3f(0.,1.0,0.),yaxis));var zaxis: vec3f=normalize(cross(yaxis,xaxis));var row0: vec3f= vec3f(xaxis.x,xaxis.y,xaxis.z);var row1: vec3f= vec3f(yaxis.x,yaxis.y,yaxis.z);var row2: vec3f= vec3f(zaxis.x,zaxis.y,zaxis.z);var rotMatrix: mat3x3f= mat3x3f(row0,row1,row2);var alignedCorner: vec3f=rotMatrix*rotatedCorner;return vertexInputs.position+alignedCorner;}
#ifdef BILLBOARDSTRETCHED
fn rotateAlign(toCamera: vec3f,rotatedCorner: vec3f)->vec3f {var normalizedToCamera: vec3f=normalize(toCamera);var normalizedCrossDirToCamera: vec3f=normalize(cross(normalize(vertexInputs.direction),normalizedToCamera));var row0: vec3f= vec3f(normalizedCrossDirToCamera.x,normalizedCrossDirToCamera.y,normalizedCrossDirToCamera.z);var row2: vec3f= vec3f(normalizedToCamera.x,normalizedToCamera.y,normalizedToCamera.z);
#ifdef BILLBOARDSTRETCHED_LOCAL
var row1: vec3f=normalize(vertexInputs.direction);
#else
var crossProduct: vec3f=normalize(cross(normalizedToCamera,normalizedCrossDirToCamera));var row1: vec3f= vec3f(crossProduct.x,crossProduct.y,crossProduct.z);
#endif
var rotMatrix: mat3x3f= mat3x3f(row0,row1,row2);var alignedCorner: vec3f=rotMatrix*rotatedCorner;return vertexInputs.position+alignedCorner;}
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var cornerPos: vec2f;var vPositionW: vec3f;cornerPos=( vec2f(input.offset.x-0.5,input.offset.y -0.5)-uniforms.translationPivot)*input.size;
#ifdef BILLBOARD
var rotatedCorner: vec3f;
#ifdef BILLBOARDY
rotatedCorner.x=cornerPos.x*cos(input.angle)-cornerPos.y*sin(input.angle)+uniforms.translationPivot.x;rotatedCorner.z=cornerPos.x*sin(input.angle)+cornerPos.y*cos(input.angle)+uniforms.translationPivot.y;rotatedCorner.y=0.;var yaxis: vec3f=input.position-uniforms.eyePosition;yaxis.y=0.;vPositionW=rotate(normalize(yaxis),rotatedCorner);var viewPos: vec3f=(uniforms.view* vec4f(vPositionW,1.0)).xyz;
#elif defined(BILLBOARDSTRETCHED)
rotatedCorner.x=cornerPos.x*cos(input.angle)-cornerPos.y*sin(input.angle)+uniforms.translationPivot.x;rotatedCorner.y=cornerPos.x*sin(input.angle)+cornerPos.y*cos(input.angle)+uniforms.translationPivot.y;rotatedCorner.z=0.;var toCamera: vec3f=input.position-uniforms.eyePosition;vPositionW=rotateAlign(toCamera,rotatedCorner);var viewPos: vec3f=(uniforms.view* vec4f(vPositionW,1.0)).xyz;
#else
rotatedCorner.x=cornerPos.x*cos(input.angle)-cornerPos.y*sin(input.angle)+uniforms.translationPivot.x;rotatedCorner.y=cornerPos.x*sin(input.angle)+cornerPos.y*cos(input.angle)+uniforms.translationPivot.y;rotatedCorner.z=0.;var viewPos: vec3f=(uniforms.view* vec4f(input.position,1.0)).xyz+rotatedCorner;vPositionW=(uniforms.invView* vec4f(viewPos,1)).xyz;
#endif
#ifdef RAMPGRADIENT
vertexOutputs.remapRanges=input.remapData;
#endif
vertexOutputs.position=uniforms.projection* vec4f(viewPos,1.0);
#else
var rotatedCorner: vec3f;rotatedCorner.x=cornerPos.x*cos(input.angle)-cornerPos.y*sin(input.angle)+uniforms.translationPivot.x;rotatedCorner.z=cornerPos.x*sin(input.angle)+cornerPos.y*cos(input.angle)+uniforms.translationPivot.y;rotatedCorner.y=0.;var yaxis: vec3f=normalize(vertexInputs.direction);vPositionW=rotate(yaxis,rotatedCorner);vertexOutputs.position=uniforms.projection*uniforms.view* vec4f(vPositionW,1.0);
#endif
vertexOutputs.vColor=input.color;
#ifdef ANIMATESHEET
var rowOffset: f32=floor(input.cellIndex*uniforms.particlesInfos.z);var columnOffset: f32=input.cellIndex-rowOffset/uniforms.particlesInfos.z;var uvScale: vec2f=uniforms.particlesInfos.xy;var uvOffset: vec2f= vec2f(input.offset.x ,1.0-input.offset.y);vertexOutputs.vUV=(uvOffset+ vec2f(columnOffset,rowOffset))*uvScale;
#else
vertexOutputs.vUV=input.offset;
#endif
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6) || defined(FOG)
var worldPos: vec4f= vec4f(vPositionW,1.0);
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["particlesVertexShaderWGSL",0,{name:c,shader:d}])},472705,a=>{"use strict";var b=a.i(779438),c=a.i(994060),d=a.i(392511),e=a.i(70458);class f extends e.FlowGraphAsyncExecutionBlock{constructor(a){super(a),this.animationGroup=this.registerDataInput("animationGroup",b.RichTypeAny),this.stopAtFrame=this.registerDataInput("stopAtFrame",b.RichTypeNumber,-1)}_preparePendingTasks(a){let b=this.animationGroup.getValue(a),c=this.stopAtFrame.getValue(a)??-1,d=a._getGlobalContextVariable("pendingStopAnimations",[]);d.push({uniqueId:b.uniqueId,stopAtFrame:c}),a._setGlobalContextVariable("pendingStopAnimations",d)}_cancelPendingTasks(a){let b=this.animationGroup.getValue(a),c=a._getGlobalContextVariable("pendingStopAnimations",[]);for(let d=0;d<c.length;d++)if(c[d].uniqueId===b.uniqueId){c.splice(d,1),a._setGlobalContextVariable("pendingStopAnimations",c);break}}_execute(a){let b=this.animationGroup.getValue(a),c=this.stopAtFrame.getValue(a)??-1;return b?isNaN(c)?this._reportError(a,"Invalid stop time."):void(c>0?this._startPendingTasks(a):this._stopAnimation(b,a),this.out._activateSignal(a)):(d.Logger.Warn("No animation group provided to stop."),this._reportError(a,"No animation group provided to stop."))}_executeOnTick(a){let b=this.animationGroup.getValue(a),c=a._getGlobalContextVariable("pendingStopAnimations",[]);for(let d=0;d<c.length;d++)if(c[d].uniqueId===b.uniqueId&&b.getCurrentFrame()>=c[d].stopAtFrame){this._stopAnimation(b,a),c.splice(d,1),a._setGlobalContextVariable("pendingStopAnimations",c),this.done._activateSignal(a),a._removePendingBlock(this);break}}getClassName(){return"FlowGraphStopAnimationBlock"}_stopAnimation(a,b){let c=b._getGlobalContextVariable("currentlyRunningAnimationGroups",[]),d=c.indexOf(a.uniqueId);-1!==d&&(a.stop(),c.splice(d,1),b._setGlobalContextVariable("currentlyRunningAnimationGroups",c))}}(0,c.RegisterClass)("FlowGraphStopAnimationBlock",f),a.s(["FlowGraphStopAnimationBlock",()=>f])},881480,a=>{"use strict";var b=a.i(625562);a.i(896790),a.i(506404),a.i(544248),a.i(403470),a.i(164403),a.i(705551);let c="particlesVertexShader",d=`attribute vec3 position;attribute vec4 color;attribute float angle;attribute vec2 size;
#ifdef ANIMATESHEET
attribute float cellIndex;
#endif
#ifndef BILLBOARD
attribute vec3 direction;
#endif
#ifdef BILLBOARDSTRETCHED
attribute vec3 direction;
#endif
#ifdef RAMPGRADIENT
attribute vec4 remapData;
#endif
attribute vec2 offset;uniform mat4 view;uniform mat4 projection;uniform vec2 translationPivot;
#ifdef ANIMATESHEET
uniform vec3 particlesInfos; 
#endif
varying vec2 vUV;varying vec4 vColor;
#ifdef RAMPGRADIENT
varying vec4 remapRanges;
#endif
#if defined(BILLBOARD) && !defined(BILLBOARDY) && !defined(BILLBOARDSTRETCHED)
uniform mat4 invView;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<logDepthDeclaration>
#ifdef BILLBOARD
uniform vec3 eyePosition;
#endif
vec3 rotate(vec3 yaxis,vec3 rotatedCorner) {vec3 xaxis=normalize(cross(vec3(0.,1.0,0.),yaxis));vec3 zaxis=normalize(cross(yaxis,xaxis));vec3 row0=vec3(xaxis.x,xaxis.y,xaxis.z);vec3 row1=vec3(yaxis.x,yaxis.y,yaxis.z);vec3 row2=vec3(zaxis.x,zaxis.y,zaxis.z);mat3 rotMatrix= mat3(row0,row1,row2);vec3 alignedCorner=rotMatrix*rotatedCorner;return position+alignedCorner;}
#ifdef BILLBOARDSTRETCHED
vec3 rotateAlign(vec3 toCamera,vec3 rotatedCorner) {vec3 normalizedToCamera=normalize(toCamera);vec3 normalizedCrossDirToCamera=normalize(cross(normalize(direction),normalizedToCamera));vec3 row0=vec3(normalizedCrossDirToCamera.x,normalizedCrossDirToCamera.y,normalizedCrossDirToCamera.z);vec3 row2=vec3(normalizedToCamera.x,normalizedToCamera.y,normalizedToCamera.z);
#ifdef BILLBOARDSTRETCHED_LOCAL
vec3 row1=normalize(direction);
#else
vec3 crossProduct=normalize(cross(normalizedToCamera,normalizedCrossDirToCamera));vec3 row1=vec3(crossProduct.x,crossProduct.y,crossProduct.z);
#endif
mat3 rotMatrix= mat3(row0,row1,row2);vec3 alignedCorner=rotMatrix*rotatedCorner;return position+alignedCorner;}
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vec2 cornerPos;vec3 vPositionW;cornerPos=(vec2(offset.x-0.5,offset.y -0.5)-translationPivot)*size;
#ifdef BILLBOARD
vec3 rotatedCorner;
#ifdef BILLBOARDY
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);rotatedCorner.z=cornerPos.x*sin(angle)+cornerPos.y*cos(angle);rotatedCorner.y=0.;rotatedCorner.xz+=translationPivot;vec3 yaxis=position-eyePosition;yaxis.y=0.;vPositionW=rotate(normalize(yaxis),rotatedCorner);vec3 viewPos=(view*vec4(vPositionW,1.0)).xyz;
#elif defined(BILLBOARDSTRETCHED)
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);rotatedCorner.y=cornerPos.x*sin(angle)+cornerPos.y*cos(angle);rotatedCorner.z=0.;rotatedCorner.xy+=translationPivot;vec3 toCamera=position-eyePosition;vPositionW=rotateAlign(toCamera,rotatedCorner);vec3 viewPos=(view*vec4(vPositionW,1.0)).xyz;
#else
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);rotatedCorner.y=cornerPos.x*sin(angle)+cornerPos.y*cos(angle);rotatedCorner.z=0.;rotatedCorner.xy+=translationPivot;vec3 viewPos=(view*vec4(position,1.0)).xyz+rotatedCorner;vPositionW=(invView*vec4(viewPos,1)).xyz;
#endif
#ifdef RAMPGRADIENT
remapRanges=remapData;
#endif
gl_Position=projection*vec4(viewPos,1.0);
#else
vec3 rotatedCorner;rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);rotatedCorner.z=cornerPos.x*sin(angle)+cornerPos.y*cos(angle);rotatedCorner.y=0.;rotatedCorner.xz+=translationPivot;vec3 yaxis=normalize(direction);vPositionW=rotate(yaxis,rotatedCorner);gl_Position=projection*view*vec4(vPositionW,1.0);
#endif
vColor=color;
#ifdef ANIMATESHEET
float rowOffset=floor(cellIndex*particlesInfos.z);float columnOffset=cellIndex-rowOffset/particlesInfos.z;vec2 uvScale=particlesInfos.xy;vec2 uvOffset=vec2(offset.x ,1.0-offset.y);vUV=(uvOffset+vec2(columnOffset,rowOffset))*uvScale;
#else
vUV=offset;
#endif
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6) || defined(FOG)
vec4 worldPos=vec4(vPositionW,1.0);
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["particlesVertexShader",0,{name:c,shader:d}])},864167,a=>{"use strict";var b=a.i(625562);a.i(681682);let c="mrtFragmentDeclaration",d=`#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
layout(location=0) out vec4 glFragData[{X}];
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(996370),a.i(125022),a.i(964653),a.i(874402),a.i(346705);let e="geometryPixelShader",f=`#extension GL_EXT_draw_buffers : require
#if defined(BUMP) || !defined(NORMAL)
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
#ifdef BUMP
varying mat4 vWorldView;varying vec3 vNormalW;
#else
varying vec3 vNormalV;
#endif
varying vec4 vViewPos;
#if defined(POSITION) || defined(BUMP)
varying vec3 vPositionW;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
varying vec4 vCurrentPosition;varying vec4 vPreviousPosition;
#endif
#ifdef NEED_UV
varying vec2 vUV;
#endif
#ifdef BUMP
uniform vec3 vBumpInfos;uniform vec2 vTangentSpaceParams;
#endif
#if defined(REFLECTIVITY)
#if defined(ORMTEXTURE) || defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
uniform sampler2D reflectivitySampler;varying vec2 vReflectivityUV;
#else
#ifdef METALLIC_TEXTURE
uniform sampler2D metallicSampler;varying vec2 vMetallicUV;
#endif
#ifdef ROUGHNESS_TEXTURE
uniform sampler2D roughnessSampler;varying vec2 vRoughnessUV;
#endif
#endif
#ifdef ALBEDOTEXTURE
varying vec2 vAlbedoUV;uniform sampler2D albedoSampler;
#endif
#ifdef REFLECTIVITYCOLOR
uniform vec3 reflectivityColor;
#endif
#ifdef ALBEDOCOLOR
uniform vec3 albedoColor;
#endif
#ifdef METALLIC
uniform float metallic;
#endif
#if defined(ROUGHNESS) || defined(GLOSSINESS)
uniform float glossiness;
#endif
#endif
#if defined(ALPHATEST) && defined(NEED_UV)
uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#include<mrtFragmentDeclaration>[SCENE_MRT_COUNT]
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<helperFunctions>
void main() {
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
vec3 normalOutput;
#ifdef BUMP
vec3 normalW=normalize(vNormalW);
#include<bumpFragment>
#ifdef NORMAL_WORLDSPACE
normalOutput=normalW;
#else
normalOutput=normalize(vec3(vWorldView*vec4(normalW,0.0)));
#endif
#elif defined(HAS_NORMAL_ATTRIBUTE)
normalOutput=normalize(vNormalV);
#elif defined(POSITION)
normalOutput=normalize(-cross(dFdx(vPositionW),dFdy(vPositionW)));
#endif
#ifdef ENCODE_NORMAL
normalOutput=normalOutput*0.5+0.5;
#endif
#ifdef DEPTH
gl_FragData[DEPTH_INDEX]=vec4(vViewPos.z/vViewPos.w,0.0,0.0,1.0);
#endif
#ifdef NORMAL
gl_FragData[NORMAL_INDEX]=vec4(normalOutput,1.0);
#endif
#ifdef SCREENSPACE_DEPTH
gl_FragData[SCREENSPACE_DEPTH_INDEX]=vec4(gl_FragCoord.z,0.0,0.0,1.0);
#endif
#ifdef POSITION
gl_FragData[POSITION_INDEX]=vec4(vPositionW,1.0);
#endif
#ifdef VELOCITY
vec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;vec2 b=(vPreviousPosition.xy/vPreviousPosition.w)*0.5+0.5;vec2 velocity=abs(a-b);velocity=vec2(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;gl_FragData[VELOCITY_INDEX]=vec4(velocity,0.0,1.0);
#endif
#ifdef VELOCITY_LINEAR
vec2 velocity=vec2(0.5)*((vPreviousPosition.xy/vPreviousPosition.w) -
(vCurrentPosition.xy/vCurrentPosition.w));gl_FragData[VELOCITY_LINEAR_INDEX]=vec4(velocity,0.0,1.0);
#endif
#ifdef REFLECTIVITY
vec4 reflectivity=vec4(0.0,0.0,0.0,1.0);
#ifdef METALLICWORKFLOW
float metal=1.0;float roughness=1.0;
#ifdef ORMTEXTURE
metal*=texture2D(reflectivitySampler,vReflectivityUV).b;roughness*=texture2D(reflectivitySampler,vReflectivityUV).g;
#else
#ifdef METALLIC_TEXTURE
metal*=texture2D(metallicSampler,vMetallicUV).r;
#endif
#ifdef ROUGHNESS_TEXTURE
roughness*=texture2D(roughnessSampler,vRoughnessUV).r;
#endif
#endif
#ifdef METALLIC
metal*=metallic;
#endif
#ifdef ROUGHNESS
roughness*=(1.0-glossiness); 
#endif
reflectivity.a-=roughness;vec3 color=vec3(1.0);
#ifdef ALBEDOTEXTURE
color=texture2D(albedoSampler,vAlbedoUV).rgb;
#ifdef GAMMAALBEDO
color=toLinearSpace(color);
#endif
#endif
#ifdef ALBEDOCOLOR
color*=albedoColor.xyz;
#endif
reflectivity.rgb=mix(vec3(0.04),color,metal);
#else
#if defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
reflectivity=texture2D(reflectivitySampler,vReflectivityUV);
#ifdef GAMMAREFLECTIVITYTEXTURE
reflectivity.rgb=toLinearSpace(reflectivity.rgb);
#endif
#else 
#ifdef REFLECTIVITYCOLOR
reflectivity.rgb=toLinearSpace(reflectivityColor.xyz);reflectivity.a=1.0;
#endif
#endif
#ifdef GLOSSINESSS
reflectivity.a*=glossiness; 
#endif
#endif
gl_FragData[REFLECTIVITY_INDEX]=reflectivity;
#endif
}
`;b.ShaderStore.ShadersStore[e]||(b.ShaderStore.ShadersStore[e]=f),a.s(["geometryPixelShader",0,{name:e,shader:f}],864167)},616038,a=>{"use strict";var b=a.i(71870),c=a.i(779438),d=a.i(994060),e=a.i(419809);class f extends b.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeBoolean,c.RichTypeNumber,a=>+a,"FlowGraphBooleanToFloat",a)}}(0,d.RegisterClass)("FlowGraphBooleanToFloat",f);class g extends b.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeBoolean,c.RichTypeFlowGraphInteger,a=>e.FlowGraphInteger.FromValue(+a),"FlowGraphBooleanToInt",a)}}(0,d.RegisterClass)("FlowGraphBooleanToInt",g);class h extends b.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeNumber,c.RichTypeBoolean,a=>!!a,"FlowGraphFloatToBoolean",a)}}(0,d.RegisterClass)("FlowGraphFloatToBoolean",h);class i extends b.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeFlowGraphInteger,c.RichTypeBoolean,a=>!!a.value,"FlowGraphIntToBoolean",a)}}(0,d.RegisterClass)("FlowGraphIntToBoolean",i);class j extends b.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeFlowGraphInteger,c.RichTypeNumber,a=>a.value,"FlowGraphIntToFloat",a)}}(0,d.RegisterClass)("FlowGraphIntToFloat",j);class k extends b.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeNumber,c.RichTypeFlowGraphInteger,b=>{switch(a?.roundingMode){case"floor":return e.FlowGraphInteger.FromValue(Math.floor(b));case"ceil":return e.FlowGraphInteger.FromValue(Math.ceil(b));case"round":return e.FlowGraphInteger.FromValue(Math.round(b));default:return e.FlowGraphInteger.FromValue(b)}},"FlowGraphFloatToInt",a)}}(0,d.RegisterClass)("FlowGraphFloatToInt",k),a.s(["FlowGraphBooleanToFloat",()=>f,"FlowGraphBooleanToInt",()=>g,"FlowGraphFloatToBoolean",()=>h,"FlowGraphFloatToInt",()=>k,"FlowGraphIntToBoolean",()=>i,"FlowGraphIntToFloat",()=>j])},541309,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(920149),e=a.i(994060);class f extends b.FlowGraphBlock{constructor(a={}){super(a),this.keyFrames=[];const b="string"==typeof a?.animationType?(0,c.getRichTypeByFlowGraphType)(a.animationType):(0,c.getRichTypeByAnimationType)(a?.animationType??0),d=a?.keyFramesCount??1,e=this.registerDataInput("duration_0",c.RichTypeNumber,0),f=this.registerDataInput("value_0",b);this.keyFrames.push({duration:e,value:f});for(let e=1;e<d+1;e++){const f=this.registerDataInput(`duration_${e}`,c.RichTypeNumber,e===d?a.duration:void 0),g=this.registerDataInput(`value_${e}`,b);this.keyFrames.push({duration:f,value:g})}this.initialValue=this.keyFrames[0].value,this.endValue=this.keyFrames[d].value,this.easingFunction=this.registerDataInput("easingFunction",c.RichTypeAny),this.animation=this.registerDataOutput("animation",c.RichTypeAny),this.propertyName=this.registerDataInput("propertyName",c.RichTypeAny,a?.propertyName),this.customBuildAnimation=this.registerDataInput("customBuildAnimation",c.RichTypeAny)}_updateOutputs(a){let b=a._getGlobalContextVariable("interpolationAnimations",[]),c=this.propertyName.getValue(a),d=this.easingFunction.getValue(a),e=this._createAnimation(a,c,d);if(this.animation.setValue(e,a),Array.isArray(e))for(let a of e)b.push(a.uniqueId);else b.push(e.uniqueId);a._setGlobalContextVariable("interpolationAnimations",b)}_createAnimation(a,b,c){let e=this.initialValue.richType,f=[],g=this.initialValue.getValue(a)||e.defaultValue;f.push({frame:0,value:g});let h=this.config?.numberOfKeyFrames??1;for(let b=1;b<h+1;b++){let c=this.keyFrames[b].duration?.getValue(a),d=this.keyFrames[b].value?.getValue(a);b===h-1&&(d=d||e.defaultValue),void 0!==c&&d&&f.push({frame:60*c,value:d})}let i=this.customBuildAnimation.getValue(a);if(i)return i(null,null,a)(f,60,e.animationType,c);if("string"!=typeof b)return b.map(a=>{let b=d.Animation.CreateAnimation(a,e.animationType,60,c);return b.setKeys(f),b});{let a=d.Animation.CreateAnimation(b,e.animationType,60,c);return a.setKeys(f),[a]}}getClassName(){return"FlowGraphInterpolationBlock"}}(0,e.RegisterClass)("FlowGraphInterpolationBlock",f),a.s(["FlowGraphInterpolationBlock",()=>f])},366291,a=>{"use strict";var b=a.i(625562);let c="shadowMapFragment",d=`var depthSM: f32=fragmentInputs.vDepthMetricSM;
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
#if SM_USEDISTANCE==1
depthSM=(length(fragmentInputs.vPositionWSM-uniforms.lightDataSM)+uniforms.depthValuesSM.x)/uniforms.depthValuesSM.y+uniforms.biasAndScaleSM.x;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
depthSM=(-fragmentInputs.zSM+uniforms.depthValuesSM.x)/uniforms.depthValuesSM.y+uniforms.biasAndScaleSM.x;
#else
depthSM=(fragmentInputs.zSM+uniforms.depthValuesSM.x)/uniforms.depthValuesSM.y+uniforms.biasAndScaleSM.x;
#endif
#endif
depthSM=clamp(depthSM,0.0,1.0);
#ifdef USE_REVERSE_DEPTHBUFFER
fragmentOutputs.fragDepth=clamp(1.0-depthSM,0.0,1.0);
#else
fragmentOutputs.fragDepth=clamp(depthSM,0.0,1.0); 
#endif
#elif SM_USEDISTANCE==1
depthSM=(length(fragmentInputs.vPositionWSM-uniforms.lightDataSM)+uniforms.depthValuesSM.x)/uniforms.depthValuesSM.y+uniforms.biasAndScaleSM.x;
#endif
#if SM_ESM==1
depthSM=clamp(exp(-min(87.,uniforms.biasAndScaleSM.z*depthSM)),0.,1.);
#endif
#if SM_FLOAT==1
fragmentOutputs.color= vec4f(depthSM,1.0,1.0,1.0);
#else
fragmentOutputs.color=pack(depthSM);
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["shadowMapFragmentWGSL",0,{name:c,shader:d}])},533842,a=>{"use strict";var b=a.i(625562);a.i(492619);let c="bayerDitherFunctions",d=`fn bayerDither2(_P: vec2f)->f32 {return ((2.0*_P.y+_P.x+1.0)%(4.0));}
fn bayerDither4(_P: vec2f)->f32 {var P1: vec2f=((_P)%(2.0)); 
var P2: vec2f=floor(0.5*((_P)%(4.0))); 
return 4.0*bayerDither2(P1)+bayerDither2(P2);}
fn bayerDither8(_P: vec2f)->f32 {var P1: vec2f=((_P)%(2.0)); 
var P2: vec2f=floor(0.5 *((_P)%(4.0))); 
var P4: vec2f=floor(0.25*((_P)%(8.0))); 
return 4.0*(4.0*bayerDither2(P1)+bayerDither2(P2))+bayerDither2(P4);}
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d);let e="shadowMapFragmentExtraDeclaration",f=`#if SM_FLOAT==0
#include<packingFunctions>
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#include<bayerDitherFunctions>
uniform softTransparentShadowSM: vec2f;
#endif
varying vDepthMetricSM: f32;
#if SM_USEDISTANCE==1
uniform lightDataSM: vec3f;varying vPositionWSM: vec3f;
#endif
uniform biasAndScaleSM: vec3f;uniform depthValuesSM: vec2f;
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying zSM: f32;
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[e]||(b.ShaderStore.IncludesShadersStoreWGSL[e]=f),a.i(435),a.i(197011),a.i(366291);let g="shadowMapPixelShader",h=`#include<shadowMapFragmentExtraDeclaration>
#ifdef ALPHATEXTURE
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
#ifdef ALPHATEXTURE
var opacityMap: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV);var alphaFromAlphaTexture: f32=opacityMap.a;
#if SM_SOFTTRANSPARENTSHADOW==1
if (uniforms.softTransparentShadowSM.y==1.0) {opacityMap=vec4f(opacityMap.rgb* vec3f(0.3,0.59,0.11),opacityMap.a);alphaFromAlphaTexture=opacityMap.x+opacityMap.y+opacityMap.z;}
#endif
#ifdef ALPHATESTVALUE
if (alphaFromAlphaTexture<ALPHATESTVALUE) {discard;}
#endif
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#ifdef ALPHATEXTURE
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alphaFromAlphaTexture) {discard;}
#else
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x) {discard;} 
#endif
#endif
#include<shadowMapFragment>
}`;b.ShaderStore.ShadersStoreWGSL[g]||(b.ShaderStore.ShadersStoreWGSL[g]=h),a.s(["shadowMapPixelShaderWGSL",0,{name:g,shader:h}],533842)},566182,a=>{"use strict";var b=a.i(625562);a.i(284660);let c="backgroundUboDeclaration",d=`uniform vPrimaryColor: vec4f;uniform vPrimaryColorShadow: vec4f;uniform vDiffuseInfos : vec2f;uniform diffuseMatrix : mat4x4f;uniform fFovMultiplier: f32;uniform pointSize: f32;uniform shadowLevel: f32;uniform alpha: f32;uniform vBackgroundCenter: vec3f;uniform vReflectionControl: vec4f;uniform projectedGroundInfos: vec2f;uniform vReflectionInfos : vec2f;uniform reflectionMatrix : mat4x4f;uniform vReflectionMicrosurfaceInfos : vec3f;
#include<sceneUboDeclaration>
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},60827,a=>{"use strict";var b=a.i(625562);a.i(566182),a.i(463068),a.i(662384),a.i(616212),a.i(488049),a.i(315937),a.i(431801),a.i(214918),a.i(160815),a.i(707101),a.i(304277),a.i(83067),a.i(736380),a.i(43607),a.i(668273),a.i(5021);let c="backgroundVertexShader",d=`#include<backgroundUboDeclaration>
#include<helperFunctions>
attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#ifdef MAINUV1
varying vMainUV1: vec2f;
#endif
#ifdef MAINUV2
varying vMainUV2: vec2f;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
varying vDiffuseUV: vec2f;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<lightVxUboDeclaration>[0..maxSimultaneousLights]
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef REFLECTIONMAP_SKYBOX
vertexOutputs.vPositionUVW=input.position;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*finalWorld* vec4f(input.position,1.0);} else {vertexOutputs.position=scene.viewProjectionR*finalWorld* vec4f(input.position,1.0);}
#else
vertexOutputs.position=scene.viewProjection*finalWorld* vec4f(input.position,1.0);
#endif
var worldPos: vec4f=finalWorld* vec4f(input.position,1.0);vertexOutputs.vPositionW= worldPos.xyz;
#ifdef NORMAL
var normalWorld: mat3x3f=mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vertexOutputs.vNormalW=normalize(normalWorld*input.normal);
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vertexOutputs.vDirectionW=normalize((finalWorld*vec4f(input.position,0.0)).xyz);
#ifdef EQUIRECTANGULAR_RELFECTION_FOV
var screenToWorld: mat3x3f=inverseMat3( mat3x3f(finalWorld*scene.viewProjection));var segment: vec3f=mix(vertexOutputs.vDirectionW,screenToWorld* vec3f(0.0,0.0,1.0),abs(fFovMultiplier-1.0));if (fFovMultiplier<=1.0) {vertexOutputs.vDirectionW=normalize(segment);} else {vertexOutputs.vDirectionW=normalize(vertexOutputs.vDirectionW+(vertexOutputs.vDirectionW-segment));}
#endif
#endif
#ifndef UV1
var uv: vec2f=vec2f(0.,0.);
#else
var uv=input.uv;
#endif
#ifndef UV2
var uv2: vec2f=vec2f(0.,0.);
#else
var uv2=input.uv2;
#endif
#ifdef MAINUV1
vertexOutputs.vMainUV1=uv;
#endif
#ifdef MAINUV2
vertexOutputs.vMainUV2=uv2;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
if (uniforms.vDiffuseInfos.x==0.)
{vertexOutputs.vDiffuseUV= (uniforms.diffuseMatrix* vec4f(uv,1.0,0.0)).xy;}
else
{vertexOutputs.vDiffuseUV= (uniforms.diffuseMatrix* vec4f(uv2,1.0,0.0)).xy;}
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#ifdef VERTEXCOLOR
vertexOutputs.vColor=vertexInputs.color;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["backgroundVertexShaderWGSL",0,{name:c,shader:d}])},499168,a=>{"use strict";var b=a.i(625562);a.i(658057);let c="backgroundUboDeclaration",d=`layout(std140,column_major) uniform;uniform Material
{uniform vec4 vPrimaryColor;uniform vec4 vPrimaryColorShadow;uniform vec2 vDiffuseInfos;uniform mat4 diffuseMatrix;uniform float fFovMultiplier;uniform float pointSize;uniform float shadowLevel;uniform float alpha;uniform vec3 vBackgroundCenter;uniform vec4 vReflectionControl;uniform vec2 projectedGroundInfos;uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;};
#include<sceneUboDeclaration>
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([])},454330,a=>{"use strict";var b=a.i(625562);let c="backgroundVertexDeclaration",d=`uniform mat4 view;uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
uniform float shadowLevel;
#ifdef DIFFUSE
uniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;uniform float fFovMultiplier;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(499168),a.i(964653),a.i(399154),a.i(320125),a.i(306169),a.i(896790),a.i(506404),a.i(419684),a.i(693676),a.i(544248),a.i(37668),a.i(252115),a.i(175163),a.i(403470),a.i(164403),a.i(714719),a.i(705551);let e="backgroundVertexShader",f=`precision highp float;
#include<__decl__backgroundVertex>
#include<helperFunctions>
attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef MAINUV1
varying vec2 vMainUV1;
#endif
#ifdef MAINUV2
varying vec2 vMainUV2;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
varying vec2 vDiffuseUV;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef REFLECTIONMAP_SKYBOX
vPositionUVW=position;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*finalWorld*vec4(position,1.0);} else {gl_Position=viewProjectionR*finalWorld*vec4(position,1.0);}
#else
gl_Position=viewProjection*finalWorld*vec4(position,1.0);
#endif
vec4 worldPos=finalWorld*vec4(position,1.0);vPositionW=vec3(worldPos);
#ifdef NORMAL
mat3 normalWorld=mat3(finalWorld);
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vNormalW=normalize(normalWorld*normal);
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vDirectionW=normalize(vec3(finalWorld*vec4(position,0.0)));
#ifdef EQUIRECTANGULAR_RELFECTION_FOV
mat3 screenToWorld=inverseMat3(mat3(finalWorld*viewProjection));vec3 segment=mix(vDirectionW,screenToWorld*vec3(0.0,0.0,1.0),abs(fFovMultiplier-1.0));if (fFovMultiplier<=1.0) {vDirectionW=normalize(segment);} else {vDirectionW=normalize(vDirectionW+(vDirectionW-segment));}
#endif
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef MAINUV1
vMainUV1=uv;
#endif
#ifdef MAINUV2
vMainUV2=uv2;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
if (vDiffuseInfos.x==0.)
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));}
else
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));}
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#ifdef VERTEXCOLOR
vColor=colorUpdated;
#endif
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;b.ShaderStore.ShadersStore[e]||(b.ShaderStore.ShadersStore[e]=f),a.s(["backgroundVertexShader",0,{name:e,shader:f}],454330)},659689,a=>{"use strict";var b=a.i(625562);let c="shadowMapVertexMetric",d=`#if SM_USEDISTANCE==1
vertexOutputs.vPositionWSM=worldPos.xyz;
#endif
#if SM_DEPTHTEXTURE==1
#ifdef IS_NDC_HALF_ZRANGE
#define BIASFACTOR 0.5
#else
#define BIASFACTOR 1.0
#endif
#ifdef USE_REVERSE_DEPTHBUFFER
vertexOutputs.position.z-=uniforms.biasAndScaleSM.x*vertexOutputs.position.w*BIASFACTOR;
#else
vertexOutputs.position.z+=uniforms.biasAndScaleSM.x*vertexOutputs.position.w*BIASFACTOR;
#endif
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
vertexOutputs.zSM=vertexOutputs.position.z;vertexOutputs.position.z=0.0;
#elif SM_USEDISTANCE==0
#ifdef USE_REVERSE_DEPTHBUFFER
vertexOutputs.vDepthMetricSM=(-vertexOutputs.position.z+uniforms.depthValuesSM.x)/uniforms.depthValuesSM.y+uniforms.biasAndScaleSM.x;
#else
vertexOutputs.vDepthMetricSM=(vertexOutputs.position.z+uniforms.depthValuesSM.x)/uniforms.depthValuesSM.y+uniforms.biasAndScaleSM.x;
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s(["shadowMapVertexMetricWGSL",0,{name:c,shader:d}])},463469,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(475114),a.i(549432),a.i(463068),a.i(284660),a.i(142967);let c="shadowMapVertexExtraDeclaration",d=`#if SM_NORMALBIAS==1
uniform lightDataSM: vec3f;
#endif
uniform biasAndScaleSM: vec3f;uniform depthValuesSM: vec2f;varying vDepthMetricSM: f32;
#if SM_USEDISTANCE==1
varying vPositionWSM: vec3f;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying zSM: f32;
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.i(315937),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067);let e="shadowMapVertexNormalBias",f=`#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
var worldLightDirSM: vec3f=normalize(-uniforms.lightDataSM.xyz);
#else
var directionToLightSM: vec3f=uniforms.lightDataSM.xyz-worldPos.xyz;var worldLightDirSM: vec3f=normalize(directionToLightSM);
#endif
var ndlSM: f32=dot(vNormalW,worldLightDirSM);var sinNLSM: f32=sqrt(1.0-ndlSM*ndlSM);var normalBiasSM: f32=uniforms.biasAndScaleSM.y*sinNLSM;worldPos=vec4f(worldPos.xyz-vNormalW*normalBiasSM,worldPos.w);
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[e]||(b.ShaderStore.IncludesShadersStoreWGSL[e]=f),a.i(659689),a.i(736380);let g="shadowMapVertexShader",h=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute world0: vec4f;attribute world1: vec4f;attribute world2: vec4f;attribute world3: vec4f;
#endif
#include<helperFunctions>
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
#ifdef ALPHATEXTURE
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=input.position;
#ifdef UV1
var uvUpdated: vec2f=input.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=input.uv2;
#endif
#ifdef NORMAL
var normalUpdated: vec3f=input.normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);
#ifdef NORMAL
var normWorldSM: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
var vNormalW: vec3f=normalUpdated/ vec3f(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
var vNormalW: vec3f=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
vertexOutputs.position=scene.viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#include<clipPlaneVertex>
}`;b.ShaderStore.ShadersStoreWGSL[g]||(b.ShaderStore.ShadersStoreWGSL[g]=h),a.s(["shadowMapVertexShaderWGSL",0,{name:g,shader:h}],463469)},230448,a=>{"use strict";var b=a.i(625562);a.i(435),a.i(580887),a.i(782111),a.i(463068),a.i(197011),a.i(89689);let c="geometryPixelShader",d=`#ifdef BUMP
varying vWorldView0: vec4f;varying vWorldView1: vec4f;varying vWorldView2: vec4f;varying vWorldView3: vec4f;varying vNormalW: vec3f;
#else
varying vNormalV: vec3f;
#endif
varying vViewPos: vec4f;
#if defined(POSITION) || defined(BUMP)
varying vPositionW: vec3f;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#ifdef NEED_UV
varying vUV: vec2f;
#endif
#ifdef BUMP
uniform vBumpInfos: vec3f;uniform vTangentSpaceParams: vec2f;
#endif
#if defined(REFLECTIVITY)
#if defined(ORMTEXTURE) || defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
var reflectivitySamplerSampler: sampler;var reflectivitySampler: texture_2d<f32>;varying vReflectivityUV: vec2f;
#else
#ifdef METALLIC_TEXTURE
var metallicSamplerSampler: sampler;var metallicSampler: texture_2d<f32>;varying vMetallicUV: vec2f;
#endif
#ifdef ROUGHNESS_TEXTURE
var roughnessSamplerSampler: sampler;var roughnessSampler: texture_2d<f32>;varying vRoughnessUV: vec2f;
#endif
#endif
#ifdef ALBEDOTEXTURE
varying vAlbedoUV: vec2f;var albedoSamplerSampler: sampler;var albedoSampler: texture_2d<f32>;
#endif
#ifdef REFLECTIVITYCOLOR
uniform reflectivityColor: vec3f;
#endif
#ifdef ALBEDOCOLOR
uniform albedoColor: vec3f;
#endif
#ifdef METALLIC
uniform metallic: f32;
#endif
#if defined(ROUGHNESS) || defined(GLOSSINESS)
uniform glossiness: f32;
#endif
#endif
#if defined(ALPHATEST) && defined(NEED_UV)
var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<helperFunctions>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV).a<0.4) {discard;}
#endif
var normalOutput: vec3f;
#ifdef BUMP
var normalW: vec3f=normalize(input.vNormalW);
#include<bumpFragment>
#ifdef NORMAL_WORLDSPACE
normalOutput=normalW;
#else
normalOutput=normalize( (mat4x4f(input.vWorldView0,input.vWorldView1,input.vWorldView2,input.vWorldView3)* vec4f(normalW,0.0)).xyz);
#endif
#elif defined(HAS_NORMAL_ATTRIBUTE)
normalOutput=normalize(input.vNormalV);
#elif defined(POSITION)
normalOutput=normalize(-cross(dpdx(input.vPositionW),dpdy(input.vPositionW)));
#endif
#ifdef ENCODE_NORMAL
normalOutput=normalOutput*0.5+0.5;
#endif
var fragData: array<vec4<f32>,SCENE_MRT_COUNT>;
#ifdef DEPTH
fragData[DEPTH_INDEX]=vec4f(input.vViewPos.z/input.vViewPos.w,0.0,0.0,1.0);
#endif
#ifdef NORMAL
fragData[NORMAL_INDEX]=vec4f(normalOutput,1.0);
#endif
#ifdef SCREENSPACE_DEPTH
fragData[SCREENSPACE_DEPTH_INDEX]=vec4f(fragmentInputs.position.z,0.0,0.0,1.0);
#endif
#ifdef POSITION
fragData[POSITION_INDEX]= vec4f(input.vPositionW,1.0);
#endif
#ifdef VELOCITY
var a: vec2f=(input.vCurrentPosition.xy/input.vCurrentPosition.w)*0.5+0.5;var b: vec2f=(input.vPreviousPosition.xy/input.vPreviousPosition.w)*0.5+0.5;var velocity: vec2f=abs(a-b);velocity= vec2f(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;fragData[VELOCITY_INDEX]= vec4f(velocity,0.0,1.0);
#endif
#ifdef VELOCITY_LINEAR
var velocity : vec2f=vec2f(0.5)*((input.vPreviousPosition.xy /
input.vPreviousPosition.w) -
(input.vCurrentPosition.xy /
input.vCurrentPosition.w));fragData[VELOCITY_LINEAR_INDEX]=vec4f(velocity,0.0,1.0);
#endif
#ifdef REFLECTIVITY
var reflectivity: vec4f= vec4f(0.0,0.0,0.0,1.0);
#ifdef METALLICWORKFLOW
var metal: f32=1.0;var roughness: f32=1.0;
#ifdef ORMTEXTURE
metal*=textureSample(reflectivitySampler,reflectivitySamplerSampler,input.vReflectivityUV).b;roughness*=textureSample(reflectivitySampler,reflectivitySamplerSampler,input.vReflectivityUV).g;
#else
#ifdef METALLIC_TEXTURE
metal*=textureSample(metallicSampler,metallicSamplerSampler,input.vMetallicUV).r;
#endif
#ifdef ROUGHNESS_TEXTURE
roughness*=textureSample(roughnessSampler,roughnessSamplerSampler,input.vRoughnessUV).r;
#endif
#endif
#ifdef METALLIC
metal*=uniforms.metallic;
#endif
#ifdef ROUGHNESS
roughness*=(1.0-uniforms.glossiness); 
#endif
reflectivity=vec4f(reflectivity.rgb,reflectivity.a-roughness);var color: vec3f= vec3f(1.0);
#ifdef ALBEDOTEXTURE
color=textureSample(albedoSampler,albedoSamplerSampler,input.vAlbedoUV).rgb;
#ifdef GAMMAALBEDO
color=toLinearSpaceVec4(color);
#endif
#endif
#ifdef ALBEDOCOLOR
color*=uniforms.albedoColor.xyz;
#endif
reflectivity=vec4f(mix( vec3f(0.04),color,metal),reflectivity.a);
#else
#if defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
reflectivity=textureSample(reflectivitySampler,reflectivitySamplerSampler,input.vReflectivityUV);
#ifdef GAMMAREFLECTIVITYTEXTURE
reflectivity=vec4f(toLinearSpaceVec3(reflectivity.rgb),reflectivity.a);
#endif
#else 
#ifdef REFLECTIVITYCOLOR
reflectivity=vec4f(toLinearSpaceVec3(uniforms.reflectivityColor.xyz),1.0);
#endif
#endif
#ifdef GLOSSINESSS
reflectivity=vec4f(reflectivity.rgb,reflectivity.a*glossiness); 
#endif
#endif
fragData[REFLECTIVITY_INDEX]=reflectivity;
#endif
#if SCENE_MRT_COUNT>0
fragmentOutputs.fragData0=fragData[0];
#endif
#if SCENE_MRT_COUNT>1
fragmentOutputs.fragData1=fragData[1];
#endif
#if SCENE_MRT_COUNT>2
fragmentOutputs.fragData2=fragData[2];
#endif
#if SCENE_MRT_COUNT>3
fragmentOutputs.fragData3=fragData[3];
#endif
#if SCENE_MRT_COUNT>4
fragmentOutputs.fragData4=fragData[4];
#endif
#if SCENE_MRT_COUNT>5
fragmentOutputs.fragData5=fragData[5];
#endif
#if SCENE_MRT_COUNT>6
fragmentOutputs.fragData6=fragData[6];
#endif
#if SCENE_MRT_COUNT>7
fragmentOutputs.fragData7=fragData[7];
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["geometryPixelShaderWGSL",0,{name:c,shader:d}])},91965,356549,a=>{"use strict";var b=a.i(419809),c=a.i(779438);let d=new RegExp(/\/\{(\w+)\}(?=\/|$)/g);class e{constructor(a,e){this.path=a,this.ownerBlock=e,this.templatedInputs=[];let f=d.exec(a);const g=new Set;for(;f;){const[,h]=f;if(g.has(h))throw Error("Duplicate template variable detected.");g.add(h),this.templatedInputs.push(e.registerDataInput(h,c.RichTypeFlowGraphInteger,new b.FlowGraphInteger(0))),f=d.exec(a)}}getAccessor(a,b){let c=this.path;for(let a of this.templatedInputs){let d=a.getValue(b).value;if("number"!=typeof d||d<0)throw Error("Invalid value for templated input.");c=c.replace(`{${a.name}}`,d.toString())}return a.convert(c)}}a.s(["FlowGraphPathConverterComponent",()=>e],356549);var f=a.i(994060),g=a.i(719984),h=a.i(37678),i=a.i(304396);class j extends i.FlowGraphCachedOperationBlock{constructor(a){super(c.RichTypeAny,a),this.config=a,this.object=this.registerDataOutput("object",c.RichTypeAny),this.propertyName=this.registerDataOutput("propertyName",c.RichTypeAny),this.setterFunction=this.registerDataOutput("setFunction",c.RichTypeAny,this._setPropertyValue.bind(this)),this.getterFunction=this.registerDataOutput("getFunction",c.RichTypeAny,this._getPropertyValue.bind(this)),this.generateAnimationsFunction=this.registerDataOutput("generateAnimationsFunction",c.RichTypeAny,this._getInterpolationAnimationPropertyInfo.bind(this)),this.templateComponent=new e(a.jsonPointer,this)}_doOperation(a){let b=this.templateComponent.getAccessor(this.config.pathConverter,a),c=b.info.get(b.object),d=b.info.getTarget?.(b.object),e=b.info.getPropertyName?.[0](b.object);if(d)this.object.setValue(d,a),e&&this.propertyName.setValue(e,a);else throw Error("Object is undefined");return c}_setPropertyValue(a,b,c,d){let e=this.templateComponent.getAccessor(this.config.pathConverter,d),f=e.info.type;f.startsWith("Color")&&(c=k(c,f)),e.info.set?.(c,e.object)}_getPropertyValue(a,b,c){let d=this.templateComponent.getAccessor(this.config.pathConverter,c),e=d.info.type,f=d.info.get(d.object);return e.startsWith("Color")?function(a){if(a instanceof h.Color3)return new g.Vector3(a.r,a.g,a.b);if(a instanceof h.Color4)return new g.Vector4(a.r,a.g,a.b,a.a);throw Error("Invalid color type")}(f):f}_getInterpolationAnimationPropertyInfo(a,b,c){let d=this.templateComponent.getAccessor(this.config.pathConverter,c);return(a,b,c,e)=>{let f=[],g=d.info.type;return g.startsWith("Color")&&(a=a.map(a=>({frame:a.frame,value:k(a.value,g)}))),d.info.interpolation?.forEach((b,g)=>{let h=d.info.getPropertyName?.[g](d.object)||"Animation-interpolation-"+g,i=a;for(let g of(c!==b.type&&(i=a.map(a=>({frame:a.frame,value:b.getValue(void 0,a.value.asArray?a.value.asArray():[a.value],0,1)}))),b.buildAnimations(d.object,h,60,i)))e&&g.babylonAnimation.setEasingFunction(e),f.push(g.babylonAnimation)}),f}}getClassName(){return"FlowGraphJsonPointerParserBlock"}}function k(a,b){return a.getClassName().startsWith("Color")?a:"Color3"===b?new h.Color3(a.x,a.y,a.z):"Color4"===b?new h.Color4(a.x,a.y,a.z,a.w):a}(0,f.RegisterClass)("FlowGraphJsonPointerParserBlock",j),a.s(["FlowGraphJsonPointerParserBlock",()=>j],91965)},595458,a=>{"use strict";var b=a.i(625562);let c="fluidRenderingRenderPixelShader",d=`#define DISABLE_UNIFORMITY_ANALYSIS
#define IOR 1.333
#define ETA 1.0/IOR
#define F0 0.02
var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;
#ifdef FLUIDRENDERING_DIFFUSETEXTURE
var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#else
uniform diffuseColor: vec3f;
#endif
#ifdef FLUIDRENDERING_FIXED_THICKNESS
uniform thickness: f32;var bgDepthSamplerSampler: sampler;var bgDepthSampler: texture_2d<f32>;
#else
uniform minimumThickness: f32;var thicknessSamplerSampler: sampler;var thicknessSampler: texture_2d<f32>;
#endif
#ifdef FLUIDRENDERING_ENVIRONMENT
var reflectionSamplerSampler: sampler;var reflectionSampler: texture_cube<f32>;
#endif
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_TEXTURE)
var debugSamplerSampler: sampler;var debugSampler: texture_2d<f32>;
#endif
uniform viewMatrix: mat4x4f;uniform projectionMatrix: mat4x4f;uniform invProjectionMatrix: mat4x4f;uniform texelSize: vec2f;uniform dirLight: vec3f;uniform cameraFar: f32;uniform density: f32;uniform refractionStrength: f32;uniform fresnelClamp: f32;uniform specularPower: f32;varying vUV: vec2f;fn computeViewPosFromUVDepth(texCoord: vec2f,depth: f32)->vec3f {var ndc: vec4f=vec4f(texCoord*2.0-1.0,0.0,1.0);
#ifdef FLUIDRENDERING_RHS
ndc.z=-uniforms.projectionMatrix[2].z+uniforms.projectionMatrix[3].z/depth;
#else
ndc.z=uniforms.projectionMatrix[2].z+uniforms.projectionMatrix[3].z/depth;
#endif
ndc.w=1.0;var eyePos: vec4f=uniforms.invProjectionMatrix*ndc;return eyePos.xyz/eyePos.w;}
fn getViewPosFromTexCoord(texCoord: vec2f)->vec3f {var depth: f32=textureSampleLevel(depthSampler,depthSamplerSampler,texCoord,0.).x;return computeViewPosFromUVDepth(texCoord,depth);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var texCoord: vec2f=input.vUV;
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_TEXTURE)
var color: vec4f=textureSample(debugSampler,debugSamplerSampler,texCoord);
#ifdef FLUIDRENDERING_DEBUG_DEPTH
fragmentOutputs.color=vec4f(color.rgb/vec3f(2.0),1.);if (color.r>0.999 && color.g>0.999) {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,texCoord);}
#else
fragmentOutputs.color=vec4f(color.rgb,1.);if (color.r<0.001 && color.g<0.001 && color.b<0.001) {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,texCoord);}
#endif
return fragmentOutputs;
#endif
var depthVel: vec2f=textureSampleLevel(depthSampler,depthSamplerSampler,texCoord,0.).rg;var depth: f32=depthVel.r;
#ifndef FLUIDRENDERING_FIXED_THICKNESS
var thickness: f32=textureSample(thicknessSampler,thicknessSamplerSampler,texCoord).x;
#else
var thickness: f32=uniforms.thickness;var bgDepth: f32=textureSample(bgDepthSampler,bgDepthSamplerSampler,texCoord).x;var depthNonLinear: f32=uniforms.projectionMatrix[2].z+uniforms.projectionMatrix[3].z/depth;depthNonLinear=depthNonLinear*0.5+0.5;
#endif
var backColor: vec4f=textureSample(textureSampler,textureSamplerSampler,texCoord);
#ifndef FLUIDRENDERING_FIXED_THICKNESS
if (depth>=uniforms.cameraFar || depth<=0. || thickness<=uniforms.minimumThickness) {
#else
if (depth>=uniforms.cameraFar || depth<=0. || bgDepth<=depthNonLinear) {
#endif
#ifdef FLUIDRENDERING_COMPOSITE_MODE
fragmentOutputs.color=vec4f(backColor.rgb*backColor.a,backColor.a);
#else
fragmentOutputs.color=backColor;
#endif
return fragmentOutputs;}
var viewPos: vec3f=computeViewPosFromUVDepth(texCoord,depth);var ddx: vec3f=getViewPosFromTexCoord(texCoord+vec2f(uniforms.texelSize.x,0.))-viewPos;var ddy: vec3f=getViewPosFromTexCoord(texCoord+vec2f(0.,uniforms.texelSize.y))-viewPos;var ddx2: vec3f=viewPos-getViewPosFromTexCoord(texCoord+vec2f(-uniforms.texelSize.x,0.));if (abs(ddx.z)>abs(ddx2.z)) {ddx=ddx2;}
var ddy2: vec3f=viewPos-getViewPosFromTexCoord(texCoord+vec2f(0.,-uniforms.texelSize.y));if (abs(ddy.z)>abs(ddy2.z)) {ddy=ddy2;}
var normal: vec3f=normalize(cross(ddy,ddx));
#ifdef FLUIDRENDERING_RHS
normal=-normal;
#endif
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_SHOWNORMAL)
fragmentOutputs.color=vec4f(normal*0.5+0.5,1.0);return fragmentOutputs;
#endif
var rayDir: vec3f=normalize(viewPos); 
#ifdef FLUIDRENDERING_DIFFUSETEXTURE
var diffuseColor: vec3f=textureSampleLevel(diffuseSampler,diffuseSamplerSampler,texCoord,0.0).rgb;
#else
var diffuseColor: vec3f=uniforms.diffuseColor;
#endif
var lightDir: vec3f=normalize((uniforms.viewMatrix*vec4f(-uniforms.dirLight,0.)).xyz);var H: vec3f =normalize(lightDir-rayDir);var specular: f32 =pow(max(0.0,dot(H,normal)),uniforms.specularPower);
#ifdef FLUIDRENDERING_DEBUG_DIFFUSERENDERING
var diffuse: f32 =max(0.0,dot(lightDir,normal))*1.0;fragmentOutputs.color=vec4f(vec3f(0.1) /*ambient*/+vec3f(0.42,0.50,1.00)*diffuse+vec3f(0,0,0.2)+specular,1.);return fragmentOutputs;
#endif
var refractionDir: vec3f=refract(rayDir,normal,ETA);var transmitted: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,vec2f(texCoord+refractionDir.xy*thickness*uniforms.refractionStrength),0.0);
#ifdef FLUIDRENDERING_COMPOSITE_MODE
if (transmitted.a==0.) {transmitted.a=thickness;}
#endif
var transmittance: vec3f=exp(-uniforms.density*thickness*(1.0-diffuseColor)); 
var refractionColor: vec3f=transmitted.rgb*transmittance;
#ifdef FLUIDRENDERING_ENVIRONMENT
var reflectionDir: vec3f=reflect(rayDir,normal);var reflectionColor: vec3f=(textureSample(reflectionSampler,reflectionSamplerSampler,reflectionDir).rgb);var fresnel: f32=clamp(F0+(1.0-F0)*pow(1.0-dot(normal,-rayDir),5.0),0.,uniforms.fresnelClamp);var finalColor: vec3f=mix(refractionColor,reflectionColor,fresnel)+specular;
#else
var finalColor: vec3f=refractionColor+specular;
#endif
#ifdef FLUIDRENDERING_VELOCITY
var velocity: f32=depthVel.g;finalColor=mix(finalColor,vec3f(1.0),smoothstep(0.3,1.0,velocity/6.0));
#endif
fragmentOutputs.color=vec4f(finalColor,transmitted.a);}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fluidRenderingRenderPixelShaderWGSL",0,{name:c,shader:d}])},382994,a=>{"use strict";var b=a.i(625562);a.i(662384),a.i(616212),a.i(475114),a.i(549432),a.i(488049),a.i(284660),a.i(315937),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067),a.i(736380),a.i(524322);let c="geometryVertexShader",d=`#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
#include<sceneUboDeclaration>
#include<clipPlaneVertexDeclaration>
attribute position: vec3f;
#ifdef HAS_NORMAL_ATTRIBUTE
attribute normal: vec3f;
#endif
#ifdef NEED_UV
varying vUV: vec2f;
#ifdef ALPHATEST
uniform diffuseMatrix: mat4x4f;
#endif
#ifdef BUMP
uniform bumpMatrix: mat4x4f;varying vBumpUV: vec2f;
#endif
#ifdef REFLECTIVITY
uniform reflectivityMatrix: mat4x4f;uniform albedoMatrix: mat4x4f;varying vReflectivityUV: vec2f;varying vAlbedoUV: vec2f;
#endif
#ifdef METALLIC_TEXTURE
varying vMetallicUV: vec2f;uniform metallicMatrix: mat4x4f;
#endif
#ifdef ROUGHNESS_TEXTURE
varying vRoughnessUV: vec2f;uniform roughnessMatrix: mat4x4f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#ifdef BUMP
varying vWorldView0: vec4f;varying vWorldView1: vec4f;varying vWorldView2: vec4f;varying vWorldView3: vec4f;
#endif
#ifdef BUMP
varying vNormalW: vec3f;
#else
varying vNormalV: vec3f;
#endif
varying vViewPos: vec4f;
#if defined(POSITION) || defined(BUMP)
varying vPositionW: vec3f;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
uniform previousViewProjection: mat4x4f;varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=input.position;
#ifdef HAS_NORMAL_ATTRIBUTE
var normalUpdated: vec3f=input.normal;
#else
var normalUpdated: vec3f=vec3f(0.0,0.0,0.0);
#endif
#ifdef UV1
var uvUpdated: vec2f=input.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=input.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=scene.viewProjection*finalWorld*vec4f(positionUpdated,1.0);vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld* vec4f(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f= vec4f(finalWorld* vec4f(positionUpdated,1.0));
#ifdef BUMP
let vWorldView=scene.view*finalWorld;vertexOutputs.vWorldView0=vWorldView[0];vertexOutputs.vWorldView1=vWorldView[1];vertexOutputs.vWorldView2=vWorldView[2];vertexOutputs.vWorldView3=vWorldView[3];let normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);vertexOutputs.vNormalW=normalize(normalWorld*normalUpdated);
#else
#ifdef NORMAL_WORLDSPACE
vertexOutputs.vNormalV=normalize((finalWorld* vec4f(normalUpdated,0.0)).xyz);
#else
vertexOutputs.vNormalV=normalize(((scene.view*finalWorld)* vec4f(normalUpdated,0.0)).xyz);
#endif
#endif
vertexOutputs.vViewPos=scene.view*worldPos;
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && defined(BONES_VELOCITY_ENABLED)
vertexOutputs.vCurrentPosition=scene.viewProjection*finalWorld* vec4f(positionUpdated,1.0);
#if NUM_BONE_INFLUENCERS>0
var previousInfluence: mat4x4f;previousInfluence=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[0])]*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[1])]*vertexInputs.matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[2])]*vertexInputs.matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[3])]*vertexInputs.matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[0])]*vertexInputs.matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[1])]*vertexInputs.matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[2])]*vertexInputs.matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[3])]*vertexInputs.matricesWeightsExtra[3];
#endif
vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld*previousInfluence* vec4f(positionUpdated,1.0);
#else
vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld* vec4f(positionUpdated,1.0);
#endif
#endif
#if defined(POSITION) || defined(BUMP)
vertexOutputs.vPositionW=worldPos.xyz/worldPos.w;
#endif
vertexOutputs.position=scene.viewProjection*finalWorld* vec4f(positionUpdated,1.0);
#include<clipPlaneVertex>
#ifdef NEED_UV
#ifdef UV1
#if defined(ALPHATEST) && defined(ALPHATEST_UV1)
vertexOutputs.vUV=(uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#else
vertexOutputs.vUV=uvUpdated;
#endif
#ifdef BUMP_UV1
vertexOutputs.vBumpUV=(uniforms.bumpMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef REFLECTIVITY_UV1
vertexOutputs.vReflectivityUV=(uniforms.reflectivityMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#else
#ifdef METALLIC_UV1
vertexOutputs.vMetallicUV=(uniforms.metallicMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef ROUGHNESS_UV1
vertexOutputs.vRoughnessUV=(uniforms.roughnessMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#endif
#ifdef ALBEDO_UV1
vertexOutputs.vAlbedoUV=(uniforms.albedoMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#endif
#ifdef UV2
#if defined(ALPHATEST) && defined(ALPHATEST_UV2)
vertexOutputs.vUV=(uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#else
vertexOutputs.vUV=uv2Updated;
#endif
#ifdef BUMP_UV2
vertexOutputs.vBumpUV=(uniforms.bumpMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#ifdef REFLECTIVITY_UV2
vertexOutputs.vReflectivityUV=(uniforms.reflectivityMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#else
#ifdef METALLIC_UV2
vertexOutputs.vMetallicUV=(uniforms.metallicMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#ifdef ROUGHNESS_UV2
vertexOutputs.vRoughnessUV=(uniforms.roughnessMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#ifdef ALBEDO_UV2
vertexOutputs.vAlbedoUV=(uniforms.albedoMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#endif
#include<bumpVertex>
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["geometryVertexShaderWGSL",0,{name:c,shader:d}])},176096,a=>{"use strict";var b=a.i(625562);let c="fxaaPixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform texelSize: vec2f;varying sampleCoordS: vec2f;varying sampleCoordE: vec2f;varying sampleCoordN: vec2f;varying sampleCoordW: vec2f;varying sampleCoordNW: vec2f;varying sampleCoordSE: vec2f;varying sampleCoordNE: vec2f;varying sampleCoordSW: vec2f;const fxaaQualitySubpix: f32=1.0;const fxaaQualityEdgeThreshold: f32=0.166;const fxaaQualityEdgeThresholdMin: f32=0.0833;const kLumaCoefficients: vec3f= vec3f(0.2126,0.7152,0.0722);fn FxaaLuma(rgba: vec4f)->f32 {return dot(rgba.rgb,kLumaCoefficients);} 
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var posM: vec2f;posM.x=input.vUV.x;posM.y=input.vUV.y;var rgbyM: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0);var lumaM: f32=FxaaLuma(rgbyM);var lumaS: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordS,0.0));var lumaE: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordE,0.0));var lumaN: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordN,0.0));var lumaW: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordW,0.0));var maxSM: f32=max(lumaS,lumaM);var minSM: f32=min(lumaS,lumaM);var maxESM: f32=max(lumaE,maxSM);var minESM: f32=min(lumaE,minSM);var maxWN: f32=max(lumaN,lumaW);var minWN: f32=min(lumaN,lumaW);var rangeMax: f32=max(maxWN,maxESM);var rangeMin: f32=min(minWN,minESM);var rangeMaxScaled: f32=rangeMax*fxaaQualityEdgeThreshold;var range: f32=rangeMax-rangeMin;var rangeMaxClamped: f32=max(fxaaQualityEdgeThresholdMin,rangeMaxScaled);
#ifndef MALI
if(range<rangeMaxClamped) 
{fragmentOutputs.color=rgbyM;return fragmentOutputs;}
#endif
var lumaNW: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordNW,0.0));var lumaSE: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordSE,0.0));var lumaNE: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordNE,0.0));var lumaSW: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,input.sampleCoordSW,0.0));var lumaNS: f32=lumaN+lumaS;var lumaWE: f32=lumaW+lumaE;var subpixRcpRange: f32=1.0/range;var subpixNSWE: f32=lumaNS+lumaWE;var edgeHorz1: f32=(-2.0*lumaM)+lumaNS;var edgeVert1: f32=(-2.0*lumaM)+lumaWE;var lumaNESE: f32=lumaNE+lumaSE;var lumaNWNE: f32=lumaNW+lumaNE;var edgeHorz2: f32=(-2.0*lumaE)+lumaNESE;var edgeVert2: f32=(-2.0*lumaN)+lumaNWNE;var lumaNWSW: f32=lumaNW+lumaSW;var lumaSWSE: f32=lumaSW+lumaSE;var edgeHorz4: f32=(abs(edgeHorz1)*2.0)+abs(edgeHorz2);var edgeVert4: f32=(abs(edgeVert1)*2.0)+abs(edgeVert2);var edgeHorz3: f32=(-2.0*lumaW)+lumaNWSW;var edgeVert3: f32=(-2.0*lumaS)+lumaSWSE;var edgeHorz: f32=abs(edgeHorz3)+edgeHorz4;var edgeVert: f32=abs(edgeVert3)+edgeVert4;var subpixNWSWNESE: f32=lumaNWSW+lumaNESE;var lengthSign: f32=uniforms.texelSize.x;var horzSpan: bool=edgeHorz>=edgeVert;var subpixA: f32=subpixNSWE*2.0+subpixNWSWNESE;if (!horzSpan)
{lumaN=lumaW;}
if (!horzSpan) 
{lumaS=lumaE;}
if (horzSpan) 
{lengthSign=uniforms.texelSize.y;}
var subpixB: f32=(subpixA*(1.0/12.0))-lumaM;var gradientN: f32=lumaN-lumaM;var gradientS: f32=lumaS-lumaM;var lumaNN: f32=lumaN+lumaM;var lumaSS: f32=lumaS+lumaM;var pairN: bool=abs(gradientN)>=abs(gradientS);var gradient: f32=max(abs(gradientN),abs(gradientS));if (pairN)
{lengthSign=-lengthSign;}
var subpixC: f32=clamp(abs(subpixB)*subpixRcpRange,0.0,1.0);var posB: vec2f;posB.x=posM.x;posB.y=posM.y;var offNP: vec2f;offNP.x=select(uniforms.texelSize.x,0.0,(!horzSpan));offNP.y=select(uniforms.texelSize.y,0.0,(horzSpan));if (!horzSpan) 
{posB.x+=lengthSign*0.5;}
if (horzSpan)
{posB.y+=lengthSign*0.5;}
var posN: vec2f;posN.x=posB.x-offNP.x*1.5;posN.y=posB.y-offNP.y*1.5;var posP: vec2f;posP.x=posB.x+offNP.x*1.5;posP.y=posB.y+offNP.y*1.5;var subpixD: f32=((-2.0)*subpixC)+3.0;var lumaEndN: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,posN,0.0));var subpixE: f32=subpixC*subpixC;var lumaEndP: f32=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,posP,0.0));if (!pairN) 
{lumaNN=lumaSS;}
var gradientScaled: f32=gradient*1.0/4.0;var lumaMM: f32=lumaM-lumaNN*0.5;var subpixF: f32=subpixD*subpixE;var lumaMLTZero: bool=lumaMM<0.0;lumaEndN-=lumaNN*0.5;lumaEndP-=lumaNN*0.5;var doneN: bool=abs(lumaEndN)>=gradientScaled;var doneP: bool=abs(lumaEndP)>=gradientScaled;if (!doneN) 
{posN.x-=offNP.x*3.0;}
if (!doneN) 
{posN.y-=offNP.y*3.0;}
var doneNP: bool=(!doneN) || (!doneP);if (!doneP) 
{posP.x+=offNP.x*3.0;}
if (!doneP)
{posP.y+=offNP.y*3.0;}
if (doneNP)
{if (!doneN) {lumaEndN=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,posN.xy,0.0));}
if (!doneP) {lumaEndP=FxaaLuma(textureSampleLevel(textureSampler,textureSamplerSampler,posP.xy,0.0));}
if (!doneN) {lumaEndN=lumaEndN-lumaNN*0.5;}
if (!doneP) {lumaEndP=lumaEndP-lumaNN*0.5;}
doneN=abs(lumaEndN)>=gradientScaled;doneP=abs(lumaEndP)>=gradientScaled;if (!doneN) {posN.x-=offNP.x*12.0;}
if (!doneN) {posN.y-=offNP.y*12.0;}
doneNP=(!doneN) || (!doneP);if (!doneP) {posP.x+=offNP.x*12.0;}
if (!doneP) {posP.y+=offNP.y*12.0;}}
var dstN: f32=posM.x-posN.x;var dstP: f32=posP.x-posM.x;if (!horzSpan)
{dstN=posM.y-posN.y;}
if (!horzSpan) 
{dstP=posP.y-posM.y;}
var goodSpanN: bool=(lumaEndN<0.0) != lumaMLTZero;var spanLength: f32=(dstP+dstN);var goodSpanP: bool=(lumaEndP<0.0) != lumaMLTZero;var spanLengthRcp: f32=1.0/spanLength;var directionN: bool=dstN<dstP;var dst: f32=min(dstN,dstP);var goodSpan: bool=select(goodSpanP,goodSpanN,directionN);var subpixG: f32=subpixF*subpixF;var pixelOffset: f32=(dst*(-spanLengthRcp))+0.5;var subpixH: f32=subpixG*fxaaQualitySubpix;var pixelOffsetGood: f32=select(0.0,pixelOffset,goodSpan);var pixelOffsetSubpix: f32=max(pixelOffsetGood,subpixH);if (!horzSpan)
{posM.x+=pixelOffsetSubpix*lengthSign;}
if (horzSpan)
{posM.y+=pixelOffsetSubpix*lengthSign;}
#ifdef MALI
if(range<rangeMaxClamped) 
{fragmentOutputs.color=rgbyM;}
else
{fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,posM,0.0);}
#else
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,posM,0.0);
#endif
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["fxaaPixelShaderWGSL",0,{name:c,shader:d}])},532988,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(937034),a.i(643926),a.i(306169);let c="geometryVertexDeclaration";b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]="uniform mat4 viewProjection;uniform mat4 view;"),a.i(658057);let d="geometryUboDeclaration",e=`#include<sceneUboDeclaration>
`;b.ShaderStore.IncludesShadersStore[d]||(b.ShaderStore.IncludesShadersStore[d]=e),a.i(896790),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163),a.i(403470),a.i(602309);let f="geometryVertexShader",g=`precision highp float;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
#include<__decl__geometryVertex>
#include<clipPlaneVertexDeclaration>
attribute vec3 position;
#ifdef HAS_NORMAL_ATTRIBUTE
attribute vec3 normal;
#endif
#ifdef NEED_UV
varying vec2 vUV;
#ifdef ALPHATEST
uniform mat4 diffuseMatrix;
#endif
#ifdef BUMP
uniform mat4 bumpMatrix;varying vec2 vBumpUV;
#endif
#ifdef REFLECTIVITY
uniform mat4 reflectivityMatrix;uniform mat4 albedoMatrix;varying vec2 vReflectivityUV;varying vec2 vAlbedoUV;
#endif
#ifdef METALLIC_TEXTURE
varying vec2 vMetallicUV;uniform mat4 metallicMatrix;
#endif
#ifdef ROUGHNESS_TEXTURE
varying vec2 vRoughnessUV;uniform mat4 roughnessMatrix;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#ifdef BUMP
varying mat4 vWorldView;
#endif
#ifdef BUMP
varying vec3 vNormalW;
#else
varying vec3 vNormalV;
#endif
varying vec4 vViewPos;
#if defined(POSITION) || defined(BUMP)
varying vec3 vPositionW;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
uniform mat4 previousViewProjection;varying vec4 vCurrentPosition;varying vec4 vPreviousPosition;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef HAS_NORMAL_ATTRIBUTE
vec3 normalUpdated=normal;
#else
vec3 normalUpdated=vec3(0.0,0.0,0.0);
#endif
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=vec4(finalWorld*vec4(positionUpdated,1.0));
#ifdef BUMP
vWorldView=view*finalWorld;mat3 normalWorld=mat3(finalWorld);vNormalW=normalize(normalWorld*normalUpdated);
#else
#ifdef NORMAL_WORLDSPACE
vNormalV=normalize(vec3(finalWorld*vec4(normalUpdated,0.0)));
#else
vNormalV=normalize(vec3((view*finalWorld)*vec4(normalUpdated,0.0)));
#endif
#endif
vViewPos=view*worldPos;
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#if NUM_BONE_INFLUENCERS>0
mat4 previousInfluence;previousInfluence=mPreviousBones[int(matricesIndices[0])]*matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
previousInfluence+=mPreviousBones[int(matricesIndices[1])]*matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
previousInfluence+=mPreviousBones[int(matricesIndices[2])]*matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
previousInfluence+=mPreviousBones[int(matricesIndices[3])]*matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[0])]*matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[1])]*matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[2])]*matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[3])]*matricesWeightsExtra[3];
#endif
vPreviousPosition=previousViewProjection*finalPreviousWorld*previousInfluence*vec4(positionUpdated,1.0);
#else
vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#endif
#if defined(POSITION) || defined(BUMP)
vPositionW=worldPos.xyz/worldPos.w;
#endif
gl_Position=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#include<clipPlaneVertex>
#ifdef NEED_UV
#ifdef UV1
#if defined(ALPHATEST) && defined(ALPHATEST_UV1)
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#else
vUV=uvUpdated;
#endif
#ifdef BUMP_UV1
vBumpUV=vec2(bumpMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef REFLECTIVITY_UV1
vReflectivityUV=vec2(reflectivityMatrix*vec4(uvUpdated,1.0,0.0));
#else
#ifdef METALLIC_UV1
vMetallicUV=vec2(metallicMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef ROUGHNESS_UV1
vRoughnessUV=vec2(roughnessMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#endif
#ifdef ALBEDO_UV1
vAlbedoUV=vec2(albedoMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#endif
#ifdef UV2
#if defined(ALPHATEST) && defined(ALPHATEST_UV2)
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#else
vUV=uv2Updated;
#endif
#ifdef BUMP_UV2
vBumpUV=vec2(bumpMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#ifdef REFLECTIVITY_UV2
vReflectivityUV=vec2(reflectivityMatrix*vec4(uv2Updated,1.0,0.0));
#else
#ifdef METALLIC_UV2
vMetallicUV=vec2(metallicMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#ifdef ROUGHNESS_UV2
vRoughnessUV=vec2(roughnessMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef ALBEDO_UV2
vAlbedoUV=vec2(albedoMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#endif
#include<bumpVertex>
}
`;b.ShaderStore.ShadersStore[f]||(b.ShaderStore.ShadersStore[f]=g),a.s(["geometryVertexShader",0,{name:f,shader:g}],532988)},263250,a=>{"use strict";var b=a.i(625562);let c="ssao2PixelShader",d=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#ifdef SSAO
const scales: array<f32,16>=array<f32,16>(
0.1,
0.11406250000000001,
0.131640625,
0.15625,
0.187890625,
0.2265625,
0.272265625,
0.325,
0.384765625,
0.4515625,
0.525390625,
0.60625,
0.694140625,
0.7890625,
0.891015625,
1.0
);uniform near: f32;uniform radius: f32;var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;var randomSamplerSampler: sampler;var randomSampler: texture_2d<f32>;var normalSamplerSampler: sampler;var normalSampler: texture_2d<f32>;uniform randTextureTiles: f32;uniform samplesFactor: f32;uniform sampleSphere: array<vec3f,SAMPLES>;uniform totalStrength: f32;uniform base: f32;
#ifdef ORTHOGRAPHIC_CAMERA
uniform viewport: vec4f;
#else
uniform xViewport: f32;uniform yViewport: f32;
#endif
uniform depthProjection: mat3x3f;uniform maxZ: f32;uniform minZAspect: f32;uniform texelSize: vec2f;uniform projection: mat4x4f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var random: vec3f=textureSampleLevel(randomSampler,randomSamplerSampler,input.vUV*uniforms.randTextureTiles,0.0).rgb;var depth: f32=textureSampleLevel(depthSampler,depthSamplerSampler,input.vUV,0.0).r;var depthSign: f32=sign(depth);depth=depth*depthSign;var normal: vec3f=textureSampleLevel(normalSampler,normalSamplerSampler,input.vUV,0.0).rgb;var occlusion: f32=0.0;var correctedRadius: f32=min(uniforms.radius,uniforms.minZAspect*depth/uniforms.near);
#ifdef ORTHOGRAPHIC_CAMERA
var vViewRay: vec3f= vec3f(mix(uniforms.viewport.x,uniforms.viewport.y,input.vUV.x),mix(uniforms.viewport.z,uniforms.viewport.w,input.vUV.y),depthSign);
#else
var vViewRay: vec3f= vec3f((input.vUV.x*2.0-1.0)*uniforms.xViewport,(input.vUV.y*2.0-1.0)*uniforms.yViewport,depthSign);
#endif
var vDepthFactor: vec3f=uniforms.depthProjection* vec3f(1.0,1.0,depth);var origin: vec3f=vViewRay*vDepthFactor;var rvec: vec3f=random*2.0-1.0;rvec.z=0.0;var dotProduct: f32=dot(rvec,normal);rvec=select( vec3f(-rvec.y,0.0,rvec.x),rvec,1.0-abs(dotProduct)>1e-2);var tangent: vec3f=normalize(rvec-normal*dot(rvec,normal));var bitangent: vec3f=cross(normal,tangent);var tbn: mat3x3f= mat3x3f(tangent,bitangent,normal);var difference: f32;for (var i: i32=0; i<SAMPLES; i++) {var samplePosition: vec3f=scales[(i+ i32(random.x*16.0)) % 16]*tbn*uniforms.sampleSphere[(i+ i32(random.y*16.0)) % 16];samplePosition=samplePosition*correctedRadius+origin;var offset: vec4f= vec4f(samplePosition,1.0);offset=uniforms.projection*offset;offset=vec4f(offset.xyz/offset.w,offset.w);offset=vec4f(offset.xy*0.5+0.5,offset.z,offset.w);if (offset.x<0.0 || offset.y<0.0 || offset.x>1.0 || offset.y>1.0) {continue;}
var sampleDepth: f32=abs(textureSampleLevel(depthSampler,depthSamplerSampler,offset.xy,0.0).r);difference=depthSign*samplePosition.z-sampleDepth;var rangeCheck: f32=1.0-smoothstep(correctedRadius*0.5,correctedRadius,difference);occlusion+=step(EPSILON,difference)*rangeCheck;}
occlusion=occlusion*(1.0-smoothstep(uniforms.maxZ*0.75,uniforms.maxZ,depth));var ao: f32=1.0-uniforms.totalStrength*occlusion*uniforms.samplesFactor;var result: f32=clamp(ao+uniforms.base,0.0,1.0);fragmentOutputs.color= vec4f( vec3f(result),1.0);}
#else
#ifdef BLUR
uniform outSize: f32;uniform soften: f32;uniform tolerance: f32;uniform samples: i32;
#ifndef BLUR_BYPASS
var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;
#ifdef BLUR_LEGACY
fn blur13Bilateral(image: texture_2d<f32>,imageSampler: sampler,uv: vec2f,step: vec2f)->f32 {var result: f32=0.0;var off1: vec2f= vec2f(1.411764705882353)*step;var off2: vec2f= vec2f(3.2941176470588234)*step;var off3: vec2f= vec2f(5.176470588235294)*step;var compareDepth: f32=abs(textureSampleLevel(depthSampler,depthSamplerSampler,uv,0.0).r);var sampleDepth: f32;var weight: f32;var weightSum: f32=30.0;result+=textureSampleLevel(image,imageSampler,uv,0.0).r*30.0;sampleDepth=abs(textureSampleLevel(depthSampler,depthSamplerSampler,uv+off1,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+= weight;result+=textureSampleLevel(image,imageSampler,uv+off1,0.0).r*weight;sampleDepth=abs(textureSampleLevel(depthSampler,depthSamplerSampler,uv-off1,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+= weight;result+=textureSampleLevel(image,imageSampler,uv-off1,0.0).r*weight;sampleDepth=abs(textureSampleLevel(depthSampler,depthSamplerSampler,uv+off2,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureSampleLevel(image,imageSampler,uv+off2,0.0).r*weight;sampleDepth=abs(textureSampleLevel(depthSampler,depthSamplerSampler,uv-off2,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureSampleLevel(image,imageSampler,uv-off2,0.0).r*weight;sampleDepth=abs(textureSampleLevel(depthSampler,depthSamplerSampler,uv+off3,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureSampleLevel(image,imageSampler,uv+off3,0.0).r*weight;sampleDepth=abs(textureSampleLevel(depthSampler,depthSamplerSampler,uv-off3,0.0).r);weight=clamp(1.0/( 0.003+abs(compareDepth-sampleDepth)),0.0,30.0);weightSum+=weight;result+=textureSampleLevel(image,imageSampler,uv-off3,0.0).r*weight;return result/weightSum;}
#endif
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: f32=0.0;
#ifdef BLUR_BYPASS
result=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0).r;
#else
#ifdef BLUR_H
var step: vec2f= vec2f(1.0/uniforms.outSize,0.0);
#else
var step: vec2f= vec2f(0.0,1.0/uniforms.outSize);
#endif
#ifdef BLUR_LEGACY
result=blur13Bilateral(textureSampler,textureSamplerSampler,input.vUV,step);
#else
var compareDepth: f32=abs(textureSampleLevel(depthSampler,depthSamplerSampler,input.vUV,0.0).r);var weightSum: f32=0.0;for (var i: i32=-uniforms.samples; i<uniforms.samples; i+=2)
{var samplePos: vec2f=input.vUV+step*( f32(i)+0.5);var sampleDepth: f32=abs(textureSampleLevel(depthSampler,depthSamplerSampler,samplePos,0.0).r);var falloff: f32=smoothstep(0.0,
f32(uniforms.samples),
f32(uniforms.samples)-abs( f32(i))*uniforms.soften);var minDivider: f32=uniforms.tolerance*0.5+0.003;var weight: f32=falloff/( minDivider+abs(compareDepth-sampleDepth));result+=textureSampleLevel(textureSampler,textureSamplerSampler,samplePos,0.0).r*weight;weightSum+=weight;}
result/=weightSum;
#endif
#endif
fragmentOutputs.color=vec4f(result,result,result,1.0);}
#endif
#endif
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["ssao2PixelShaderWGSL",0,{name:c,shader:d}])},900799,a=>{"use strict";var b=a.i(625562);a.i(964653),a.i(533676),a.i(277267);let c="screenSpaceReflection2PixelShader",d=`#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define TEXTUREFUNC(s,c,lod) texture2DLodEXT(s,c,lod)
#define TEXTURECUBEFUNC(s,c,lod) textureLod(s,c,lod)
#else
#define TEXTUREFUNC(s,c,bias) texture2D(s,c,bias)
#define TEXTURECUBEFUNC(s,c,bias) textureCube(s,c,bias)
#endif
uniform sampler2D textureSampler;varying vec2 vUV;
#ifdef SSR_SUPPORTED
uniform sampler2D reflectivitySampler;uniform sampler2D normalSampler;uniform sampler2D depthSampler;
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
uniform sampler2D backDepthSampler;uniform float backSizeFactor;
#endif
#ifdef SSR_USE_ENVIRONMENT_CUBE
uniform samplerCube envCubeSampler;
#ifdef SSR_USE_LOCAL_REFLECTIONMAP_CUBIC
uniform vec3 vReflectionPosition;uniform vec3 vReflectionSize;
#endif
#endif
uniform mat4 view;uniform mat4 invView;uniform mat4 projection;uniform mat4 invProjectionMatrix;uniform mat4 projectionPixel;uniform float nearPlaneZ;uniform float farPlaneZ;uniform float stepSize;uniform float maxSteps;uniform float strength;uniform float thickness;uniform float roughnessFactor;uniform float reflectionSpecularFalloffExponent;uniform float maxDistance;uniform float selfCollisionNumSkip;uniform float reflectivityThreshold;
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<screenSpaceRayTrace>
vec3 hash(vec3 a)
{a=fract(a*0.8);a+=dot(a,a.yxz+19.19);return fract((a.xxy+a.yxx)*a.zyx);}
float computeAttenuationForIntersection(ivec2 hitPixel,vec2 hitUV,vec3 vsRayOrigin,vec3 vsHitPoint,vec3 reflectionVector,float maxRayDistance,float numIterations) {float attenuation=1.0;
#ifdef SSR_ATTENUATE_SCREEN_BORDERS
vec2 dCoords=smoothstep(0.2,0.6,abs(vec2(0.5,0.5)-hitUV.xy));attenuation*=clamp(1.0-(dCoords.x+dCoords.y),0.0,1.0);
#endif
#ifdef SSR_ATTENUATE_INTERSECTION_DISTANCE
attenuation*=1.0-clamp(distance(vsRayOrigin,vsHitPoint)/maxRayDistance,0.0,1.0);
#endif
#ifdef SSR_ATTENUATE_INTERSECTION_NUMITERATIONS
attenuation*=1.0-(numIterations/maxSteps);
#endif
#ifdef SSR_ATTENUATE_BACKFACE_REFLECTION
vec3 reflectionNormal=texelFetch(normalSampler,hitPixel,0).xyz;float directionBasedAttenuation=smoothstep(-0.17,0.0,dot(reflectionNormal,-reflectionVector));attenuation*=directionBasedAttenuation;
#endif
return attenuation;}
#endif
void main()
{
#ifdef SSR_SUPPORTED
vec4 colorFull=TEXTUREFUNC(textureSampler,vUV,0.0);vec3 color=colorFull.rgb;vec4 reflectivity=max(TEXTUREFUNC(reflectivitySampler,vUV,0.0),vec4(0.));
#ifndef SSR_DISABLE_REFLECTIVITY_TEST
if (max(reflectivity.r,max(reflectivity.g,reflectivity.b))<=reflectivityThreshold) {
#ifdef SSR_USE_BLUR
gl_FragColor=vec4(0.);
#else
gl_FragColor=colorFull;
#endif
return;}
#endif
#ifdef SSR_INPUT_IS_GAMMA_SPACE
color=toLinearSpace(color);
#endif
vec2 texSize=vec2(textureSize(depthSampler,0));vec3 csNormal=texelFetch(normalSampler,ivec2(vUV*texSize),0).xyz; 
#ifdef SSR_DECODE_NORMAL
csNormal=csNormal*2.0-1.0;
#endif
#ifdef SSR_NORMAL_IS_IN_WORLDSPACE
csNormal=(view*vec4(csNormal,0.0)).xyz;
#endif
float depth=texelFetch(depthSampler,ivec2(vUV*texSize),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
depth=linearizeDepth(depth,nearPlaneZ,farPlaneZ);
#endif
vec3 csPosition=computeViewPosFromUVDepth(vUV,depth,projection,invProjectionMatrix);
#ifdef ORTHOGRAPHIC_CAMERA
vec3 csViewDirection=vec3(0.,0.,1.);
#else
vec3 csViewDirection=normalize(csPosition);
#endif
vec3 csReflectedVector=reflect(csViewDirection,csNormal);
#ifdef SSR_USE_ENVIRONMENT_CUBE
vec3 wReflectedVector=vec3(invView*vec4(csReflectedVector,0.0));
#ifdef SSR_USE_LOCAL_REFLECTIONMAP_CUBIC
vec4 worldPos=invView*vec4(csPosition,1.0);wReflectedVector=parallaxCorrectNormal(worldPos.xyz,normalize(wReflectedVector),vReflectionSize,vReflectionPosition);
#endif
#ifdef SSR_INVERTCUBICMAP
wReflectedVector.y*=-1.0;
#endif
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
wReflectedVector.z*=-1.0;
#endif
vec3 envColor=TEXTURECUBEFUNC(envCubeSampler,wReflectedVector,0.0).xyz;
#ifdef SSR_ENVIRONMENT_CUBE_IS_GAMMASPACE
envColor=toLinearSpace(envColor);
#endif
#else
vec3 envColor=color;
#endif
float reflectionAttenuation=1.0;bool rayHasHit=false;vec2 startPixel;vec2 hitPixel;vec3 hitPoint;float numIterations;
#ifdef SSRAYTRACE_DEBUG
vec3 debugColor;
#endif
#ifdef SSR_ATTENUATE_FACING_CAMERA
reflectionAttenuation*=1.0-smoothstep(0.25,0.5,dot(-csViewDirection,csReflectedVector));
#endif
if (reflectionAttenuation>0.0) {
#ifdef SSR_USE_BLUR
vec3 jitt=vec3(0.);
#else
float roughness=1.0-reflectivity.a;vec3 jitt=mix(vec3(0.0),hash(csPosition)-vec3(0.5),roughness)*roughnessFactor; 
#endif
vec2 uv2=vUV*texSize;float c=(uv2.x+uv2.y)*0.25;float jitter=mod(c,1.0); 
rayHasHit=traceScreenSpaceRay1(
csPosition,
normalize(csReflectedVector+jitt),
projectionPixel,
depthSampler,
texSize,
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
backDepthSampler,
backSizeFactor,
#endif
thickness,
nearPlaneZ,
farPlaneZ,
stepSize,
jitter,
maxSteps,
maxDistance,
selfCollisionNumSkip,
startPixel,
hitPixel,
hitPoint,
numIterations
#ifdef SSRAYTRACE_DEBUG
,debugColor
#endif
);}
#ifdef SSRAYTRACE_DEBUG
gl_FragColor=vec4(debugColor,1.);return;
#endif
vec3 F0=reflectivity.rgb;vec3 fresnel=fresnelSchlickGGX(max(dot(csNormal,-csViewDirection),0.0),F0,vec3(1.));vec3 SSR=envColor;if (rayHasHit) {vec3 reflectedColor=texelFetch(textureSampler,ivec2(hitPixel),0).rgb;
#ifdef SSR_INPUT_IS_GAMMA_SPACE
reflectedColor=toLinearSpace(reflectedColor);
#endif
reflectionAttenuation*=computeAttenuationForIntersection(ivec2(hitPixel),hitPixel/texSize,csPosition,hitPoint,csReflectedVector,maxDistance,numIterations);SSR=reflectedColor*reflectionAttenuation+(1.0-reflectionAttenuation)*envColor;}
#ifndef SSR_BLEND_WITH_FRESNEL
SSR*=fresnel;
#endif
#ifdef SSR_USE_BLUR
float blur_radius=0.0;float roughness=1.0-reflectivity.a*(1.0-roughnessFactor);if (roughness>0.001) {float cone_angle=min(roughness,0.999)*3.14159265*0.5;float cone_len=distance(startPixel,hitPixel);float op_len=2.0*tan(cone_angle)*cone_len; 
float a=op_len;float h=cone_len;float a2=a*a;float fh2=4.0f*h*h;blur_radius=(a*(sqrt(a2+fh2)-a))/(4.0f*h);}
gl_FragColor=vec4(SSR,blur_radius/255.0); 
#else
#ifdef SSR_BLEND_WITH_FRESNEL
vec3 reflectionMultiplier=clamp(pow(fresnel*strength,vec3(reflectionSpecularFalloffExponent)),0.0,1.0);
#else
vec3 reflectionMultiplier=clamp(pow(reflectivity.rgb*strength,vec3(reflectionSpecularFalloffExponent)),0.0,1.0);
#endif
vec3 colorMultiplier=1.0-reflectionMultiplier;vec3 finalColor=(color*colorMultiplier)+(SSR*reflectionMultiplier);
#ifdef SSR_OUTPUT_IS_GAMMA_SPACE
finalColor=toGammaSpace(finalColor);
#endif
gl_FragColor=vec4(finalColor,colorFull.a);
#endif
#else
gl_FragColor=TEXTUREFUNC(textureSampler,vUV,0.0);
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["screenSpaceReflection2PixelShader",0,{name:c,shader:d}])},608038,401984,a=>{"use strict";var b=a.i(664731);function c(a){return a.split(" ").filter(a=>""!==a).map(a=>parseFloat(a))}function d(a,b,d){for(;d.length!==b;){let b=c(a.lines[a.index++]);d.push(...b)}}function e(a){let e={lines:new TextDecoder("utf-8").decode(a).split("\n"),index:0},f={version:e.lines[0],candelaValues:[],horizontalAngles:[],verticalAngles:[],numberOfHorizontalAngles:0,numberOfVerticalAngles:0};for(e.index=1;e.lines.length>0&&!e.lines[e.index].includes("TILT=");)e.index++;e.lines[e.index].includes("INCLUDE"),e.index++;let g=c(e.lines[e.index++]);f.numberOfLights=g[0],f.lumensPerLamp=g[1],f.candelaMultiplier=g[2],f.numberOfVerticalAngles=g[3],f.numberOfHorizontalAngles=g[4],f.photometricType=g[5],f.unitsType=g[6],f.width=g[7],f.length=g[8],f.height=g[9];let h=c(e.lines[e.index++]);f.ballastFactor=h[0],f.fileGenerationType=h[1],f.inputWatts=h[2];for(let a=0;a<f.numberOfHorizontalAngles;a++)f.candelaValues[a]=[];d(e,f.numberOfVerticalAngles,f.verticalAngles),d(e,f.numberOfHorizontalAngles,f.horizontalAngles);for(let a=0;a<f.numberOfHorizontalAngles;a++)d(e,f.numberOfVerticalAngles,f.candelaValues[a]);let i=-1;for(let a=0;a<f.numberOfHorizontalAngles;a++)for(let b=0;b<f.numberOfVerticalAngles;b++)f.candelaValues[a][b]*=f.candelaValues[a][b]*f.candelaMultiplier*f.ballastFactor*f.fileGenerationType,i=Math.max(i,f.candelaValues[a][b]);if(i>0)for(let a=0;a<f.numberOfHorizontalAngles;a++)for(let b=0;b<f.numberOfVerticalAngles;b++)f.candelaValues[a][b]/=i;let j=new Float32Array(64800),k=f.horizontalAngles[0],l=f.horizontalAngles[f.numberOfHorizontalAngles-1];for(let a=0;a<64800;a++){let c=a%360,d=Math.floor(a/360);l-k!=0&&(c<k||c>=l)&&(c%=2*l)>l&&(c=2*l-c),j[d+180*c]=function(a,c,d){let e=0,f=0,g=0,h=0,i=0,j=0;for(let b=0;b<a.numberOfHorizontalAngles-1;b++)if(d<a.horizontalAngles[b+1]||b===a.numberOfHorizontalAngles-2){f=b,g=a.horizontalAngles[b],h=a.horizontalAngles[b+1];break}for(let b=0;b<a.numberOfVerticalAngles-1;b++)if(c<a.verticalAngles[b+1]||b===a.numberOfVerticalAngles-2){e=b,i=a.verticalAngles[b],j=a.verticalAngles[b+1];break}let k=h-g,l=j-i;if(0===l)return 0;let m=0===k?0:(d-g)/k,n=(c-i)/l,o=0===k?f:f+1,p=(0,b.Lerp)(a.candelaValues[f][e],a.candelaValues[o][e],m),q=(0,b.Lerp)(a.candelaValues[f][e+1],a.candelaValues[o][e+1],m);return(0,b.Lerp)(p,q,n)}(f,d,c)}return{width:180,height:1,data:j}}a.s(["LoadIESData",()=>e],401984);class f{constructor(){this.supportCascades=!1}loadCubeData(){throw".ies not supported in Cube."}loadData(a,b,c){let d=e(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));c(d.width,d.height,b.useMipMaps,!1,()=>{let a=b.getEngine();b.type=1,b.format=6,b._gammaSpace=!1,a._uploadDataToTextureDirectly(b,d.data)})}}a.s(["_IESTextureLoader",()=>f],608038)},539938,a=>{"use strict";var b=a.i(625562);let c="shadowMapVertexMetric",d=`#if SM_USEDISTANCE==1
vPositionWSM=worldPos.xyz;
#endif
#if SM_DEPTHTEXTURE==1
#ifdef IS_NDC_HALF_ZRANGE
#define BIASFACTOR 0.5
#else
#define BIASFACTOR 1.0
#endif
#ifdef USE_REVERSE_DEPTHBUFFER
gl_Position.z-=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;
#else
gl_Position.z+=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;
#endif
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
zSM=gl_Position.z;gl_Position.z=0.0;
#elif SM_USEDISTANCE==0
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetricSM=(-gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#else
vDepthMetricSM=(gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s(["shadowMapVertexMetric",0,{name:c,shader:d}])},838229,260289,a=>{"use strict";var b=a.i(625562);a.i(399154),a.i(320125),a.i(937034),a.i(643926),a.i(964653),a.i(520563);let c="meshVertexDeclaration",d=`uniform mat4 world;uniform float visibility;
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([],260289);let e="shadowMapVertexDeclaration",f=`#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`;b.ShaderStore.IncludesShadersStore[e]||(b.ShaderStore.IncludesShadersStore[e]=f),a.i(658057),a.i(386919);let g="shadowMapUboDeclaration",h=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;b.ShaderStore.IncludesShadersStore[g]||(b.ShaderStore.IncludesShadersStore[g]=h);let i="shadowMapVertexExtraDeclaration",j=`#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`;b.ShaderStore.IncludesShadersStore[i]||(b.ShaderStore.IncludesShadersStore[i]=j),a.i(896790),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163);let k="shadowMapVertexNormalBias",l=`#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
#else
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);
#endif
float ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;
#endif
`;b.ShaderStore.IncludesShadersStore[k]||(b.ShaderStore.IncludesShadersStore[k]=l),a.i(539938),a.i(403470);let m="shadowMapVertexShader",n=`attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`;b.ShaderStore.ShadersStore[m]||(b.ShaderStore.ShadersStore[m]=n),a.s(["shadowMapVertexShader",0,{name:m,shader:n}],838229)},761421,371588,418423,810183,a=>{"use strict";var b=a.i(625562);let c="gaussianSplattingVertexDeclaration";b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]="attribute vec3 position;attribute vec4 splatIndex0;attribute vec4 splatIndex1;attribute vec4 splatIndex2;attribute vec4 splatIndex3;uniform mat4 view;uniform mat4 projection;uniform mat4 world;uniform vec4 vEyePosition;"),a.s([],371588),a.i(658057),a.i(386919);let d="gaussianSplattingUboDeclaration",e=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute vec3 position;attribute vec4 splatIndex0;attribute vec4 splatIndex1;attribute vec4 splatIndex2;attribute vec4 splatIndex3;
`;b.ShaderStore.IncludesShadersStore[d]||(b.ShaderStore.IncludesShadersStore[d]=e),a.s([],418423),a.i(896790),a.i(506404),a.i(544248),a.i(964653);let f="gaussianSplatting",g=`#if !defined(WEBGL2) && !defined(WEBGPU) && !defined(NATIVE)
mat3 transpose(mat3 matrix) {return mat3(matrix[0][0],matrix[1][0],matrix[2][0],
matrix[0][1],matrix[1][1],matrix[2][1],
matrix[0][2],matrix[1][2],matrix[2][2]);}
#endif
vec2 getDataUV(float index,vec2 textureSize) {float y=floor(index/textureSize.x);float x=index-y*textureSize.x;return vec2((x+0.5)/textureSize.x,(y+0.5)/textureSize.y);}
#if SH_DEGREE>0
ivec2 getDataUVint(float index,vec2 textureSize) {float y=floor(index/textureSize.x);float x=index-y*textureSize.x;return ivec2(uint(x+0.5),uint(y+0.5));}
#endif
struct Splat {vec4 center;vec4 color;vec4 covA;vec4 covB;
#if SH_DEGREE>0
uvec4 sh0; 
#endif
#if SH_DEGREE>1
uvec4 sh1;
#endif
#if SH_DEGREE>2
uvec4 sh2;
#endif
};float getSplatIndex(int localIndex)
{float splatIndex;switch (localIndex)
{case 0: splatIndex=splatIndex0.x; break;case 1: splatIndex=splatIndex0.y; break;case 2: splatIndex=splatIndex0.z; break;case 3: splatIndex=splatIndex0.w; break;case 4: splatIndex=splatIndex1.x; break;case 5: splatIndex=splatIndex1.y; break;case 6: splatIndex=splatIndex1.z; break;case 7: splatIndex=splatIndex1.w; break;case 8: splatIndex=splatIndex2.x; break;case 9: splatIndex=splatIndex2.y; break;case 10: splatIndex=splatIndex2.z; break;case 11: splatIndex=splatIndex2.w; break;case 12: splatIndex=splatIndex3.x; break;case 13: splatIndex=splatIndex3.y; break;case 14: splatIndex=splatIndex3.z; break;case 15: splatIndex=splatIndex3.w; break;}
return splatIndex;}
Splat readSplat(float splatIndex)
{Splat splat;vec2 splatUV=getDataUV(splatIndex,dataTextureSize);splat.center=texture2D(centersTexture,splatUV);splat.color=texture2D(colorsTexture,splatUV);splat.covA=texture2D(covariancesATexture,splatUV)*splat.center.w;splat.covB=texture2D(covariancesBTexture,splatUV)*splat.center.w;
#if SH_DEGREE>0
ivec2 splatUVint=getDataUVint(splatIndex,dataTextureSize);splat.sh0=texelFetch(shTexture0,splatUVint,0);
#endif
#if SH_DEGREE>1
splat.sh1=texelFetch(shTexture1,splatUVint,0);
#endif
#if SH_DEGREE>2
splat.sh2=texelFetch(shTexture2,splatUVint,0);
#endif
return splat;}
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
vec3 computeColorFromSHDegree(vec3 dir,const vec3 sh[16])
{const float SH_C0=0.28209479;const float SH_C1=0.48860251;float SH_C2[5];SH_C2[0]=1.092548430;SH_C2[1]=-1.09254843;SH_C2[2]=0.315391565;SH_C2[3]=-1.09254843;SH_C2[4]=0.546274215;float SH_C3[7];SH_C3[0]=-0.59004358;SH_C3[1]=2.890611442;SH_C3[2]=-0.45704579;SH_C3[3]=0.373176332;SH_C3[4]=-0.45704579;SH_C3[5]=1.445305721;SH_C3[6]=-0.59004358;vec3 result=/*SH_C0**/sh[0];
#if SH_DEGREE>0
float x=dir.x;float y=dir.y;float z=dir.z;result+=- SH_C1*y*sh[1]+SH_C1*z*sh[2]-SH_C1*x*sh[3];
#if SH_DEGREE>1
float xx=x*x,yy=y*y,zz=z*z;float xy=x*y,yz=y*z,xz=x*z;result+=
SH_C2[0]*xy*sh[4] +
SH_C2[1]*yz*sh[5] +
SH_C2[2]*(2.0*zz-xx-yy)*sh[6] +
SH_C2[3]*xz*sh[7] +
SH_C2[4]*(xx-yy)*sh[8];
#if SH_DEGREE>2
result+=
SH_C3[0]*y*(3.0*xx-yy)*sh[9] +
SH_C3[1]*xy*z*sh[10] +
SH_C3[2]*y*(4.0*zz-xx-yy)*sh[11] +
SH_C3[3]*z*(2.0*zz-3.0*xx-3.0*yy)*sh[12] +
SH_C3[4]*x*(4.0*zz-xx-yy)*sh[13] +
SH_C3[5]*z*(xx-yy)*sh[14] +
SH_C3[6]*x*(xx-3.0*yy)*sh[15];
#endif
#endif
#endif
return result;}
vec4 decompose(uint value)
{vec4 components=vec4(
float((value ) & 255u),
float((value>>uint( 8)) & 255u),
float((value>>uint(16)) & 255u),
float((value>>uint(24)) & 255u));return components*vec4(2./255.)-vec4(1.);}
vec3 computeSH(Splat splat,vec3 dir)
{vec3 sh[16];sh[0]=vec3(0.,0.,0.);
#if SH_DEGREE>0
vec4 sh00=decompose(splat.sh0.x);vec4 sh01=decompose(splat.sh0.y);vec4 sh02=decompose(splat.sh0.z);sh[1]=vec3(sh00.x,sh00.y,sh00.z);sh[2]=vec3(sh00.w,sh01.x,sh01.y);sh[3]=vec3(sh01.z,sh01.w,sh02.x);
#endif
#if SH_DEGREE>1
vec4 sh03=decompose(splat.sh0.w);vec4 sh04=decompose(splat.sh1.x);vec4 sh05=decompose(splat.sh1.y);sh[4]=vec3(sh02.y,sh02.z,sh02.w);sh[5]=vec3(sh03.x,sh03.y,sh03.z);sh[6]=vec3(sh03.w,sh04.x,sh04.y);sh[7]=vec3(sh04.z,sh04.w,sh05.x);sh[8]=vec3(sh05.y,sh05.z,sh05.w);
#endif
#if SH_DEGREE>2
vec4 sh06=decompose(splat.sh1.z);vec4 sh07=decompose(splat.sh1.w);vec4 sh08=decompose(splat.sh2.x);vec4 sh09=decompose(splat.sh2.y);vec4 sh10=decompose(splat.sh2.z);vec4 sh11=decompose(splat.sh2.w);sh[9]=vec3(sh06.x,sh06.y,sh06.z);sh[10]=vec3(sh06.w,sh07.x,sh07.y);sh[11]=vec3(sh07.z,sh07.w,sh08.x);sh[12]=vec3(sh08.y,sh08.z,sh08.w);sh[13]=vec3(sh09.x,sh09.y,sh09.z);sh[14]=vec3(sh09.w,sh10.x,sh10.y);sh[15]=vec3(sh10.z,sh10.w,sh11.x); 
#endif
return computeColorFromSHDegree(dir,sh);}
#else
vec3 computeSH(Splat splat,vec3 dir)
{return vec3(0.,0.,0.);}
#endif
vec4 gaussianSplatting(vec2 meshPos,vec3 worldPos,vec2 scale,vec3 covA,vec3 covB,mat4 worldMatrix,mat4 viewMatrix,mat4 projectionMatrix)
{mat4 modelView=viewMatrix*worldMatrix;vec4 camspace=viewMatrix*vec4(worldPos,1.);vec4 pos2d=projectionMatrix*camspace;float bounds=1.2*pos2d.w;if (pos2d.z<-pos2d.w || pos2d.x<-bounds || pos2d.x>bounds
|| pos2d.y<-bounds || pos2d.y>bounds) {return vec4(0.0,0.0,2.0,1.0);}
mat3 Vrk=mat3(
covA.x,covA.y,covA.z,
covA.y,covB.x,covB.y,
covA.z,covB.y,covB.z
);bool isOrtho=abs(projectionMatrix[3][3]-1.0)<0.001;mat3 J;if (isOrtho) {J=mat3(
focal.x,0.,0.,
0.,focal.y,0.,
0.,0.,0.
);} else {J=mat3(
focal.x/camspace.z,0.,-(focal.x*camspace.x)/(camspace.z*camspace.z),
0.,focal.y/camspace.z,-(focal.y*camspace.y)/(camspace.z*camspace.z),
0.,0.,0.
);}
mat3 invy=mat3(1,0,0,0,-1,0,0,0,1);mat3 T=invy*transpose(mat3(modelView))*J;mat3 cov2d=transpose(T)*Vrk*T;
#if COMPENSATION
float c00=cov2d[0][0];float c11=cov2d[1][1];float c01=cov2d[0][1];float detOrig=c00*c11-c01*c01;
#endif
cov2d[0][0]+=kernelSize;cov2d[1][1]+=kernelSize;
#if COMPENSATION
vec3 c2d=vec3(cov2d[0][0],c01,cov2d[1][1]);float detBlur=c2d.x*c2d.z-c2d.y*c2d.y;float compensation=sqrt(max(0.,detOrig/detBlur));vColor.w*=compensation;
#endif
float mid=(cov2d[0][0]+cov2d[1][1])/2.0;float radius=length(vec2((cov2d[0][0]-cov2d[1][1])/2.0,cov2d[0][1]));float epsilon=0.0001;float lambda1=mid+radius+epsilon,lambda2=mid-radius+epsilon;if (lambda2<0.0)
{return vec4(0.0,0.0,2.0,1.0);}
vec2 diagonalVector=normalize(vec2(cov2d[0][1],lambda1-cov2d[0][0]));vec2 majorAxis=min(sqrt(2.0*lambda1),1024.0)*diagonalVector;vec2 minorAxis=min(sqrt(2.0*lambda2),1024.0)*vec2(diagonalVector.y,-diagonalVector.x);vec2 vCenter=vec2(pos2d);float scaleFactor=isOrtho ? 1.0 : pos2d.w;return vec4(
vCenter 
+ ((meshPos.x*majorAxis
+ meshPos.y*minorAxis)*invViewport*scaleFactor)*scale,pos2d.zw);}`;b.ShaderStore.IncludesShadersStore[f]||(b.ShaderStore.IncludesShadersStore[f]=g),a.s([],810183),a.i(403470),a.i(164403),a.i(705551);let h="gaussianSplattingVertexShader",i=`#include<__decl__gaussianSplattingVertex>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
uniform vec2 invViewport;uniform vec2 dataTextureSize;uniform vec2 focal;uniform float kernelSize;uniform vec3 eyePosition;uniform vec3 viewDirectionFactor;uniform float alpha;uniform sampler2D covariancesATexture;uniform sampler2D covariancesBTexture;uniform sampler2D centersTexture;uniform sampler2D colorsTexture;
#if SH_DEGREE>0
uniform highp usampler2D shTexture0;
#endif
#if SH_DEGREE>1
uniform highp usampler2D shTexture1;
#endif
#if SH_DEGREE>2
uniform highp usampler2D shTexture2;
#endif
varying vec4 vColor;varying vec2 vPosition;
#include<gaussianSplatting>
void main () {float splatIndex=getSplatIndex(int(position.z+0.5));Splat splat=readSplat(splatIndex);vec3 covA=splat.covA.xyz;vec3 covB=vec3(splat.covA.w,splat.covB.xy);vec4 worldPos=world*vec4(splat.center.xyz,1.0);vColor=splat.color;vPosition=position.xy;
#if SH_DEGREE>0
mat3 worldRot=mat3(world);mat3 normWorldRot=inverseMat3(worldRot);vec3 dir=normalize(normWorldRot*(worldPos.xyz-eyePosition));dir*=viewDirectionFactor;vColor.xyz=splat.color.xyz+computeSH(splat,dir);
#endif
vColor.w*=alpha;gl_Position=gaussianSplatting(position.xy,worldPos.xyz,vec2(1.,1.),covA,covB,world,view,projection);
#include<clipPlaneVertex>
#include<fogVertex>
#include<logDepthVertex>
}
`;b.ShaderStore.ShadersStore[h]||(b.ShaderStore.ShadersStore[h]=i),a.s(["gaussianSplattingVertexShader",0,{name:h,shader:i}],761421)},124344,8449,a=>{"use strict";var b,c,d=a.i(70458),e=a.i(779438),f=a.i(608568);function g(a){let b=0,c=Date.now();a.observableParameters=a.observableParameters??{};let d=a.contextObservable.add(e=>{let f=Date.now();b=f-c;let g={startTime:c,currentTime:f,deltaTime:b,completeRate:b/a.timeout,payload:e};a.onTick&&a.onTick(g),a.breakCondition&&a.breakCondition()&&(a.contextObservable.remove(d),a.onAborted&&a.onAborted(g)),b>=a.timeout&&(a.contextObservable.remove(d),a.onEnded&&a.onEnded(g))},a.observableParameters.mask,a.observableParameters.insertFirst,a.observableParameters.scope);return d}(b=c||(c={}))[b.INIT=0]="INIT",b[b.STARTED=1]="STARTED",b[b.ENDED=2]="ENDED";class h{constructor(a){this.onEachCountObservable=new f.Observable,this.onTimerAbortedObservable=new f.Observable,this.onTimerEndedObservable=new f.Observable,this.onStateChangedObservable=new f.Observable,this._observer=null,this._breakOnNextTick=!1,this._tick=a=>{let b=Date.now();this._timer=b-this._startTime;let c={startTime:this._startTime,currentTime:b,deltaTime:this._timer,completeRate:this._timer/this._timeToEnd,payload:a},d=this._breakOnNextTick||this._breakCondition(c);d||this._timer>=this._timeToEnd?this._stop(c,d):this.onEachCountObservable.notifyObservers(c)},this._setState(0),this._contextObservable=a.contextObservable,this._observableParameters=a.observableParameters??{},this._breakCondition=a.breakCondition??(()=>!1),this._timeToEnd=a.timeout,a.onEnded&&this.onTimerEndedObservable.add(a.onEnded),a.onTick&&this.onEachCountObservable.add(a.onTick),a.onAborted&&this.onTimerAbortedObservable.add(a.onAborted)}set breakCondition(a){this._breakCondition=a}clearObservables(){this.onEachCountObservable.clear(),this.onTimerAbortedObservable.clear(),this.onTimerEndedObservable.clear(),this.onStateChangedObservable.clear()}start(a=this._timeToEnd){if(1===this._state)throw Error("Timer already started. Please stop it before starting again");this._timeToEnd=a,this._startTime=Date.now(),this._timer=0,this._observer=this._contextObservable.add(this._tick,this._observableParameters.mask,this._observableParameters.insertFirst,this._observableParameters.scope),this._setState(1)}stop(){1===this._state&&(this._breakOnNextTick=!0)}dispose(){this._observer&&this._contextObservable.remove(this._observer),this.clearObservables()}_setState(a){this._state=a,this.onStateChangedObservable.notifyObservers(this._state)}_stop(a,b=!1){this._contextObservable.remove(this._observer),this._setState(2),b?this.onTimerAbortedObservable.notifyObservers(a):this.onTimerEndedObservable.notifyObservers(a)}}a.s(["AdvancedTimer",()=>h,"setAndStartTimer",()=>g],8449);var i=a.i(392511),j=a.i(994060),k=a.i(419809);class l extends d.FlowGraphAsyncExecutionBlock{constructor(a){super(a),this.cancel=this._registerSignalInput("cancel"),this.duration=this.registerDataInput("duration",e.RichTypeNumber),this.lastDelayIndex=this.registerDataOutput("lastDelayIndex",e.RichTypeFlowGraphInteger,new k.FlowGraphInteger(-1))}_preparePendingTasks(a){let b=this.duration.getValue(a);if(b<0||isNaN(b)||!isFinite(b))return this._reportError(a,"Invalid duration in SetDelay block");if(a._getGlobalContextVariable("activeDelays",0)>=l.MaxParallelDelayCount)return this._reportError(a,"Max parallel delays reached");let c=a._getGlobalContextVariable("lastDelayIndex",-1),d=a._getExecutionVariable(this,"pendingDelays",[]),e=new h({timeout:1e3*b,contextObservable:a.configuration.scene.onBeforeRenderObservable,onEnded:()=>this._onEnded(e,a)});e.start();let f=c+1;this.lastDelayIndex.setValue(new k.FlowGraphInteger(f),a),a._setGlobalContextVariable("lastDelayIndex",f),d[f]=e,a._setExecutionVariable(this,"pendingDelays",d),this._updateGlobalTimers(a)}_cancelPendingTasks(a){for(let b of a._getExecutionVariable(this,"pendingDelays",[]))b?.dispose();a._deleteExecutionVariable(this,"pendingDelays"),this.lastDelayIndex.setValue(new k.FlowGraphInteger(-1),a),this._updateGlobalTimers(a)}_execute(a,b){b===this.cancel?this._cancelPendingTasks(a):(this._preparePendingTasks(a),this.out._activateSignal(a))}getClassName(){return"FlowGraphSetDelayBlock"}_onEnded(a,b){let c=b._getExecutionVariable(this,"pendingDelays",[]),d=c.indexOf(a);-1!==d?c.splice(d,1):i.Logger.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list"),b._removePendingBlock(this),this.done._activateSignal(b),this._updateGlobalTimers(b)}_updateGlobalTimers(a){let b=a._getExecutionVariable(this,"pendingDelays",[]),c=a._getGlobalContextVariable("pendingDelays",[]);for(let a=0;a<b.length;a++){if(!b[a])continue;let d=b[a];c[a]&&c[a]!==d?i.Logger.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list"):c[a]=d}a._setGlobalContextVariable("pendingDelays",c)}}l.MaxParallelDelayCount=100,(0,j.RegisterClass)("FlowGraphSetDelayBlock",l),a.s(["FlowGraphSetDelayBlock",()=>l],124344)},545460,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(719984),e=a.i(994060),f=a.i(71870),g=a.i(465679);class h extends f.FlowGraphUnaryOperationBlock{constructor(a){super((0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),(0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),a=>a.transpose?a.transpose():d.Matrix.Transpose(a),"FlowGraphTransposeBlock",a)}}(0,e.RegisterClass)("FlowGraphTransposeBlock",h);class i extends f.FlowGraphUnaryOperationBlock{constructor(a){super((0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),c.RichTypeNumber,a=>a.determinant(),"FlowGraphDeterminantBlock",a)}}(0,e.RegisterClass)("FlowGraphDeterminantBlock",i);class j extends f.FlowGraphUnaryOperationBlock{constructor(a){super((0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),(0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),a=>a.inverse?a.inverse():d.Matrix.Invert(a),"FlowGraphInvertMatrixBlock",a)}}(0,e.RegisterClass)("FlowGraphInvertMatrixBlock",j);class k extends g.FlowGraphBinaryOperationBlock{constructor(a){super((0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),(0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),(0,c.getRichTypeByFlowGraphType)(a?.matrixType||"Matrix"),(a,b)=>b.multiply(a),"FlowGraphMatrixMultiplicationBlock",a)}}(0,e.RegisterClass)("FlowGraphMatrixMultiplicationBlock",k);class l extends b.FlowGraphBlock{constructor(a){super(a),this.input=this.registerDataInput("input",c.RichTypeMatrix),this.position=this.registerDataOutput("position",c.RichTypeVector3),this.rotationQuaternion=this.registerDataOutput("rotationQuaternion",c.RichTypeQuaternion),this.scaling=this.registerDataOutput("scaling",c.RichTypeVector3),this.isValid=this.registerDataOutput("isValid",c.RichTypeBoolean,!1)}_updateOutputs(a){let b=a._getExecutionVariable(this,"executionId",-1),c=a._getExecutionVariable(this,"cachedPosition",null),e=a._getExecutionVariable(this,"cachedRotation",null),f=a._getExecutionVariable(this,"cachedScaling",null);if(b===a.executionId&&c&&e&&f)this.position.setValue(c,a),this.rotationQuaternion.setValue(e,a),this.scaling.setValue(f,a);else{let b=this.input.getValue(a),g=c||new d.Vector3,h=e||new d.Quaternion,i=f||new d.Vector3,j=Math.round(1e4*b.m[3])/1e4,k=Math.round(1e4*b.m[7])/1e4,l=Math.round(1e4*b.m[11])/1e4,m=Math.round(1e4*b.m[15])/1e4;if(0!==j||0!==k||0!==l||1!==m){this.isValid.setValue(!1,a),this.position.setValue(d.Vector3.Zero(),a),this.rotationQuaternion.setValue(d.Quaternion.Identity(),a),this.scaling.setValue(d.Vector3.One(),a);return}let n=b.decompose(i,h,g);this.isValid.setValue(n,a),this.position.setValue(g,a),this.rotationQuaternion.setValue(h,a),this.scaling.setValue(i,a),a._setExecutionVariable(this,"cachedPosition",g),a._setExecutionVariable(this,"cachedRotation",h),a._setExecutionVariable(this,"cachedScaling",i),a._setExecutionVariable(this,"executionId",a.executionId)}}getClassName(){return"FlowGraphMatrixDecompose"}}(0,e.RegisterClass)("FlowGraphMatrixDecompose",l);class m extends b.FlowGraphBlock{constructor(a){super(a),this.position=this.registerDataInput("position",c.RichTypeVector3),this.rotationQuaternion=this.registerDataInput("rotationQuaternion",c.RichTypeQuaternion),this.scaling=this.registerDataInput("scaling",c.RichTypeVector3),this.value=this.registerDataOutput("value",c.RichTypeMatrix)}_updateOutputs(a){let b=a._getExecutionVariable(this,"executionId",-1),c=a._getExecutionVariable(this,"cachedMatrix",null);if(b===a.executionId&&c)this.value.setValue(c,a);else{let b=d.Matrix.Compose(this.scaling.getValue(a),this.rotationQuaternion.getValue(a),this.position.getValue(a));this.value.setValue(b,a),a._setExecutionVariable(this,"cachedMatrix",b),a._setExecutionVariable(this,"executionId",a.executionId)}}getClassName(){return"FlowGraphMatrixCompose"}}(0,e.RegisterClass)("FlowGraphMatrixCompose",m),a.s(["FlowGraphDeterminantBlock",()=>i,"FlowGraphInvertMatrixBlock",()=>j,"FlowGraphMatrixComposeBlock",()=>m,"FlowGraphMatrixDecomposeBlock",()=>l,"FlowGraphMatrixMultiplicationBlock",()=>k,"FlowGraphTransposeBlock",()=>h])},369786,a=>{"use strict";var b=a.i(625562);a.i(566182),a.i(463068),a.i(630447),a.i(196025),a.i(830981),a.i(784075),a.i(36816),a.i(850492),a.i(160815),a.i(435),a.i(842357);let c="intersectionFunctions",d=`fn diskIntersectWithBackFaceCulling(ro: vec3f,rd: vec3f,c: vec3f,r: f32)->f32 {var d: f32=rd.y;if(d>0.0) { return 1e6; }
var o: vec3f=ro-c;var t: f32=-o.y/d;var q: vec3f=o+rd*t;return select(1e6,t,(dot(q,q)<r*r));}
fn sphereIntersect(ro: vec3f,rd: vec3f,ce: vec3f,ra: f32)->vec2f {var oc: vec3f=ro-ce;var b: f32=dot(oc,rd);var c: f32=dot(oc,oc)-ra*ra;var h: f32=b*b-c;if(h<0.0) { return vec2f(-1.,-1.); }
h=sqrt(h);return vec2f(-b+h,-b-h);}
fn sphereIntersectFromOrigin(ro: vec3f,rd: vec3f,ra: f32)->vec2f {var b: f32=dot(ro,rd);var c: f32=dot(ro,ro)-ra*ra;var h: f32=b*b-c;if(h<0.0) { return vec2f(-1.,-1.); }
h=sqrt(h);return vec2f(-b+h,-b-h);}`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.i(197011),a.i(439654),a.i(410897),a.i(316972);let e="backgroundPixelShader",f=`#include<backgroundUboDeclaration>
#include<helperFunctions>
varying vPositionW: vec3f;
#ifdef MAINUV1
varying vMainUV1: vec2f;
#endif 
#ifdef MAINUV2 
varying vMainUV2: vec2f; 
#endif 
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef DIFFUSE
#if DIFFUSEDIRECTUV==1
#define vDiffuseUV vMainUV1
#elif DIFFUSEDIRECTUV==2
#define vDiffuseUV vMainUV2
#else
varying vDiffuseUV: vec2f;
#endif
var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
var reflectionSamplerSampler: sampler;var reflectionSampler: texture_cube<f32>;
#ifdef TEXTURELODSUPPORT
#else
var reflectionLowSamplerSampler: sampler;var reflectionLowSampler: texture_cube<f32>;var reflectionHighSamplerSampler: sampler;var reflectionHighSampler: texture_cube<f32>;
#endif
#else
var reflectionSamplerSampler: sampler;var reflectionSampler: texture_2d<f32>;
#ifdef TEXTURELODSUPPORT
#else
var reflectionLowSamplerSampler: sampler;var reflectionLowSampler: texture_2d<f32>;var reflectionHighSamplerSampler: sampler;var reflectionHighSampler: texture_2d<f32>;
#endif
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#endif
#include<reflectionFunction>
#endif
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE;
#endif
#ifndef SHADOWONLY
#define SHADOWONLY;
#endif
#include<imageProcessingDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<imageProcessingFunctions>
#include<logDepthDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#ifdef REFLECTIONFRESNEL
#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
fn fresnelSchlickEnvironmentGGX(VdotN: f32,reflectance0: vec3f,reflectance90: vec3f,smoothness: f32)->vec3f
{var weight: f32=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);return reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));}
#endif
#ifdef PROJECTED_GROUND
#include<intersectionFunctions>
fn project(viewDirectionW: vec3f,eyePosition: vec3f)->vec3f {var radius: f32=uniforms.projectedGroundInfos.x;var height: f32=uniforms.projectedGroundInfos.y;var camDir: vec3f=-viewDirectionW;var skySphereDistance: f32=sphereIntersectFromOrigin(eyePosition,camDir,radius).x;var skySpherePositionW: vec3f=eyePosition+camDir*skySphereDistance;var p: vec3f=normalize(skySpherePositionW);var upEyePosition=vec3f(eyePosition.x,eyePosition.y-height,eyePosition.z);var sIntersection: f32=sphereIntersectFromOrigin(upEyePosition,p,radius).x;var h: vec3f= vec3f(0.0,-height,0.0);var dIntersection: f32=diskIntersectWithBackFaceCulling(upEyePosition,p,h,radius);p=(upEyePosition+min(sIntersection,dIntersection)*p);return p;}
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-input.vPositionW);
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(0.0,1.0,0.0);
#endif
var shadow: f32=1.;var globalShadow: f32=0.;var shadowLightCount: f32=0.;var aggShadow: f32=0.;var numLights: f32=0.;
#include<lightFragment>[0..maxSimultaneousLights]
#ifdef SHADOWINUSE
globalShadow/=shadowLightCount;
#else
globalShadow=1.0;
#endif
#ifndef BACKMAT_SHADOWONLY
var reflectionColor: vec4f= vec4f(1.,1.,1.,1.);
#ifdef REFLECTION
#ifdef PROJECTED_GROUND
var reflectionVector: vec3f=project(viewDirectionW,scene.vEyePosition.xyz);reflectionVector= (uniforms.reflectionMatrix*vec4f(reflectionVector,1.)).xyz;
#else
var reflectionVector: vec3f=computeReflectionCoords( vec4f(fragmentInputs.vPositionW,1.0),normalW);
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=reflectionVector;
#else
var reflectionCoords: vec2f=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0-reflectionCoords.y;
#endif
#ifdef REFLECTIONBLUR
var reflectionLOD: f32=uniforms.vReflectionInfos.y;
#ifdef TEXTURELODSUPPORT
reflectionLOD=reflectionLOD*log2(uniforms.vReflectionMicrosurfaceInfos.x)*uniforms.vReflectionMicrosurfaceInfos.y+uniforms.vReflectionMicrosurfaceInfos.z;reflectionColor=textureSampleLevel(reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionLOD);
#else
var lodReflectionNormalized: f32=saturate(reflectionLOD);var lodReflectionNormalizedDoubled: f32=lodReflectionNormalized*2.0;var reflectionSpecularMid: vec4f=textureSample(reflectionSampler,reflectionSamplerSampler,reflectionCoords);if(lodReflectionNormalizedDoubled<1.0){reflectionColor=mix(
textureSample(reflectionrHighSampler,reflectionrHighSamplerSampler,reflectionCoords),
reflectionSpecularMid,
lodReflectionNormalizedDoubled
);} else {reflectionColor=mix(
reflectionSpecularMid,
textureSample(reflectionLowSampler,reflectionLowSamplerSampler,reflectionCoords),
lodReflectionNormalizedDoubled-1.0
);}
#endif
#else
var reflectionSample: vec4f=textureSample(reflectionSampler,reflectionSamplerSampler,reflectionCoords);reflectionColor=reflectionSample;
#endif
#ifdef RGBDREFLECTION
reflectionColor=vec4f(fromRGBD(reflectionColor).rgb,reflectionColor.a);
#endif
#ifdef GAMMAREFLECTION
reflectionColor=vec4f(toLinearSpaceVec3(reflectionColor.rgb),reflectionColor.a);
#endif
#ifdef REFLECTIONBGR
reflectionColor=vec4f(reflectionColor.bgr,reflectionColor.a);
#endif
reflectionColor=vec4f(reflectionColor.rgb*uniforms.vReflectionInfos.x,reflectionColor.a);
#endif
var diffuseColor: vec3f= vec3f(1.,1.,1.);var finalAlpha: f32=uniforms.alpha;
#ifdef DIFFUSE
var diffuseMap: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,input.vDiffuseUV);
#ifdef GAMMADIFFUSE
diffuseMap=vec4f(toLinearSpaceVec3(diffuseMap.rgb),diffuseMap.a);
#endif
diffuseMap=vec4f(diffuseMap.rgb *uniforms.vDiffuseInfos.y,diffuseMap.a);
#ifdef DIFFUSEHASALPHA
finalAlpha*=diffuseMap.a;
#endif
diffuseColor=diffuseMap.rgb;
#endif
#ifdef REFLECTIONFRESNEL
var colorBase: vec3f=diffuseColor;
#else
var colorBase: vec3f=reflectionColor.rgb*diffuseColor;
#endif
colorBase=max(colorBase,vec3f(0.0));
#ifdef USERGBCOLOR
var finalColor: vec3f=colorBase;
#else
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
var mainColor: vec3f=mix(uniforms.vPrimaryColorShadow.rgb,uniforms.vPrimaryColor.rgb,colorBase);
#else
var mainColor: vec3f=uniforms.vPrimaryColor.rgb;
#endif
var finalColor: vec3f=colorBase*mainColor;
#endif
#ifdef REFLECTIONFRESNEL
var reflectionAmount: vec3f=uniforms.vReflectionControl.xxx;var reflectionReflectance0: vec3f=uniforms.vReflectionControl.yyy;var reflectionReflectance90: vec3f=uniforms.vReflectionControl.zzz;var VdotN: f32=dot(normalize(scene.vEyePosition.xyz),normalW);var planarReflectionFresnel: vec3f=fresnelSchlickEnvironmentGGX(saturate(VdotN),reflectionReflectance0,reflectionReflectance90,1.0);reflectionAmount*=planarReflectionFresnel;
#ifdef REFLECTIONFALLOFF
var reflectionDistanceFalloff: f32=1.0-saturate(length(vPositionW.xyz-uniforms.vBackgroundCenter)*uniforms.vReflectionControl.w);reflectionDistanceFalloff*=reflectionDistanceFalloff;reflectionAmount*=reflectionDistanceFalloff;
#endif
finalColor=mix(finalColor,reflectionColor.rgb,saturateVec3(reflectionAmount));
#endif
#ifdef OPACITYFRESNEL
var viewAngleToFloor: f32=dot(normalW,normalize(scene.vEyePosition.xyz-uniforms.vBackgroundCenter));const startAngle: f32=0.1;var fadeFactor: f32=saturate(viewAngleToFloor/startAngle);finalAlpha*=fadeFactor*fadeFactor;
#endif
#ifdef SHADOWINUSE
finalColor=mix(finalColor*uniforms.shadowLevel,finalColor,globalShadow);
#endif
var color: vec4f= vec4f(finalColor,finalAlpha);
#else
var color: vec4f= vec4f(uniforms.vPrimaryColor.rgb,(1.0-clamp(globalShadow,0.,1.))*uniforms.alpha);
#endif
#include<logDepthFragment>
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
#if !defined(SKIPFINALCOLORCLAMP)
color=vec4f(clamp(color.rgb,vec3f(0.),vec3f(30.0)),color.a);
#endif
#else
color=applyImageProcessing(color);
#endif
#ifdef PREMULTIPLYALPHA
color=vec4f(color.rgb *color.a,color.a);
#endif
#ifdef NOISE
color=vec4f(color.rgb+dither(fragmentInputs.vPositionW.xy,0.5),color.a);color=max(color,vec4f(0.0));
#endif
fragmentOutputs.color=color;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[e]||(b.ShaderStore.ShadersStoreWGSL[e]=f),a.s(["backgroundPixelShaderWGSL",0,{name:e,shader:f}],369786)},186867,75536,a=>{"use strict";var b=a.i(392511);function c(a){let b=0;return{id_length:a[b++],colormap_type:a[b++],image_type:a[b++],colormap_index:a[b++]|a[b++]<<8,colormap_length:a[b++]|a[b++]<<8,colormap_size:a[b++],origin:[a[b++]|a[b++]<<8,a[b++]|a[b++]<<8],width:a[b++]|a[b++]<<8,height:a[b++]|a[b++]<<8,pixel_size:a[b++],flags:a[b++]}}function d(a,d){let f,g,h,i,j,k,l,m;if(d.length<19)return void b.Logger.Error("Unable to load TGA file - Not enough data to contain header");let n=18,o=c(d);if(o.id_length+n>d.length)return void b.Logger.Error("Unable to load TGA file - Not enough data");n+=o.id_length;let p=!1,q=!1,r=!1;switch(o.image_type){case 9:p=!0;case 1:q=!0;break;case 10:p=!0;case 2:break;case 11:p=!0;case 3:r=!0}let s=o.pixel_size>>3,t=o.width*o.height*s;if(q&&(g=d.subarray(n,n+=o.colormap_length*(o.colormap_size>>3))),p){let a,b,c;f=new Uint8Array(t);let e=0,g=new Uint8Array(s);for(;n<t&&e<t;)if(b=(127&(a=d[n++]))+1,128&a){for(c=0;c<s;++c)g[c]=d[n++];for(c=0;c<b;++c)f.set(g,e+c*s);e+=s*b}else{for(b*=s,c=0;c<b;++c)f[e+c]=d[n++];e+=b}}else f=d.subarray(n,n+=q?o.width*o.height:t);switch((48&o.flags)>>4){default:case 2:h=0,j=1,m=o.width,i=0,k=1,l=o.height;break;case 0:h=0,j=1,m=o.width,i=o.height-1,k=-1,l=-1;break;case 3:h=o.width-1,j=-1,m=-1,i=0,k=1,l=o.height;break;case 1:h=o.width-1,j=-1,m=-1,i=o.height-1,k=-1,l=-1}let u=e["_getImageData"+(r?"Grey":"")+o.pixel_size+"bits"](o,g,f,i,k,l,h,j,m);a.getEngine()._uploadDataToTextureDirectly(a,u)}let e={GetTGAHeader:c,UploadContent:d,_getImageData8bits:function(a,b,c,d,e,f,g,h,i){let j=a.width,k=a.height,l,m=0,n,o,p=new Uint8Array(j*k*4);for(o=d;o!==f;o+=e)for(n=g;n!==i;n+=h,m++)l=c[m],p[(n+j*o)*4+3]=255,p[(n+j*o)*4+2]=b[3*l+0],p[(n+j*o)*4+1]=b[3*l+1],p[(n+j*o)*4+0]=b[3*l+2];return p},_getImageData16bits:function(a,b,c,d,e,f,g,h,i){let j=a.width,k=a.height,l,m=0,n,o,p=new Uint8Array(j*k*4);for(o=d;o!==f;o+=e)for(n=g;n!==i;n+=h,m+=2){let a=((31744&(l=c[m+0]+(c[m+1]<<8)))>>10)*255/31|0,b=((992&l)>>5)*255/31|0,d=(31&l)*255/31|0;p[(n+j*o)*4+0]=a,p[(n+j*o)*4+1]=b,p[(n+j*o)*4+2]=d,p[(n+j*o)*4+3]=32768&l?0:255}return p},_getImageData24bits:function(a,b,c,d,e,f,g,h,i){let j=a.width,k=a.height,l=0,m,n,o=new Uint8Array(j*k*4);for(n=d;n!==f;n+=e)for(m=g;m!==i;m+=h,l+=3)o[(m+j*n)*4+3]=255,o[(m+j*n)*4+2]=c[l+0],o[(m+j*n)*4+1]=c[l+1],o[(m+j*n)*4+0]=c[l+2];return o},_getImageData32bits:function(a,b,c,d,e,f,g,h,i){let j=a.width,k=a.height,l=0,m,n,o=new Uint8Array(j*k*4);for(n=d;n!==f;n+=e)for(m=g;m!==i;m+=h,l+=4)o[(m+j*n)*4+2]=c[l+0],o[(m+j*n)*4+1]=c[l+1],o[(m+j*n)*4+0]=c[l+2],o[(m+j*n)*4+3]=c[l+3];return o},_getImageDataGrey8bits:function(a,b,c,d,e,f,g,h,i){let j=a.width,k=a.height,l,m=0,n,o,p=new Uint8Array(j*k*4);for(o=d;o!==f;o+=e)for(n=g;n!==i;n+=h,m++)l=c[m],p[(n+j*o)*4+0]=l,p[(n+j*o)*4+1]=l,p[(n+j*o)*4+2]=l,p[(n+j*o)*4+3]=255;return p},_getImageDataGrey16bits:function(a,b,c,d,e,f,g,h,i){let j=a.width,k=a.height,l=0,m,n,o=new Uint8Array(j*k*4);for(n=d;n!==f;n+=e)for(m=g;m!==i;m+=h,l+=2)o[(m+j*n)*4+0]=c[l+0],o[(m+j*n)*4+1]=c[l+0],o[(m+j*n)*4+2]=c[l+0],o[(m+j*n)*4+3]=c[l+1];return o}};a.s(["GetTGAHeader",()=>c,"UploadContent",()=>d],75536);class f{constructor(){this.supportCascades=!1}loadCubeData(){throw".env not supported in Cube."}loadData(a,b,e){let f=new Uint8Array(a.buffer,a.byteOffset,a.byteLength),g=c(f);e(g.width,g.height,b.generateMipMaps,!1,()=>{d(b,f)})}}a.s(["_TGATextureLoader",()=>f],186867)},523686,a=>{"use strict";var b=a.i(227574);class c{constructor(){this._easingMode=c.EASINGMODE_EASEIN}setEasingMode(a){let b=Math.min(Math.max(a,0),2);this._easingMode=b}getEasingMode(){return this._easingMode}easeInCore(a){throw Error("You must implement this method")}ease(a){switch(this._easingMode){case c.EASINGMODE_EASEIN:return this.easeInCore(a);case c.EASINGMODE_EASEOUT:return 1-this.easeInCore(1-a)}return a>=.5?(1-this.easeInCore((1-a)*2))*.5+.5:.5*this.easeInCore(2*a)}}c.EASINGMODE_EASEIN=0,c.EASINGMODE_EASEOUT=1,c.EASINGMODE_EASEINOUT=2;class d extends c{easeInCore(a){return 1-Math.sqrt(1-(a=Math.max(0,Math.min(1,a)))*a)}}class e extends c{constructor(a=1){super(),this.amplitude=a}easeInCore(a){return Math.pow(a,3)-a*Math.max(0,this.amplitude)*Math.sin(3.141592653589793*a)}}class f extends c{constructor(a=3,b=2){super(),this.bounces=a,this.bounciness=b}easeInCore(a){let b=Math.max(0,this.bounces),c=this.bounciness;c<=1&&(c=1.001);let d=Math.pow(c,b),e=1-c,f=(1-d)/e+.5*d,g=Math.floor(Math.log(-(a*f)*(1-c)+1)/Math.log(c)),h=(1-Math.pow(c,g))/(e*f),i=(h+(1-Math.pow(c,g+1))/(e*f))*.5,j=a-i,k=i-h;return-Math.pow(1/c,b-g)/(k*k)*(j-k)*(j+k)}}class g extends c{easeInCore(a){return a*a*a}}class h extends c{constructor(a=3,b=3){super(),this.oscillations=a,this.springiness=b}easeInCore(a){let b=Math.max(0,this.oscillations),c=Math.max(0,this.springiness);return(0==c?a:(Math.exp(c*a)-1)/(Math.exp(c)-1))*Math.sin((6.283185307179586*b+1.5707963267948966)*a)}}class i extends c{constructor(a=2){super(),this.exponent=a}easeInCore(a){return this.exponent<=0?a:(Math.exp(this.exponent*a)-1)/(Math.exp(this.exponent)-1)}}class j extends c{easeInCore(a){return a*a}}class k extends c{easeInCore(a){return a*a*a*a}}class l extends c{easeInCore(a){return a*a*a*a*a}}class m extends c{easeInCore(a){return 1-Math.sin(1.5707963267948966*(1-a))}}class n extends c{constructor(a=0,b=0,c=1,d=1){super(),this.x1=a,this.y1=b,this.x2=c,this.y2=d}easeInCore(a){return b.BezierCurve.Interpolate(a,this.x1,this.y1,this.x2,this.y2)}}a.s(["BackEase",()=>e,"BezierCurveEase",()=>n,"BounceEase",()=>f,"CircleEase",()=>d,"CubicEase",()=>g,"EasingFunction",()=>c,"ElasticEase",()=>h,"ExponentialEase",()=>i,"QuadraticEase",()=>j,"QuarticEase",()=>k,"QuinticEase",()=>l,"SineEase",()=>m])},882097,a=>{"use strict";var b=a.i(523686),c=a.i(503102),d=a.i(779438),e=a.i(994060);class f extends c.FlowGraphBlock{constructor(a){super(a),this.config=a,this._easingFunctions={},this.mode=this.registerDataInput("mode",d.RichTypeNumber,0),this.controlPoint1=this.registerDataInput("controlPoint1",d.RichTypeVector2),this.controlPoint2=this.registerDataInput("controlPoint2",d.RichTypeVector2),this.easingFunction=this.registerDataOutput("easingFunction",d.RichTypeAny)}_updateOutputs(a){let c=this.mode.getValue(a),d=this.controlPoint1.getValue(a),e=this.controlPoint2.getValue(a);if(void 0===c)return;let f=`${c}-${d.x}-${d.y}-${e.x}-${e.y}`;if(!this._easingFunctions[f]){let a=new b.BezierCurveEase(d.x,d.y,e.x,e.y);a.setEasingMode(c),this._easingFunctions[f]=a}this.easingFunction.setValue(this._easingFunctions[f],a)}getClassName(){return"FlowGraphBezierCurveEasing"}}(0,e.RegisterClass)("FlowGraphBezierCurveEasing",f),a.s(["FlowGraphBezierCurveEasingBlock",()=>f])},71374,a=>{"use strict";var b=a.i(625562);let c="iblShadowVoxelTracingPixelShader",d=`precision highp sampler2D;precision highp sampler3D;
#define PI 3.1415927
varying vec2 vUV;
#define DISABLE_UNIFORMITY_ANALYSIS
uniform sampler2D depthSampler;uniform sampler2D worldNormalSampler;uniform sampler2D blueNoiseSampler;uniform sampler2D icdfSampler;uniform sampler3D voxelGridSampler;
#ifdef COLOR_SHADOWS
uniform samplerCube iblSampler;
#endif
uniform vec4 shadowParameters;
#define SHADOWdirs shadowParameters.x
#define SHADOWframe shadowParameters.y
#define SHADOWenvRot shadowParameters.w
uniform vec4 voxelBiasParameters;
#define highestMipLevel voxelBiasParameters.z
uniform vec4 sssParameters;
#define SSSsamples sssParameters.x
#define SSSstride sssParameters.y
#define SSSmaxDistance sssParameters.z
#define SSSthickness sssParameters.w
uniform vec4 shadowOpacity;uniform mat4 projMtx;uniform mat4 viewMtx;uniform mat4 invProjMtx;uniform mat4 invViewMtx;uniform mat4 wsNormalizationMtx;uniform mat4 invVPMtx;
#define PI 3.1415927
#define GOLD 0.618034
struct AABB3f {vec3 m_min;vec3 m_max;};struct Ray {vec3 orig;vec3 dir;vec3 dir_rcp;float t_min;float t_max;};Ray make_ray(const vec3 origin,const vec3 direction,const float tmin,
const float tmax) {Ray ray;ray.orig=origin;ray.dir=direction;ray.dir_rcp=1.0f/direction;ray.t_min=tmin;ray.t_max=tmax;return ray;}
bool ray_box_intersection(const in AABB3f aabb,const in Ray ray,
out float distance_near,out float distance_far) {vec3 tbot=ray.dir_rcp*(aabb.m_min-ray.orig);vec3 ttop=ray.dir_rcp*(aabb.m_max-ray.orig);vec3 tmin=min(ttop,tbot);vec3 tmax=max(ttop,tbot);distance_near=max(ray.t_min,max(tmin.x,max(tmin.y,tmin.z)));distance_far=min(ray.t_max,min(tmax.x,min(tmax.y,tmax.z)));return distance_near<=distance_far;}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
struct VoxelMarchDiagnosticInfo {float heat;ivec3 voxel_intersect_coords;};
#endif
uint hash(uint i) {i ^= i>>16u;i*=0x7FEB352Du;i ^= i>>15u;i*=0x846CA68Bu;i ^= i>>16u;return i;}
float uint2float(uint i) {return uintBitsToFloat(0x3F800000u | (i>>9u))-1.0;}
vec3 uv_to_normal(vec2 uv) {vec3 N;vec2 uvRange=uv;float theta=uvRange.x*2.0*PI;float phi=uvRange.y*PI;N.x=cos(theta)*sin(phi);N.z=sin(theta)*sin(phi);N.y=cos(phi);return N;}
vec2 plasticSequence(const uint rstate) {return vec2(uint2float(rstate*3242174889u),
uint2float(rstate*2447445414u));}
float goldenSequence(const uint rstate) {return uint2float(rstate*2654435769u);}
float distanceSquared(vec2 a,vec2 b) {vec2 diff=a-b;return dot(diff,diff);}
void genTB(const vec3 N,out vec3 T,out vec3 B) {float s=N.z<0.0 ? -1.0 : 1.0;float a=-1.0/(s+N.z);float b=N.x*N.y*a;T=vec3(1.0+s*N.x*N.x*a,s*b,-s*N.x);B=vec3(b,s+N.y*N.y*a,-N.y);}
int stack[24]; 
#define PUSH(i) stack[stackLevel++]=i; 
#define POP() stack[--stackLevel] 
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
bool anyHitVoxels(const Ray ray_vs,
out VoxelMarchDiagnosticInfo voxel_march_diagnostic_info) {
#else
bool anyHitVoxels(const Ray ray_vs) {
#endif
vec3 invD=ray_vs.dir_rcp;vec3 D=ray_vs.dir;vec3 O=ray_vs.orig;ivec3 negD=ivec3(lessThan(D,vec3(0,0,0)));int voxel0=negD.x | negD.y<<1 | negD.z<<2;vec3 t0=-O*invD,t1=(vec3(1.0)-O)*invD;int maxLod=int(highestMipLevel);int stackLevel=0;
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
uint steps=0u;
#endif
PUSH(maxLod<<24);while (stackLevel>0) {int elem=POP();ivec4 Coords =
ivec4(elem & 0xFF,elem>>8 & 0xFF,elem>>16 & 0xFF,elem>>24);if (Coords.w==0) {
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
voxel_march_diagnostic_info.heat=float(steps)/24.0;
#endif
return true;}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
++steps;
#endif
float invRes=exp2(float(Coords.w-maxLod));vec3 bbmin=invRes*vec3(Coords.xyz+negD);vec3 bbmax=invRes*vec3(Coords.xyz-negD+ivec3(1));vec3 mint=mix(t0,t1,bbmin);vec3 maxt=mix(t0,t1,bbmax);vec3 midt=0.5*(mint+maxt);mint.x=max(0.0,mint.x);midt.x=max(0.0,midt.x);int nodeMask=int(
round(texelFetch(voxelGridSampler,Coords.xyz,Coords.w).x*255.0));Coords.w--;int voxelBit=voxel0;Coords.xyz=(Coords.xyz<<1)+negD;int packedCoords =
Coords.x | Coords.y<<8 | Coords.z<<16 | Coords.w<<24;if (max(mint.x,max(mint.y,mint.z))<min(midt.x,min(midt.y,midt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(midt.x,max(mint.y,mint.z))<min(maxt.x,min(midt.y,midt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);voxelBit ^= 0x2;packedCoords ^= 0x00100;if (max(midt.x,max(midt.y,mint.z))<min(maxt.x,min(maxt.y,midt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(mint.x,max(midt.y,mint.z))<min(midt.x,min(maxt.y,midt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);voxelBit ^= 0x4;packedCoords ^= 0x10000;if (max(mint.x,max(midt.y,midt.z))<min(midt.x,min(maxt.y,maxt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(midt.x,max(midt.y,midt.z))<min(maxt.x,min(maxt.y,maxt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);voxelBit ^= 0x2;packedCoords ^= 0x00100;if (max(midt.x,max(mint.y,midt.z))<min(maxt.x,min(midt.y,maxt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(mint.x,max(mint.y,midt.z))<min(midt.x,min(midt.y,maxt.z)) &&
(1<<voxelBit & nodeMask) != 0)
PUSH(packedCoords);}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
voxel_march_diagnostic_info.heat=float(steps)/24.0;
#endif
return false;}
float linearizeDepth(float depth,float near,float far) {return (near*far)/(far-depth*(far-near));}
float screenSpaceShadow(vec3 csOrigin,vec3 csDirection,vec2 csZBufferSize,
float nearPlaneZ,float farPlaneZ,float noise) {
#ifdef RIGHT_HANDED
float csZDir=-1.0;
#else 
float csZDir=1.0;
#endif
float ssSamples=SSSsamples;float ssMaxDist=SSSmaxDistance;float ssStride=SSSstride;float ssThickness=SSSthickness;float rayLength =
csZDir*(csOrigin.z+ssMaxDist*csDirection.z)<csZDir*nearPlaneZ
? 
(nearPlaneZ-csOrigin.z)/csDirection.z
: ssMaxDist;vec3 csEndPoint=csOrigin+rayLength*csDirection;vec4 H0=projMtx*vec4(csOrigin,1.0);vec4 H1=projMtx*vec4(csEndPoint,1.0);vec2 Z0=vec2(csOrigin.z ,1.0)/H0.w;vec2 Z1=vec2(csEndPoint.z,1.0)/H1.w;vec2 P0=csZBufferSize*(0.5*H0.xy*Z0.y+0.5);vec2 P1=csZBufferSize*(0.5*H1.xy*Z1.y+0.5);P1+=vec2(distanceSquared(P0,P1)<0.0001 ? 0.01 : 0.0);vec2 delta=P1-P0;bool permute=false;if (abs(delta.x)<abs(delta.y)) {permute=true;P0=P0.yx;P1=P1.yx;delta=delta.yx;}
float stepDirection=sign(delta.x);float invdx=stepDirection/delta.x;vec2 dP=ssStride*vec2(stepDirection,invdx*delta.y);vec2 dZ=ssStride*invdx*(Z1-Z0);float opacity=0.0;vec2 P=P0+noise*dP;vec2 Z=Z0+noise*dZ;float end=P1.x*stepDirection;float rayZMax=csZDir*Z.x/Z.y;float sceneDepth=rayZMax;Z+=dZ;for (float stepCount=0.0;opacity<1.0 && P.x*stepDirection<end && sceneDepth>0.0 && stepCount<ssSamples;stepCount++,P+=dP,
Z+=dZ) { 
ivec2 coords=ivec2(permute ? P.yx : P);sceneDepth=texelFetch(depthSampler,coords,0).x;sceneDepth=linearizeDepth(sceneDepth,nearPlaneZ,farPlaneZ);sceneDepth=csZDir*sceneDepth;if (sceneDepth<=0.0) {break;}
float rayZMin=rayZMax;rayZMax=csZDir*Z.x/Z.y;opacity+=max(opacity,step(rayZMax,sceneDepth+ssThickness)*step(sceneDepth,rayZMin));}
return opacity;}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
float voxelShadow(vec3 wsOrigin,vec3 wsDirection,vec3 wsNormal,
vec2 DitherNoise,
out VoxelMarchDiagnosticInfo voxel_march_diagnostic_info) {
#else
float voxelShadow(vec3 wsOrigin,vec3 wsDirection,vec3 wsNormal,
vec2 DitherNoise) {
#endif
float vxResolution=float(textureSize(voxelGridSampler,0).x);vec3 T,B;genTB(wsDirection,T,B);vec2 DitherXY=sqrt(DitherNoise.x)*vec2(cos(2.0*PI*DitherNoise.y),
sin(2.0*PI*DitherNoise.y));float sceneScale=wsNormalizationMtx[0][0];vec3 Dithering =
(voxelBiasParameters.x*wsNormal+voxelBiasParameters.y*wsDirection +
DitherXY.x*T+DitherXY.y*B) /
vxResolution;vec3 O=0.5*wsOrigin+0.5+Dithering;Ray ray_vs=make_ray(O,wsDirection,0.0,10.0);AABB3f voxel_aabb;voxel_aabb.m_min=vec3(0);voxel_aabb.m_max=vec3(1);float near,far;if (!ray_box_intersection(voxel_aabb,ray_vs,near,far))
return 0.0;ray_vs.t_min=max(ray_vs.t_min,near);ray_vs.t_max=min(ray_vs.t_max,far);
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
return anyHitVoxels(ray_vs,voxel_march_diagnostic_info) ? 1.0f : 0.0f;
#else
return anyHitVoxels(ray_vs) ? 1.0f : 0.0f;
#endif
}
void main(void) {uint nbDirs=uint(SHADOWdirs);uint frameId=uint(SHADOWframe);float envRot=SHADOWenvRot;vec2 Resolution=vec2(textureSize(depthSampler,0));ivec2 currentPixel=ivec2(vUV*Resolution);uint GlobalIndex=(frameId*uint(Resolution.y)+uint(currentPixel.y)) *
uint(Resolution.x) +
uint(currentPixel.x);vec3 N=texelFetch(worldNormalSampler,currentPixel,0).xyz;if (length(N)<0.01) {glFragColor=vec4(1.0,1.0,0.0,1.0);return;}
float normalizedRotation=envRot/(2.0*PI);float depth=texelFetch(depthSampler,currentPixel,0).x;
#ifndef IS_NDC_HALF_ZRANGE
depth=depth*2.0-1.0;
#endif
vec2 temp=(vec2(currentPixel)+vec2(0.5))*2.0/Resolution-vec2(1.0);vec4 VP=invProjMtx*vec4(temp.x,-temp.y,depth,1.0);VP/=VP.w;N=normalize(N);vec3 noise=texelFetch(blueNoiseSampler,currentPixel & 0xFF,0).xyz;noise.z=fract(noise.z+goldenSequence(frameId*nbDirs));
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
float heat=0.0f;
#endif
float shadowAccum=0.001;float specShadowAccum=0.001;float sampleWeight=0.001;
#ifdef COLOR_SHADOWS
vec3 totalLight=vec3(0.001);vec3 shadowedLight=vec3(0.0);
#endif
for (uint i=0u; i<nbDirs; i++) {uint dirId=nbDirs*GlobalIndex+i;vec4 L;vec2 T;{vec2 r=plasticSequence(frameId*nbDirs+i);r=fract(r+vec2(2.0)*abs(noise.xy-vec2(0.5)));T.x=textureLod(icdfSampler,vec2(r.x,0.0),0.0).x;T.y=textureLod(icdfSampler,vec2(T.x,r.y),0.0).y;L=vec4(uv_to_normal(vec2(T.x-normalizedRotation,T.y)),0);
#ifndef RIGHT_HANDED
L.z*=-1.0;
#endif
}
#ifdef COLOR_SHADOWS
vec3 lightDir=uv_to_normal(vec2(1.0-fract(T.x+0.25),T.y));vec3 ibl=textureLod(iblSampler,lightDir,0.0).xyz;float pdf=textureLod(icdfSampler,T,0.0).z;
#endif
float cosNL=dot(N,L.xyz);float opacity=0.0;if (cosNL>0.0) {vec4 VP2=VP;VP2.y*=-1.0;vec4 unormWP=invViewMtx*VP2;vec3 WP=(wsNormalizationMtx*unormWP).xyz;vec2 vxNoise=vec2(uint2float(hash(dirId*2u)),uint2float(hash(dirId*2u+1u)));
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
VoxelMarchDiagnosticInfo voxel_march_diagnostic_info;opacity=max(opacity,shadowOpacity.x*voxelShadow(WP,L.xyz,N,vxNoise,voxel_march_diagnostic_info));heat+=voxel_march_diagnostic_info.heat;
#else
opacity =
max(opacity,shadowOpacity.x*voxelShadow(WP,L.xyz,N,vxNoise));
#endif
vec3 VL=(viewMtx*L).xyz;
#ifdef RIGHT_HANDED
float nearPlaneZ=-projMtx[3][2]/(projMtx[2][2]-1.0); 
float farPlaneZ=-projMtx[3][2]/(projMtx[2][2]+1.0);
#else
float nearPlaneZ=-projMtx[3][2]/(projMtx[2][2]+1.0); 
float farPlaneZ=-projMtx[3][2]/(projMtx[2][2]-1.0);
#endif
float ssShadow=shadowOpacity.y *
screenSpaceShadow(VP2.xyz,VL,Resolution,nearPlaneZ,farPlaneZ,
abs(2.0*noise.z-1.0));opacity=max(opacity,ssShadow);
#ifdef COLOR_SHADOWS
vec3 light=pdf<1e-6 ? vec3(0.0) : vec3(cosNL)/vec3(pdf)*ibl;shadowedLight+=light*opacity;totalLight+=light;
#else
float rcos=(1.0-cosNL);shadowAccum+=(1.0-opacity*(1.0-pow(rcos,8.0)));sampleWeight+=1.0;vec3 VR=-(viewMtx*vec4(reflect(-L.xyz,N),0.0)).xyz;specShadowAccum+=max(1.0-(opacity*pow(VR.z,8.0)),0.0);
#endif
}
noise.z=fract(noise.z+GOLD);}
#ifdef COLOR_SHADOWS
vec3 shadow=(totalLight-shadowedLight)/totalLight;float maxShadow=max(max(shadow.x,max(shadow.y,shadow.z)),1.0);glFragColor=vec4(shadow/maxShadow,1.0);
#else
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
gl_FragColor=vec4(shadowAccum/float(sampleWeight),
specShadowAccum/float(sampleWeight),heat/float(sampleWeight),1.0);
#else
gl_FragColor=vec4(shadowAccum/float(sampleWeight),specShadowAccum/float(sampleWeight),0.0,1.0);
#endif
#endif
}`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["iblShadowVoxelTracingPixelShader",0,{name:c,shader:d}])},669963,a=>{"use strict";var b=a.i(625562);a.i(463068),a.i(51308),a.i(500507);let c="screenSpaceReflection2PixelShader",d=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;varying vUV: vec2f;
#ifdef SSR_SUPPORTED
var reflectivitySamplerSampler: sampler;var reflectivitySampler: texture_2d<f32>;var normalSampler: texture_2d<f32>;var depthSampler: texture_2d<f32>;
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
var backDepthSampler: texture_2d<f32>;uniform backSizeFactor: f32;
#endif
#ifdef SSR_USE_ENVIRONMENT_CUBE
var envCubeSamplerSampler: sampler;var envCubeSampler: texture_cube<f32>;
#ifdef SSR_USE_LOCAL_REFLECTIONMAP_CUBIC
uniform vReflectionPosition: vec3f;uniform vReflectionSize: vec3f;
#endif
#endif
uniform view: mat4x4f;uniform invView: mat4x4f;uniform projection: mat4x4f;uniform invProjectionMatrix: mat4x4f;uniform projectionPixel: mat4x4f;uniform nearPlaneZ: f32;uniform farPlaneZ: f32;uniform stepSize: f32;uniform maxSteps: f32;uniform strength: f32;uniform thickness: f32;uniform roughnessFactor: f32;uniform reflectionSpecularFalloffExponent: f32;uniform maxDistance: f32;uniform selfCollisionNumSkip: f32;uniform reflectivityThreshold: f32;
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<screenSpaceRayTrace>
fn hash(a: vec3f)->vec3f
{var result=fract(a*0.8);result+=dot(result,result.yxz+19.19);return fract((result.xxy+result.yxx)*result.zyx);}
fn computeAttenuationForIntersection(ihitPixel: vec2f,hitUV: vec2f,vsRayOrigin: vec3f,vsHitPoint: vec3f,reflectionVector: vec3f,maxRayDistance: f32,numIterations: f32)->f32 {var attenuation: f32=1.0;
#ifdef SSR_ATTENUATE_SCREEN_BORDERS
var dCoords: vec2f=smoothstep(vec2f(0.2),vec2f(0.6),abs( vec2f(0.5,0.5)-hitUV.xy));attenuation*=clamp(1.0-(dCoords.x+dCoords.y),0.0,1.0);
#endif
#ifdef SSR_ATTENUATE_INTERSECTION_DISTANCE
attenuation*=1.0-clamp(distance(vsRayOrigin,vsHitPoint)/maxRayDistance,0.0,1.0);
#endif
#ifdef SSR_ATTENUATE_INTERSECTION_NUMITERATIONS
attenuation*=1.0-(numIterations/uniforms.maxSteps);
#endif
#ifdef SSR_ATTENUATE_BACKFACE_REFLECTION
var reflectionNormal: vec3f=texelFetch(normalSampler,hitPixel,0).xyz;var directionBasedAttenuation: f32=smoothstep(-0.17,0.0,dot(reflectionNormal,-reflectionVector));attenuation*=directionBasedAttenuation;
#endif
return attenuation;}
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#ifdef SSR_SUPPORTED
var colorFull: vec4f=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0);var color: vec3f=colorFull.rgb;var reflectivity: vec4f=max(textureSampleLevel(reflectivitySampler,reflectivitySamplerSampler,input.vUV,0.0),vec4f(0.0));
#ifndef SSR_DISABLE_REFLECTIVITY_TEST
if (max(reflectivity.r,max(reflectivity.g,reflectivity.b))<=uniforms.reflectivityThreshold) {
#ifdef SSR_USE_BLUR
fragmentOutputs.color= vec4f(0.);
#else
fragmentOutputs.color=colorFull;
#endif
return fragmentOutputs;}
#endif
#ifdef SSR_INPUT_IS_GAMMA_SPACE
color=toLinearSpaceVec3(color);
#endif
var texSize: vec2f= vec2f(textureDimensions(depthSampler,0));var csNormal: vec3f=textureLoad(normalSampler,vec2<i32>(input.vUV*texSize),0).xyz; 
#ifdef SSR_DECODE_NORMAL
csNormal=csNormal*2.0-1.0;
#endif
#ifdef SSR_NORMAL_IS_IN_WORLDSPACE
csNormal=(uniforms.view* vec4f(csNormal,0.0)).xyz;
#endif
var depth: f32=textureLoad(depthSampler,vec2<i32>(input.vUV*texSize),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
depth=linearizeDepth(depth,uniforms.nearPlaneZ,uniforms.farPlaneZ);
#endif
var csPosition: vec3f=computeViewPosFromUVDepth(input.vUV,depth,uniforms.projection,uniforms.invProjectionMatrix);
#ifdef ORTHOGRAPHIC_CAMERA
var csViewDirection: vec3f= vec3f(0.,0.,1.);
#else
var csViewDirection: vec3f=normalize(csPosition);
#endif
var csReflectedVector: vec3f=reflect(csViewDirection,csNormal);
#ifdef SSR_USE_ENVIRONMENT_CUBE
var wReflectedVector: vec3f=(uniforms.invView* vec4f(csReflectedVector,0.0)).xyz;
#ifdef SSR_USE_LOCAL_REFLECTIONMAP_CUBIC
var worldPos: vec4f=uniforms.invView* vec4f(csPosition,1.0);wReflectedVector=parallaxCorrectNormal(worldPos.xyz,normalize(wReflectedVector),uniforms.vReflectionSize,uniforms.vReflectionPosition);
#endif
#ifdef SSR_INVERTCUBICMAP
wReflectedVector.y*=-1.0;
#endif
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
wReflectedVector.z*=-1.0;
#endif
var envColor: vec3f=textureSampleLevel(envCubeSampler,envCubeSamplerSampler,wReflectedVector,0.0).xyz;
#ifdef SSR_ENVIRONMENT_CUBE_IS_GAMMASPACE
envColor=toLinearSpaceVec3(envColor);
#endif
#else
var envColor: vec3f=color;
#endif
var reflectionAttenuation: f32=1.0;var rayHasHit: bool=false;var startPixel: vec2f;var hitPixel: vec2f;var hitPoint: vec3f;var numIterations: f32;
#ifdef SSRAYTRACE_DEBUG
var debugColor: vec3f;
#endif
#ifdef SSR_ATTENUATE_FACING_CAMERA
reflectionAttenuation*=1.0-smoothstep(0.25,0.5,dot(-csViewDirection,csReflectedVector));
#endif
if (reflectionAttenuation>0.0) {
#ifdef SSR_USE_BLUR
var jitt: vec3f= vec3f(0.);
#else
var roughness: f32=1.0-reflectivity.a;var jitt: vec3f=mix( vec3f(0.0),hash(csPosition)- vec3f(0.5),roughness)*uniforms.roughnessFactor; 
#endif
var uv2: vec2f=input.vUV*texSize;var c: f32=(uv2.x+uv2.y)*0.25;var jitter: f32=((c)%(1.0)); 
rayHasHit=traceScreenSpaceRay1(
csPosition,
normalize(csReflectedVector+jitt),
uniforms.projectionPixel,
depthSampler,
texSize,
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
backDepthSampler,
uniforms.backSizeFactor,
#endif
uniforms.thickness,
uniforms.nearPlaneZ,
uniforms.farPlaneZ,
uniforms.stepSize,
jitter,
uniforms.maxSteps,
uniforms.maxDistance,
uniforms.selfCollisionNumSkip,
&startPixel,
&hitPixel,
&hitPoint,
&numIterations
#ifdef SSRAYTRACE_DEBUG
,&debugColor
#endif
);}
#ifdef SSRAYTRACE_DEBUG
fragmentOutputs.color= vec4f(debugColor,1.);return fragmentOutputs;
#endif
var F0: vec3f=reflectivity.rgb;var fresnel: vec3f=fresnelSchlickGGXVec3(max(dot(csNormal,-csViewDirection),0.0),F0, vec3f(1.));var SSR: vec3f=envColor;if (rayHasHit) {var reflectedColor: vec3f=textureLoad(textureSampler,vec2<i32>(hitPixel),0).rgb;
#ifdef SSR_INPUT_IS_GAMMA_SPACE
reflectedColor=toLinearSpaceVec3(reflectedColor);
#endif
reflectionAttenuation*=computeAttenuationForIntersection(hitPixel,hitPixel/texSize,csPosition,hitPoint,csReflectedVector,uniforms.maxDistance,numIterations);SSR=reflectedColor*reflectionAttenuation+(1.0-reflectionAttenuation)*envColor;}
#ifndef SSR_BLEND_WITH_FRESNEL
SSR*=fresnel;
#endif
#ifdef SSR_USE_BLUR
var blur_radius: f32=0.0;var roughness: f32=1.0-reflectivity.a*(1.0-uniforms.roughnessFactor);if (roughness>0.001) {var cone_angle: f32=min(roughness,0.999)*3.14159265*0.5;var cone_len: f32=distance(startPixel,hitPixel);var op_len: f32=2.0*tan(cone_angle)*cone_len; 
var a: f32=op_len;var h: f32=cone_len;var a2: f32=a*a;var fh2: f32=4.0f*h*h;blur_radius=(a*(sqrt(a2+fh2)-a))/(4.0f*h);}
fragmentOutputs.color= vec4f(SSR,blur_radius/255.0); 
#else
#ifdef SSR_BLEND_WITH_FRESNEL
var reflectionMultiplier: vec3f=clamp(pow(fresnel*uniforms.strength, vec3f(uniforms.reflectionSpecularFalloffExponent)),vec3f(0.0),vec3f(1.0));
#else
var reflectionMultiplier: vec3f=clamp(pow(reflectivity.rgb*uniforms.strength, vec3f(uniforms.reflectionSpecularFalloffExponent)),vec3f(0.0),vec3f(1.0));
#endif
var colorMultiplier: vec3f=1.0-reflectionMultiplier;var finalColor: vec3f=(color*colorMultiplier)+(SSR*reflectionMultiplier);
#ifdef SSR_OUTPUT_IS_GAMMA_SPACE
finalColor=toGammaSpaceVec3(finalColor);
#endif
fragmentOutputs.color= vec4f(finalColor,colorFull.a);
#endif
#else
fragmentOutputs.color=textureSampleLevel(textureSampler,textureSamplerSampler,input.vUV,0.0);
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["screenSpaceReflection2PixelShaderWGSL",0,{name:c,shader:d}])},146877,a=>{"use strict";var b=a.i(625562);let c="backgroundFragmentDeclaration",d=`uniform vec4 vEyePosition;uniform vec4 vPrimaryColor;
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
uniform vec4 vPrimaryColorShadow;
#endif
uniform float shadowLevel;uniform float alpha;
#ifdef DIFFUSE
uniform vec2 vDiffuseInfos;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;
#endif
#if defined(REFLECTIONFRESNEL) || defined(OPACITYFRESNEL)
uniform vec3 vBackgroundCenter;
#endif
#ifdef REFLECTIONFRESNEL
uniform vec4 vReflectionControl;
#endif
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(REFRACTION)
uniform mat4 view;
#endif
#ifdef PROJECTED_GROUND
uniform vec2 projectedGroundInfos;
#endif
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(499168),a.i(964653),a.i(820271),a.i(160721),a.i(10886),a.i(711866),a.i(720414),a.i(754186),a.i(645308),a.i(544248),a.i(681682),a.i(972930);let e="intersectionFunctions",f=`float diskIntersectWithBackFaceCulling(vec3 ro,vec3 rd,vec3 c,float r) {float d=rd.y;if(d>0.0) { return 1e6; }
vec3 o=ro-c;float t=-o.y/d;vec3 q=o+rd*t;return (dot(q,q)<r*r) ? t : 1e6;}
vec2 sphereIntersect(vec3 ro,vec3 rd,vec3 ce,float ra) {vec3 oc=ro-ce;float b=dot(oc,rd);float c=dot(oc,oc)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}
vec2 sphereIntersectFromOrigin(vec3 ro,vec3 rd,float ra) {float b=dot(ro,rd);float c=dot(ro,ro)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}`;b.ShaderStore.IncludesShadersStore[e]||(b.ShaderStore.IncludesShadersStore[e]=f),a.i(874402),a.i(585716),a.i(430783),a.i(384701);let g="backgroundPixelShader",h=`#ifdef TEXTURELODSUPPORT
#extension GL_EXT_shader_texture_lod : enable
#endif
precision highp float;
#include<__decl__backgroundFragment>
#include<helperFunctions>
varying vec3 vPositionW;
#ifdef MAINUV1
varying vec2 vMainUV1;
#endif 
#ifdef MAINUV2 
varying vec2 vMainUV2; 
#endif 
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef DIFFUSE
#if DIFFUSEDIRECTUV==1
#define vDiffuseUV vMainUV1
#elif DIFFUSEDIRECTUV==2
#define vDiffuseUV vMainUV2
#else
varying vec2 vDiffuseUV;
#endif
uniform sampler2D diffuseSampler;
#endif
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
#define sampleReflection(s,c) textureCube(s,c)
uniform samplerCube reflectionSampler;
#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) textureCubeLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;
#endif
#else
#define sampleReflection(s,c) texture2D(s,c)
uniform sampler2D reflectionSampler;
#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) texture2DLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;
#endif
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#endif
#include<reflectionFunction>
#endif
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE;
#endif
#ifndef SHADOWONLY
#define SHADOWONLY;
#endif
#include<imageProcessingDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<imageProcessingFunctions>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#ifdef REFLECTIONFRESNEL
#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
vec3 fresnelSchlickEnvironmentGGX(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness)
{float weight=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);return reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));}
#endif
#ifdef PROJECTED_GROUND
#include<intersectionFunctions>
vec3 project(vec3 viewDirectionW,vec3 eyePosition) {float radius=projectedGroundInfos.x;float height=projectedGroundInfos.y;vec3 camDir=-viewDirectionW;float skySphereDistance=sphereIntersectFromOrigin(eyePosition,camDir,radius).x;vec3 skySpherePositionW=eyePosition+camDir*skySphereDistance;vec3 p=normalize(skySpherePositionW);eyePosition.y-=height;float sIntersection=sphereIntersectFromOrigin(eyePosition,p,radius).x;vec3 h=vec3(0.0,-height,0.0);float dIntersection=diskIntersectWithBackFaceCulling(eyePosition,p,h,radius);p=(eyePosition+min(sIntersection,dIntersection)*p);return p;}
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(0.0,1.0,0.0);
#endif
float shadow=1.;float globalShadow=0.;float shadowLightCount=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0..maxSimultaneousLights]
#ifdef SHADOWINUSE
globalShadow/=shadowLightCount;
#else
globalShadow=1.0;
#endif
#ifndef BACKMAT_SHADOWONLY
vec4 reflectionColor=vec4(1.,1.,1.,1.);
#ifdef REFLECTION
#ifdef PROJECTED_GROUND
vec3 reflectionVector=project(viewDirectionW,vEyePosition.xyz);reflectionVector=vec3(reflectionMatrix*vec4(reflectionVector,1.));
#else
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=reflectionVector;
#else
vec2 reflectionCoords=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0-reflectionCoords.y;
#endif
#ifdef REFLECTIONBLUR
float reflectionLOD=vReflectionInfos.y;
#ifdef TEXTURELODSUPPORT
reflectionLOD=reflectionLOD*log2(vReflectionMicrosurfaceInfos.x)*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;reflectionColor=sampleReflectionLod(reflectionSampler,reflectionCoords,reflectionLOD);
#else
float lodReflectionNormalized=saturate(reflectionLOD);float lodReflectionNormalizedDoubled=lodReflectionNormalized*2.0;vec4 reflectionSpecularMid=sampleReflection(reflectionSampler,reflectionCoords);if(lodReflectionNormalizedDoubled<1.0){reflectionColor=mix(
sampleReflection(reflectionSamplerHigh,reflectionCoords),
reflectionSpecularMid,
lodReflectionNormalizedDoubled
);} else {reflectionColor=mix(
reflectionSpecularMid,
sampleReflection(reflectionSamplerLow,reflectionCoords),
lodReflectionNormalizedDoubled-1.0
);}
#endif
#else
vec4 reflectionSample=sampleReflection(reflectionSampler,reflectionCoords);reflectionColor=reflectionSample;
#endif
#ifdef RGBDREFLECTION
reflectionColor.rgb=fromRGBD(reflectionColor);
#endif
#ifdef GAMMAREFLECTION
reflectionColor.rgb=toLinearSpace(reflectionColor.rgb);
#endif
#ifdef REFLECTIONBGR
reflectionColor.rgb=reflectionColor.bgr;
#endif
reflectionColor.rgb*=vReflectionInfos.x;
#endif
vec3 diffuseColor=vec3(1.,1.,1.);float finalAlpha=alpha;
#ifdef DIFFUSE
vec4 diffuseMap=texture2D(diffuseSampler,vDiffuseUV);
#ifdef GAMMADIFFUSE
diffuseMap.rgb=toLinearSpace(diffuseMap.rgb);
#endif
diffuseMap.rgb*=vDiffuseInfos.y;
#ifdef DIFFUSEHASALPHA
finalAlpha*=diffuseMap.a;
#endif
diffuseColor=diffuseMap.rgb;
#endif
#ifdef REFLECTIONFRESNEL
vec3 colorBase=diffuseColor;
#else
vec3 colorBase=reflectionColor.rgb*diffuseColor;
#endif
colorBase=max(colorBase,0.0);
#ifdef USERGBCOLOR
vec3 finalColor=colorBase;
#else
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
vec3 mainColor=mix(vPrimaryColorShadow.rgb,vPrimaryColor.rgb,colorBase);
#else
vec3 mainColor=vPrimaryColor.rgb;
#endif
vec3 finalColor=colorBase*mainColor;
#endif
#ifdef REFLECTIONFRESNEL
vec3 reflectionAmount=vReflectionControl.xxx;vec3 reflectionReflectance0=vReflectionControl.yyy;vec3 reflectionReflectance90=vReflectionControl.zzz;float VdotN=dot(normalize(vEyePosition.xyz),normalW);vec3 planarReflectionFresnel=fresnelSchlickEnvironmentGGX(saturate(VdotN),reflectionReflectance0,reflectionReflectance90,1.0);reflectionAmount*=planarReflectionFresnel;
#ifdef REFLECTIONFALLOFF
float reflectionDistanceFalloff=1.0-saturate(length(vPositionW.xyz-vBackgroundCenter)*vReflectionControl.w);reflectionDistanceFalloff*=reflectionDistanceFalloff;reflectionAmount*=reflectionDistanceFalloff;
#endif
finalColor=mix(finalColor,reflectionColor.rgb,saturate(reflectionAmount));
#endif
#ifdef OPACITYFRESNEL
float viewAngleToFloor=dot(normalW,normalize(vEyePosition.xyz-vBackgroundCenter));const float startAngle=0.1;float fadeFactor=saturate(viewAngleToFloor/startAngle);finalAlpha*=fadeFactor*fadeFactor;
#endif
#ifdef SHADOWINUSE
finalColor=mix(finalColor*shadowLevel,finalColor,globalShadow);
#endif
vec4 color=vec4(finalColor,finalAlpha);
#else
vec4 color=vec4(vPrimaryColor.rgb,(1.0-clamp(globalShadow,0.,1.))*alpha);
#endif
#include<logDepthFragment>
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
#if !defined(SKIPFINALCOLORCLAMP)
color.rgb=clamp(color.rgb,0.,30.0);
#endif
#else
color=applyImageProcessing(color);
#endif
#ifdef PREMULTIPLYALPHA
color.rgb*=color.a;
#endif
#ifdef NOISE
color.rgb+=dither(vPositionW.xy,0.5);color=max(color,0.0);
#endif
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;b.ShaderStore.ShadersStore[g]||(b.ShaderStore.ShadersStore[g]=h),a.s(["backgroundPixelShader",0,{name:g,shader:h}],146877)},422901,992294,a=>{"use strict";var b=a.i(625562);a.i(284660),a.i(142967),a.i(463068),a.i(315937),a.i(431801),a.i(160815);let c="gaussianSplatting",d=`fn getDataUV(index: f32,dataTextureSize: vec2f)->vec2<f32> {let y: f32=floor(index/dataTextureSize.x);let x: f32=index-y*dataTextureSize.x;return vec2f((x+0.5),(y+0.5));}
struct Splat {center: vec4f,
color: vec4f,
covA: vec4f,
covB: vec4f,
#if SH_DEGREE>0
sh0: vec4<u32>,
#endif
#if SH_DEGREE>1
sh1: vec4<u32>,
#endif
#if SH_DEGREE>2
sh2: vec4<u32>,
#endif
};fn getSplatIndex(localIndex: i32,splatIndex0: vec4f,splatIndex1: vec4f,splatIndex2: vec4f,splatIndex3: vec4f)->f32 {var splatIndex: f32;switch (localIndex)
{case 0:
{splatIndex=splatIndex0.x;break;}
case 1:
{splatIndex=splatIndex0.y;break;}
case 2:
{splatIndex=splatIndex0.z;break;}
case 3:
{splatIndex=splatIndex0.w;break;}
case 4:
{splatIndex=splatIndex1.x;break;}
case 5:
{splatIndex=splatIndex1.y;break;}
case 6:
{splatIndex=splatIndex1.z;break;}
case 7:
{splatIndex=splatIndex1.w;break;}
case 8:
{splatIndex=splatIndex2.x;break;}
case 9:
{splatIndex=splatIndex2.y;break;}
case 10:
{splatIndex=splatIndex2.z;break;}
case 11:
{splatIndex=splatIndex2.w;break;}
case 12:
{splatIndex=splatIndex3.x;break;}
case 13:
{splatIndex=splatIndex3.y;break;}
case 14:
{splatIndex=splatIndex3.z;break;}
default:
{splatIndex=splatIndex3.w;break;}}
return splatIndex;}
fn readSplat(splatIndex: f32,dataTextureSize: vec2f)->Splat {var splat: Splat;let splatUV=getDataUV(splatIndex,dataTextureSize);let splatUVi32=vec2<i32>(i32(splatUV.x),i32(splatUV.y));splat.center=textureLoad(centersTexture,splatUVi32,0);splat.color=textureLoad(colorsTexture,splatUVi32,0);splat.covA=textureLoad(covariancesATexture,splatUVi32,0)*splat.center.w;splat.covB=textureLoad(covariancesBTexture,splatUVi32,0)*splat.center.w;
#if SH_DEGREE>0
splat.sh0=textureLoad(shTexture0,splatUVi32,0);
#endif
#if SH_DEGREE>1
splat.sh1=textureLoad(shTexture1,splatUVi32,0);
#endif
#if SH_DEGREE>2
splat.sh2=textureLoad(shTexture2,splatUVi32,0);
#endif
return splat;}
fn computeColorFromSHDegree(dir: vec3f,sh: array<vec3<f32>,16>)->vec3f
{let SH_C0: f32=0.28209479;let SH_C1: f32=0.48860251;var SH_C2: array<f32,5>=array<f32,5>(
1.092548430,
-1.09254843,
0.315391565,
-1.09254843,
0.546274215
);var SH_C3: array<f32,7>=array<f32,7>(
-0.59004358,
2.890611442,
-0.45704579,
0.373176332,
-0.45704579,
1.445305721,
-0.59004358
);var result: vec3f=/*SH_C0**/sh[0];
#if SH_DEGREE>0
let x: f32=dir.x;let y: f32=dir.y;let z: f32=dir.z;result+=-SH_C1*y*sh[1]+SH_C1*z*sh[2]-SH_C1*x*sh[3];
#if SH_DEGREE>1
let xx: f32=x*x;let yy: f32=y*y;let zz: f32=z*z;let xy: f32=x*y;let yz: f32=y*z;let xz: f32=x*z;result+=
SH_C2[0]*xy*sh[4] +
SH_C2[1]*yz*sh[5] +
SH_C2[2]*(2.0f*zz-xx-yy)*sh[6] +
SH_C2[3]*xz*sh[7] +
SH_C2[4]*(xx-yy)*sh[8];
#if SH_DEGREE>2
result+=
SH_C3[0]*y*(3.0f*xx-yy)*sh[9] +
SH_C3[1]*xy*z*sh[10] +
SH_C3[2]*y*(4.0f*zz-xx-yy)*sh[11] +
SH_C3[3]*z*(2.0f*zz-3.0f*xx-3.0f*yy)*sh[12] +
SH_C3[4]*x*(4.0f*zz-xx-yy)*sh[13] +
SH_C3[5]*z*(xx-yy)*sh[14] +
SH_C3[6]*x*(xx-3.0f*yy)*sh[15];
#endif
#endif
#endif
return result;}
fn decompose(value: u32)->vec4f
{let components : vec4f=vec4f(
f32((value ) & 255u),
f32((value>>u32( 8)) & 255u),
f32((value>>u32(16)) & 255u),
f32((value>>u32(24)) & 255u));return components*vec4f(2./255.)-vec4f(1.);}
fn computeSH(splat: Splat,dir: vec3f)->vec3f
{var sh: array<vec3<f32>,16>;sh[0]=vec3f(0.,0.,0.);
#if SH_DEGREE>0
let sh00: vec4f=decompose(splat.sh0.x);let sh01: vec4f=decompose(splat.sh0.y);let sh02: vec4f=decompose(splat.sh0.z);sh[1]=vec3f(sh00.x,sh00.y,sh00.z);sh[2]=vec3f(sh00.w,sh01.x,sh01.y);sh[3]=vec3f(sh01.z,sh01.w,sh02.x);
#endif
#if SH_DEGREE>1
let sh03: vec4f=decompose(splat.sh0.w);let sh04: vec4f=decompose(splat.sh1.x);let sh05: vec4f=decompose(splat.sh1.y);sh[4]=vec3f(sh02.y,sh02.z,sh02.w);sh[5]=vec3f(sh03.x,sh03.y,sh03.z);sh[6]=vec3f(sh03.w,sh04.x,sh04.y);sh[7]=vec3f(sh04.z,sh04.w,sh05.x);sh[8]=vec3f(sh05.y,sh05.z,sh05.w);
#endif
#if SH_DEGREE>2
let sh06: vec4f=decompose(splat.sh1.z);let sh07: vec4f=decompose(splat.sh1.w);let sh08: vec4f=decompose(splat.sh2.x);let sh09: vec4f=decompose(splat.sh2.y);let sh10: vec4f=decompose(splat.sh2.z);let sh11: vec4f=decompose(splat.sh2.w);sh[9]=vec3f(sh06.x,sh06.y,sh06.z);sh[10]=vec3f(sh06.w,sh07.x,sh07.y);sh[11]=vec3f(sh07.z,sh07.w,sh08.x);sh[12]=vec3f(sh08.y,sh08.z,sh08.w);sh[13]=vec3f(sh09.x,sh09.y,sh09.z);sh[14]=vec3f(sh09.w,sh10.x,sh10.y);sh[15]=vec3f(sh10.z,sh10.w,sh11.x); 
#endif
return computeColorFromSHDegree(dir,sh);}
fn gaussianSplatting(
meshPos: vec2<f32>,
worldPos: vec3<f32>,
scale: vec2<f32>,
covA: vec3<f32>,
covB: vec3<f32>,
worldMatrix: mat4x4<f32>,
viewMatrix: mat4x4<f32>,
projectionMatrix: mat4x4<f32>,
focal: vec2f,
invViewport: vec2f,
kernelSize: f32
)->vec4f {let modelView=viewMatrix*worldMatrix;let camspace=viewMatrix*vec4f(worldPos,1.0);let pos2d=projectionMatrix*camspace;let bounds=1.2*pos2d.w;if (pos2d.z<0. || pos2d.x<-bounds || pos2d.x>bounds || pos2d.y<-bounds || pos2d.y>bounds) {return vec4f(0.0,0.0,2.0,1.0);}
let Vrk=mat3x3<f32>(
covA.x,covA.y,covA.z,
covA.y,covB.x,covB.y,
covA.z,covB.y,covB.z
);let isOrtho=abs(projectionMatrix[3][3]-1.0)<0.001;var J: mat3x3<f32>;if (isOrtho) {J=mat3x3<f32>(
focal.x,0.0,0.0,
0.0,focal.y,0.0,
0.0,0.0,0.0
);} else {J=mat3x3<f32>(
focal.x/camspace.z,0.0,-(focal.x*camspace.x)/(camspace.z*camspace.z),
0.0,focal.y/camspace.z,-(focal.y*camspace.y)/(camspace.z*camspace.z),
0.0,0.0,0.0
);}
let invy=mat3x3<f32>(
1.0,0.0,0.0,
0.0,-1.0,0.0,
0.0,0.0,1.0
);let T=invy*transpose(mat3x3<f32>(
modelView[0].xyz,
modelView[1].xyz,
modelView[2].xyz))*J;var cov2d=transpose(T)*Vrk*T;
#if COMPENSATION
let c00: f32=cov2d[0][0];let c11: f32=cov2d[1][1];let c01: f32=cov2d[0][1];let detOrig: f32=c00*c11-c01*c01;
#endif
cov2d[0][0]+=kernelSize;cov2d[1][1]+=kernelSize;
#if COMPENSATION
let c2d: vec3f=vec3f(cov2d[0][0],c01,cov2d[1][1]);let detBlur: f32=c2d.x*c2d.z-c2d.y*c2d.y;let compensation: f32=sqrt(max(0.,detOrig/detBlur));vertexOutputs.vColor.w*=compensation;
#endif
let mid=(cov2d[0][0]+cov2d[1][1])/2.0;let radius=length(vec2<f32>((cov2d[0][0]-cov2d[1][1])/2.0,cov2d[0][1]));let lambda1=mid+radius;let lambda2=mid-radius;if (lambda2<0.0) {return vec4f(0.0,0.0,2.0,1.0);}
let diagonalVector=normalize(vec2<f32>(cov2d[0][1],lambda1-cov2d[0][0]));let majorAxis=min(sqrt(2.0*lambda1),1024.0)*diagonalVector;let minorAxis=min(sqrt(2.0*lambda2),1024.0)*vec2<f32>(diagonalVector.y,-diagonalVector.x);let vCenter=vec2<f32>(pos2d.x,pos2d.y);let scaleFactor=select(pos2d.w,1.0,isOrtho);return vec4f(
vCenter+((meshPos.x*majorAxis+meshPos.y*minorAxis)*invViewport*scaleFactor)*scale,
pos2d.z,
pos2d.w
);}`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([],992294),a.i(736380),a.i(43607),a.i(5021);let e="gaussianSplattingVertexShader",f=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
#include<helperFunctions>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<logDepthDeclaration>
attribute splatIndex0: vec4f;attribute splatIndex1: vec4f;attribute splatIndex2: vec4f;attribute splatIndex3: vec4f;attribute position: vec3f;uniform invViewport: vec2f;uniform dataTextureSize: vec2f;uniform focal: vec2f;uniform kernelSize: f32;uniform eyePosition: vec3f;uniform viewDirectionFactor: vec3f;uniform alpha: f32;var covariancesATexture: texture_2d<f32>;var covariancesBTexture: texture_2d<f32>;var centersTexture: texture_2d<f32>;var colorsTexture: texture_2d<f32>;
#if SH_DEGREE>0
var shTexture0: texture_2d<u32>;
#endif
#if SH_DEGREE>1
var shTexture1: texture_2d<u32>;
#endif
#if SH_DEGREE>2
var shTexture2: texture_2d<u32>;
#endif
varying vColor: vec4f;varying vPosition: vec2f;
#include<gaussianSplatting>
@vertex
fn main(input : VertexInputs)->FragmentInputs {let splatIndex: f32=getSplatIndex(i32(input.position.z+0.5),input.splatIndex0,input.splatIndex1,input.splatIndex2,input.splatIndex3);var splat: Splat=readSplat(splatIndex,uniforms.dataTextureSize);var covA: vec3f=splat.covA.xyz;var covB: vec3f=vec3f(splat.covA.w,splat.covB.xy);let worldPos: vec4f=mesh.world*vec4f(splat.center.xyz,1.0);vertexOutputs.vPosition=input.position.xy;
#if SH_DEGREE>0
let worldRot: mat3x3f= mat3x3f(mesh.world[0].xyz,mesh.world[1].xyz,mesh.world[2].xyz);let normWorldRot: mat3x3f=inverseMat3(worldRot);var dir: vec3f=normalize(normWorldRot*(worldPos.xyz-uniforms.eyePosition.xyz));dir*=uniforms.viewDirectionFactor;vertexOutputs.vColor=vec4f(splat.color.xyz+computeSH(splat,dir),splat.color.w*uniforms.alpha);
#else
vertexOutputs.vColor=vec4f(splat.color.xyz,splat.color.w*uniforms.alpha);
#endif
vertexOutputs.position=gaussianSplatting(input.position.xy,worldPos.xyz,vec2f(1.0,1.0),covA,covB,mesh.world,scene.view,scene.projection,uniforms.focal,uniforms.invViewport,uniforms.kernelSize);
#include<clipPlaneVertex>
#include<fogVertex>
#include<logDepthVertex>
}
`;b.ShaderStore.ShadersStoreWGSL[e]||(b.ShaderStore.ShadersStoreWGSL[e]=f),a.s(["gaussianSplattingVertexShaderWGSL",0,{name:e,shader:f}],422901)},277267,a=>{"use strict";var b=a.i(625562);let c="screenSpaceRayTrace",d=`float distanceSquared(vec2 a,vec2 b) { a-=b; return dot(a,a); }
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
float linearizeDepth(float depth,float near,float far) {
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
return -(near*far)/(far-depth*(far-near));
#else
return (near*far)/(far-depth*(far-near));
#endif
}
#endif
/**
param csOrigin Camera-space ray origin,which must be 
within the view volume and must have z>0.01 and project within the valid screen rectangle
param csDirection Unit length camera-space ray direction
param projectToPixelMatrix A projection matrix that maps to **pixel** coordinates 
(**not** [-1,+1] normalized device coordinates).
param csZBuffer The camera-space Z buffer
param csZBufferSize Dimensions of csZBuffer
param csZThickness Camera space csZThickness to ascribe to each pixel in the depth buffer
param nearPlaneZ Positive number. Doesn't have to be THE actual near plane,just a reasonable value
for clipping rays headed towards the camera
param stride Step in horizontal or vertical pixels between samples. This is a float
because integer math is slow on GPUs,but should be set to an integer>=1
param jitterFraction Number between 0 and 1 for how far to bump the ray in stride units
to conceal banding artifacts,plus the stride ray offset.
param maxSteps Maximum number of iterations. Higher gives better images but may be slow
param maxRayTraceDistance Maximum camera-space distance to trace before returning a miss
param selfCollisionNumSkip Number of steps to skip at start when raytracing to avoid self collisions.
1 is a reasonable value,depending on the scene you may need to set this value to 2
param hitPixel Pixel coordinates of the first intersection with the scene
param numIterations number of iterations performed
param csHitPoint Camera space location of the ray hit
*/
#define inline
bool traceScreenSpaceRay1(
vec3 csOrigin,
vec3 csDirection,
mat4 projectToPixelMatrix,
sampler2D csZBuffer,
vec2 csZBufferSize,
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
sampler2D csZBackBuffer,
float csZBackSizeFactor,
#endif
float csZThickness,
float nearPlaneZ,
float farPlaneZ,
float stride,
float jitterFraction,
float maxSteps,
float maxRayTraceDistance,
float selfCollisionNumSkip,
out vec2 startPixel,
out vec2 hitPixel,
out vec3 csHitPoint,
out float numIterations
#ifdef SSRAYTRACE_DEBUG
,out vec3 debugColor
#endif
)
{
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
float rayLength=(csOrigin.z+csDirection.z*maxRayTraceDistance)>-nearPlaneZ ? (-nearPlaneZ-csOrigin.z)/csDirection.z : maxRayTraceDistance;
#else
float rayLength=(csOrigin.z+csDirection.z*maxRayTraceDistance)<nearPlaneZ ? (nearPlaneZ-csOrigin.z)/csDirection.z : maxRayTraceDistance;
#endif
vec3 csEndPoint=csOrigin+csDirection*rayLength;hitPixel=vec2(-1.0,-1.0);vec4 H0=projectToPixelMatrix*vec4(csOrigin,1.0);vec4 H1=projectToPixelMatrix*vec4(csEndPoint,1.0);float k0=1.0/H0.w;float k1=1.0/H1.w;vec3 Q0=csOrigin*k0;vec3 Q1=csEndPoint*k1;vec2 P0=H0.xy*k0;vec2 P1=H1.xy*k1;
#ifdef SSRAYTRACE_CLIP_TO_FRUSTUM
float xMax=csZBufferSize.x-0.5,xMin=0.5,yMax=csZBufferSize.y-0.5,yMin=0.5;float alpha=0.0;if ((P1.y>yMax) || (P1.y<yMin)) {alpha=(P1.y-((P1.y>yMax) ? yMax : yMin))/(P1.y-P0.y);}
if ((P1.x>xMax) || (P1.x<xMin)) {alpha=max(alpha,(P1.x-((P1.x>xMax) ? xMax : xMin))/(P1.x-P0.x));}
P1=mix(P1,P0,alpha); k1=mix(k1,k0,alpha); Q1=mix(Q1,Q0,alpha);
#endif
P1+=vec2((distanceSquared(P0,P1)<0.0001) ? 0.01 : 0.0);vec2 delta=P1-P0;bool permute=false;if (abs(delta.x)<abs(delta.y)) { 
permute=true;delta=delta.yx;P0=P0.yx;P1=P1.yx; }
float stepDirection=sign(delta.x);float invdx=stepDirection/delta.x;vec2 dP=vec2(stepDirection,delta.y*invdx);vec3 dQ=(Q1-Q0)*invdx;float dk=(k1-k0)*invdx;float zMin=min(csEndPoint.z,csOrigin.z);float zMax=max(csEndPoint.z,csOrigin.z);dP*=stride; dQ*=stride; dk*=stride;P0+=dP*jitterFraction; Q0+=dQ*jitterFraction; k0+=dk*jitterFraction;vec4 pqk=vec4(P0,Q0.z,k0);vec4 dPQK=vec4(dP,dQ.z,dk);startPixel=permute ? P0.yx : P0.xy;float prevZMaxEstimate=csOrigin.z;float rayZMin=prevZMaxEstimate,rayZMax=prevZMaxEstimate;float sceneZMax=rayZMax+1e4;float end=P1.x*stepDirection;bool hit=false;float stepCount;for (stepCount=0.0;stepCount<=selfCollisionNumSkip ||
(pqk.x*stepDirection)<=end &&
stepCount<maxSteps &&
!hit &&
sceneZMax != 0.0; 
pqk+=dPQK,++stepCount)
{hitPixel=permute ? pqk.yx : pqk.xy;rayZMin=prevZMaxEstimate;rayZMax=(dPQK.z*0.5+pqk.z)/(dPQK.w*0.5+pqk.w);rayZMax=clamp(rayZMax,zMin,zMax);prevZMaxEstimate=rayZMax;if (rayZMin>rayZMax) { 
float t=rayZMin; rayZMin=rayZMax; rayZMax=t;}
sceneZMax=texelFetch(csZBuffer,ivec2(hitPixel),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneZMax=linearizeDepth(sceneZMax,nearPlaneZ,farPlaneZ);
#endif
if (sceneZMax==0.0) sceneZMax=1e8;
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
float sceneBackZ=texelFetch(csZBackBuffer,ivec2(hitPixel/csZBackSizeFactor),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneBackZ=linearizeDepth(sceneBackZ,nearPlaneZ,farPlaneZ);
#endif
if (sceneBackZ==0.0) sceneBackZ=-1e8;hit=(rayZMax>=sceneBackZ-csZThickness) && (rayZMin<=sceneZMax);
#else
hit=(rayZMax>=sceneZMax-csZThickness) && (rayZMin<=sceneZMax);
#endif
#else
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
float sceneBackZ=texelFetch(csZBackBuffer,ivec2(hitPixel/csZBackSizeFactor),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneBackZ=linearizeDepth(sceneBackZ,nearPlaneZ,farPlaneZ);
#endif
if (sceneBackZ==0.0) sceneBackZ=1e8;hit=(rayZMin<=sceneBackZ+csZThickness) && (rayZMax>=sceneZMax) && (sceneZMax != 0.0);
#else
hit=(rayZMin<=sceneZMax+csZThickness) && (rayZMax>=sceneZMax);
#endif
#endif
}
pqk-=dPQK;stepCount-=1.0;if (((pqk.x+dPQK.x)*stepDirection)>end || (stepCount+1.0)>=maxSteps || sceneZMax==0.0) {hit=false;}
#ifdef SSRAYTRACE_ENABLE_REFINEMENT
if (stride>1.0 && hit) {pqk-=dPQK;stepCount-=1.0;float invStride=1.0/stride;dPQK*=invStride;float refinementStepCount=0.0;prevZMaxEstimate=pqk.z/pqk.w;rayZMax=prevZMaxEstimate;sceneZMax=rayZMax+1e7;for (;refinementStepCount<=1.0 ||
(refinementStepCount<=stride*1.4) &&
(rayZMax<sceneZMax) && (sceneZMax != 0.0);pqk+=dPQK,refinementStepCount+=1.0)
{rayZMin=prevZMaxEstimate;rayZMax=(dPQK.z*0.5+pqk.z)/(dPQK.w*0.5+pqk.w);rayZMax=clamp(rayZMax,zMin,zMax);prevZMaxEstimate=rayZMax;rayZMax=max(rayZMax,rayZMin);hitPixel=permute ? pqk.yx : pqk.xy;sceneZMax=texelFetch(csZBuffer,ivec2(hitPixel),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneZMax=linearizeDepth(sceneZMax,nearPlaneZ,farPlaneZ);
#endif
}
pqk-=dPQK;refinementStepCount-=1.0;stepCount+=refinementStepCount/stride;}
#endif
Q0.xy+=dQ.xy*stepCount;Q0.z=pqk.z;csHitPoint=Q0/pqk.w;numIterations=stepCount+1.0;
#ifdef SSRAYTRACE_DEBUG
if (((pqk.x+dPQK.x)*stepDirection)>end) {debugColor=vec3(0,0,1);} else if ((stepCount+1.0)>=maxSteps) {debugColor=vec3(1,0,0);} else if (sceneZMax==0.0) {debugColor=vec3(1,1,0);} else {debugColor=vec3(0,stepCount/maxSteps,0);}
#endif
return hit;}
/**
texCoord: in the [0,1] range
depth: depth in view space (range [znear,zfar]])
*/
vec3 computeViewPosFromUVDepth(vec2 texCoord,float depth,mat4 projection,mat4 invProjectionMatrix) {vec4 ndc;ndc.xy=texCoord*2.0-1.0;
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
#ifdef ORTHOGRAPHIC_CAMERA
ndc.z=-projection[2].z*depth+projection[3].z;
#else
ndc.z=-projection[2].z-projection[3].z/depth;
#endif
#else
#ifdef ORTHOGRAPHIC_CAMERA
ndc.z=projection[2].z*depth+projection[3].z;
#else
ndc.z=projection[2].z+projection[3].z/depth;
#endif
#endif
ndc.w=1.0;vec4 eyePos=invProjectionMatrix*ndc;eyePos.xyz/=eyePos.w;return eyePos.xyz;}
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([])},617510,a=>{"use strict";var b=a.i(625562);a.i(964653),a.i(533676),a.i(277267);let c="screenSpaceReflection2BlurCombinerPixelShader",d=`uniform sampler2D textureSampler; 
uniform sampler2D mainSampler;uniform sampler2D reflectivitySampler;uniform float strength;uniform float reflectionSpecularFalloffExponent;uniform float reflectivityThreshold;varying vec2 vUV;
#include<helperFunctions>
#ifdef SSR_BLEND_WITH_FRESNEL
#include<pbrBRDFFunctions>
#include<screenSpaceRayTrace>
uniform mat4 projection;uniform mat4 invProjectionMatrix;
#ifdef SSR_NORMAL_IS_IN_WORLDSPACE
uniform mat4 view;
#endif
uniform sampler2D normalSampler;uniform sampler2D depthSampler;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
uniform float nearPlaneZ;uniform float farPlaneZ;
#endif
#endif
void main()
{
#ifdef SSRAYTRACE_DEBUG
gl_FragColor=texture2D(textureSampler,vUV);
#else
vec3 SSR=texture2D(textureSampler,vUV).rgb;vec4 color=texture2D(mainSampler,vUV);vec4 reflectivity=texture2D(reflectivitySampler,vUV);
#ifndef SSR_DISABLE_REFLECTIVITY_TEST
if (max(reflectivity.r,max(reflectivity.g,reflectivity.b))<=reflectivityThreshold) {gl_FragColor=color;return;}
#endif
#ifdef SSR_INPUT_IS_GAMMA_SPACE
color=toLinearSpace(color);
#endif
#ifdef SSR_BLEND_WITH_FRESNEL
vec2 texSize=vec2(textureSize(depthSampler,0));vec3 csNormal=texelFetch(normalSampler,ivec2(vUV*texSize),0).xyz;
#ifdef SSR_DECODE_NORMAL
csNormal=csNormal*2.0-1.0;
#endif
#ifdef SSR_NORMAL_IS_IN_WORLDSPACE
csNormal=(view*vec4(csNormal,0.0)).xyz;
#endif
float depth=texelFetch(depthSampler,ivec2(vUV*texSize),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
depth=linearizeDepth(depth,nearPlaneZ,farPlaneZ);
#endif
vec3 csPosition=computeViewPosFromUVDepth(vUV,depth,projection,invProjectionMatrix);vec3 csViewDirection=normalize(csPosition);vec3 F0=reflectivity.rgb;vec3 fresnel=fresnelSchlickGGX(max(dot(csNormal,-csViewDirection),0.0),F0,vec3(1.));vec3 reflectionMultiplier=clamp(pow(fresnel*strength,vec3(reflectionSpecularFalloffExponent)),0.0,1.0);
#else
vec3 reflectionMultiplier=clamp(pow(reflectivity.rgb*strength,vec3(reflectionSpecularFalloffExponent)),0.0,1.0);
#endif
vec3 colorMultiplier=1.0-reflectionMultiplier;vec3 finalColor=(color.rgb*colorMultiplier)+(SSR*reflectionMultiplier);
#ifdef SSR_OUTPUT_IS_GAMMA_SPACE
finalColor=toGammaSpace(finalColor);
#endif
gl_FragColor=vec4(finalColor,color.a);
#endif
}
`;b.ShaderStore.ShadersStore[c]||(b.ShaderStore.ShadersStore[c]=d),a.s(["screenSpaceReflection2BlurCombinerPixelShader",0,{name:c,shader:d}])},500507,a=>{"use strict";var b=a.i(625562);let c="screenSpaceRayTrace",d=`fn distanceSquared(a: vec2f,b: vec2f)->f32 { 
var temp=a-b; 
return dot(temp,temp); }
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
fn linearizeDepth(depth: f32,near: f32,far: f32)->f32 {
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
return -(near*far)/(far-depth*(far-near));
#else
return (near*far)/(far-depth*(far-near));
#endif
}
#endif
/**
param csOrigin Camera-space ray origin,which must be 
within the view volume and must have z>0.01 and project within the valid screen rectangle
param csDirection Unit length camera-space ray direction
param projectToPixelMatrix A projection matrix that maps to **pixel** coordinates 
(**not** [-1,+1] normalized device coordinates).
param csZBuffer The camera-space Z buffer
param csZBufferSize Dimensions of csZBuffer
param csZThickness Camera space csZThickness to ascribe to each pixel in the depth buffer
param nearPlaneZ Positive number. Doesn't have to be THE actual near plane,just a reasonable value
for clipping rays headed towards the camera. Should be the actual near plane if screen-space depth is enabled.
param farPlaneZ The far plane for the camera. Used when screen-space depth is enabled.
param stride Step in horizontal or vertical pixels between samples. This is a var because: f32 integer math is slow on GPUs,but should be set to an integer>=1
param jitterFraction Number between 0 and 1 for how far to bump the ray in stride units
to conceal banding artifacts,plus the stride ray offset.
param maxSteps Maximum number of iterations. Higher gives better images but may be slow
param maxRayTraceDistance Maximum camera-space distance to trace before returning a miss
param selfCollisionNumSkip Number of steps to skip at start when raytracing to avar self: voidnull collisions.
1 is a reasonable value,depending on the scene you may need to set this value to 2
param hitPixel Pixel coordinates of the first intersection with the scene
param numIterations number of iterations performed
param csHitPovar Camera: i32 space location of the ray hit
*/
fn traceScreenSpaceRay1(
csOrigin: vec3f,
csDirection: vec3f,
projectToPixelMatrix: mat4x4f,
csZBuffer: texture_2d<f32>,
csZBufferSize: vec2f,
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
csZBackBuffer: texture_2d<f32>,
csZBackSizeFactor: f32,
#endif
csZThickness: f32,
nearPlaneZ: f32,
farPlaneZ: f32,
stride: f32,
jitterFraction: f32,
maxSteps: f32,
maxRayTraceDistance: f32,
selfCollisionNumSkip: f32,
startPixel: ptr<function,vec2f>,
hitPixel: ptr<function,vec2f>,
csHitPoint: ptr<function,vec3f>,
numIterations: ptr<function,f32>
#ifdef SSRAYTRACE_DEBUG
,debugColor: ptr<function,vec3f>
#endif
)->bool
{
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
var rayLength: f32=select(maxRayTraceDistance,(-nearPlaneZ-csOrigin.z)/csDirection.z,(csOrigin.z+csDirection.z*maxRayTraceDistance)>-nearPlaneZ);
#else
var rayLength: f32=select(maxRayTraceDistance,(nearPlaneZ-csOrigin.z)/csDirection.z,(csOrigin.z+csDirection.z*maxRayTraceDistance)<nearPlaneZ);
#endif
var csEndPoint: vec3f=csOrigin+csDirection*rayLength;*hitPixel= vec2f(-1.0,-1.0);var H0: vec4f=projectToPixelMatrix* vec4f(csOrigin,1.0);var H1: vec4f=projectToPixelMatrix* vec4f(csEndPoint,1.0);var k0: f32=1.0/H0.w;var k1: f32=1.0/H1.w;var Q0: vec3f=csOrigin*k0;var Q1: vec3f=csEndPoint*k1;var P0: vec2f=H0.xy*k0;var P1: vec2f=H1.xy*k1;
#ifdef SSRAYTRACE_CLIP_TO_FRUSTUM
var xMax: f32=csZBufferSize.x-0.5;var xMin=0.5;var yMax=csZBufferSize.y-0.5;var yMin=0.5;var alpha: f32=0.0;if ((P1.y>yMax) || (P1.y<yMin)) {alpha=(P1.y-select(yMin,yMax,(P1.y>yMax)))/(P1.y-P0.y);}
if ((P1.x>xMax) || (P1.x<xMin)) {alpha=max(alpha,(P1.x-select(xMin,xMax,(P1.x>xMax)))/(P1.x-P0.x));}
P1=mix(P1,P0,alpha); k1=mix(k1,k0,alpha); Q1=mix(Q1,Q0,alpha);
#endif
P1+= vec2f(select(0.0,0.01,distanceSquared(P0,P1)<0.0001));var delta: vec2f=P1-P0;var permute: bool=false;if (abs(delta.x)<abs(delta.y)) { 
permute=true;delta=delta.yx;P0=P0.yx;P1=P1.yx; }
var stepDirection: f32=sign(delta.x);var invdx: f32=stepDirection/delta.x;var dP: vec2f= vec2f(stepDirection,delta.y*invdx);var dQ: vec3f=(Q1-Q0)*invdx;var dk: f32=(k1-k0)*invdx;var zMin: f32=min(csEndPoint.z,csOrigin.z);var zMax: f32=max(csEndPoint.z,csOrigin.z);dP*=stride; dQ*=stride; dk*=stride;P0+=dP*jitterFraction; Q0+=dQ*jitterFraction; k0+=dk*jitterFraction;var pqk: vec4f= vec4f(P0,Q0.z,k0);var dPQK: vec4f= vec4f(dP,dQ.z,dk);*startPixel=select(P0.xy,P0.yx,permute);var prevZMaxEstimate: f32=csOrigin.z;var rayZMin: f32=prevZMaxEstimate;var rayZMax=prevZMaxEstimate;var sceneZMax: f32=rayZMax+1e4;var end: f32=P1.x*stepDirection;var hit: bool=false;var stepCount: f32;for (stepCount=0.0;(stepCount<=selfCollisionNumSkip) ||
((pqk.x*stepDirection)<=end &&
stepCount<maxSteps &&
!hit &&
sceneZMax != 0.0);pqk+=dPQK 
)
{*hitPixel=select(pqk.xy,pqk.yx,permute);rayZMin=prevZMaxEstimate;rayZMax=(dPQK.z*0.5+pqk.z)/(dPQK.w*0.5+pqk.w);rayZMax=clamp(rayZMax,zMin,zMax);prevZMaxEstimate=rayZMax;if (rayZMin>rayZMax) { 
var t: f32=rayZMin; rayZMin=rayZMax; rayZMax=t;}
sceneZMax=textureLoad(csZBuffer,vec2<i32>(*hitPixel),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneZMax=linearizeDepth(sceneZMax,nearPlaneZ,farPlaneZ);
#endif
if (sceneZMax==0.0) { sceneZMax=1e8; }
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
var sceneBackZ: f32=textureLoad(csZBackBuffer,vec2<i32>(*hitPixel/csZBackSizeFactor),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneBackZ=linearizeDepth(sceneBackZ,nearPlaneZ,farPlaneZ);
#endif
if (sceneBackZ==0.0) { sceneBackZ=-1e8; }
hit=(rayZMax>=sceneBackZ-csZThickness) && (rayZMin<=sceneZMax);
#else
hit=(rayZMax>=sceneZMax-csZThickness) && (rayZMin<=sceneZMax);
#endif
#else
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
var sceneBackZ: f32=textureLoad(csZBackBuffer,vec2<i32>(*hitPixel/csZBackSizeFactor),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneBackZ=linearizeDepth(sceneBackZ,nearPlaneZ,farPlaneZ);
#endif
if (sceneBackZ==0.0) { sceneBackZ=1e8; }
hit=(rayZMin<=sceneBackZ+csZThickness) && (rayZMax>=sceneZMax) && (sceneZMax != 0.0);
#else
hit=(rayZMin<=sceneZMax+csZThickness) && (rayZMax>=sceneZMax);
#endif
#endif
stepCount+=1.0;}
pqk-=dPQK;stepCount-=1.0;if (((pqk.x+dPQK.x)*stepDirection)>end || (stepCount+1.0)>=maxSteps || sceneZMax==0.0) {hit=false;}
#ifdef SSRAYTRACE_ENABLE_REFINEMENT
if (stride>1.0 && hit) {pqk-=dPQK;stepCount-=1.0;var invStride: f32=1.0/stride;dPQK*=invStride;var refinementStepCount: f32=0.0;prevZMaxEstimate=pqk.z/pqk.w;rayZMax=prevZMaxEstimate;sceneZMax=rayZMax+1e7;for (;refinementStepCount<=1.0 ||
((refinementStepCount<=stride*1.4) &&
(rayZMax<sceneZMax) && (sceneZMax != 0.0));pqk+=dPQK)
{rayZMin=prevZMaxEstimate;rayZMax=(dPQK.z*0.5+pqk.z)/(dPQK.w*0.5+pqk.w);rayZMax=clamp(rayZMax,zMin,zMax);prevZMaxEstimate=rayZMax;rayZMax=max(rayZMax,rayZMin);*hitPixel=select(pqk.xy,pqk.yx,permute);sceneZMax=textureLoad(csZBuffer,vec2<i32>(*hitPixel),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
sceneZMax=linearizeDepth(sceneZMax,nearPlaneZ,farPlaneZ);
#endif
refinementStepCount+=1.0;}
pqk-=dPQK;refinementStepCount-=1.0;stepCount+=refinementStepCount/stride;}
#endif
Q0=vec3f(Q0.xy+dQ.xy*stepCount,pqk.z);*csHitPoint=Q0/pqk.w;*numIterations=stepCount+1.0;
#ifdef SSRAYTRACE_DEBUG
if (((pqk.x+dPQK.x)*stepDirection)>end) {*debugColor= vec3f(0,0,1);} else if ((stepCount+1.0)>=maxSteps) {*debugColor= vec3f(1,0,0);} else if (sceneZMax==0.0) {*debugColor= vec3f(1,1,0);} else {*debugColor= vec3f(0,stepCount/maxSteps,0);}
#endif
return hit;}
/**
texCoord: in the [0,1] range
depth: depth in view space (range [znear,zfar]])
*/
fn computeViewPosFromUVDepth(texCoord: vec2f,depth: f32,projection: mat4x4f,invProjectionMatrix: mat4x4f)->vec3f {var xy=texCoord*2.0-1.0;var z: f32;
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
#ifdef ORTHOGRAPHIC_CAMERA
z=-projection[2].z*depth+projection[3].z;
#else
z=-projection[2].z-projection[3].z/depth;
#endif
#else
#ifdef ORTHOGRAPHIC_CAMERA
z=projection[2].z*depth+projection[3].z;
#else
z=projection[2].z+projection[3].z/depth;
#endif
#endif
var w=1.0;var ndc=vec4f(xy,z,w);var eyePos: vec4f=invProjectionMatrix*ndc;var result=eyePos.xyz/eyePos.w;return result;}
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},693571,a=>{"use strict";var b=a.i(625562);a.i(463068),a.i(51308),a.i(500507);let c="screenSpaceReflection2BlurCombinerPixelShader",d=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>; 
var mainSamplerSampler: sampler;var mainSampler: texture_2d<f32>;var reflectivitySamplerSampler: sampler;var reflectivitySampler: texture_2d<f32>;uniform strength: f32;uniform reflectionSpecularFalloffExponent: f32;uniform reflectivityThreshold: f32;varying vUV: vec2f;
#include<helperFunctions>
#ifdef SSR_BLEND_WITH_FRESNEL
#include<pbrBRDFFunctions>
#include<screenSpaceRayTrace>
uniform projection: mat4x4f;uniform invProjectionMatrix: mat4x4f;
#ifdef SSR_NORMAL_IS_IN_WORLDSPACE
uniform view: mat4x4f;
#endif
var normalSampler: texture_2d<f32>;var depthSampler: texture_2d<f32>;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
uniform nearPlaneZ: f32;uniform farPlaneZ: f32;
#endif
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#ifdef SSRAYTRACE_DEBUG
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);
#else
var SSR: vec3f=textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb;var color: vec4f=textureSample(mainSampler,textureSamplerSampler,input.vUV);var reflectivity: vec4f=textureSample(reflectivitySampler,reflectivitySamplerSampler,input.vUV);
#ifndef SSR_DISABLE_REFLECTIVITY_TEST
if (max(reflectivity.r,max(reflectivity.g,reflectivity.b))<=uniforms.reflectivityThreshold) {fragmentOutputs.color=color;return fragmentOutputs;}
#endif
#ifdef SSR_INPUT_IS_GAMMA_SPACE
color=toLinearSpaceVec4(color);
#endif
#ifdef SSR_BLEND_WITH_FRESNEL
var texSize: vec2f= vec2f(textureDimensions(depthSampler,0));var csNormal: vec3f=textureLoad(normalSampler,vec2<i32>(input.vUV*texSize),0).xyz;
#ifdef SSR_DECODE_NORMAL
csNormal=csNormal*2.0-1.0;
#endif
#ifdef SSR_NORMAL_IS_IN_WORLDSPACE
csNormal=(uniforms.view*vec4f(csNormal,0.0)).xyz;
#endif
var depth: f32=textureLoad(depthSampler,vec2<i32>(input.vUV*texSize),0).r;
#ifdef SSRAYTRACE_SCREENSPACE_DEPTH
depth=linearizeDepth(depth,uniforms.nearPlaneZ,uniforms.farPlaneZ);
#endif
var csPosition: vec3f=computeViewPosFromUVDepth(input.vUV,depth,uniforms.projection,uniforms.invProjectionMatrix);var csViewDirection: vec3f=normalize(csPosition);var F0: vec3f=reflectivity.rgb;var fresnel: vec3f=fresnelSchlickGGXVec3(max(dot(csNormal,-csViewDirection),0.0),F0, vec3f(1.));var reflectionMultiplier: vec3f=clamp(pow(fresnel*uniforms.strength, vec3f(uniforms.reflectionSpecularFalloffExponent)),vec3f(0.0),vec3f(1.0));
#else
var reflectionMultiplier: vec3f=clamp(pow(reflectivity.rgb*uniforms.strength, vec3f(uniforms.reflectionSpecularFalloffExponent)),vec3f(0.0),vec3f(1.0));
#endif
var colorMultiplier: vec3f=1.0-reflectionMultiplier;var finalColor: vec3f=(color.rgb*colorMultiplier)+(SSR*reflectionMultiplier);
#ifdef SSR_OUTPUT_IS_GAMMA_SPACE
finalColor=toGammaSpaceVec3(finalColor);
#endif
fragmentOutputs.color= vec4f(finalColor,color.a);
#endif
}
`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["screenSpaceReflection2BlurCombinerPixelShaderWGSL",0,{name:c,shader:d}])},714280,100118,a=>{"use strict";var b=a.i(771997),c=a.i(100641),d=a.i(192305),e=a.i(719984),f=a.i(880627);class g{static extractMinAndMaxIndexed(a,b,c,d,e,f){for(let g=c;g<c+d;g++){let c=3*b[g],d=a[c],h=a[c+1],i=a[c+2];e.minimizeInPlaceFromFloats(d,h,i),f.maximizeInPlaceFromFloats(d,h,i)}}static extractMinAndMax(a,b,c,d,e,f){for(let g=b,h=b*d;g<b+c;g++,h+=d){let b=a[h],c=a[h+1],d=a[h+2];e.minimizeInPlaceFromFloats(b,c,d),f.maximizeInPlaceFromFloats(b,c,d)}}}function h(a,b,c,d,f=null){let i=new e.Vector3(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),j=new e.Vector3(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);return g.extractMinAndMaxIndexed(a,b,c,d,i,j),f&&(i.x-=i.x*f.x+f.y,i.y-=i.y*f.x+f.y,i.z-=i.z*f.x+f.y,j.x+=j.x*f.x+f.y,j.y+=j.y*f.x+f.y,j.z+=j.z*f.x+f.y),{minimum:i,maximum:j}}function i(a,b,c,d=null,f){let h=new e.Vector3(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),j=new e.Vector3(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);return f||(f=3),g.extractMinAndMax(a,b,c,f,h,j),d&&(h.x-=h.x*d.x+d.y,h.y-=h.y*d.x+d.y,h.z-=h.z*d.x+d.y,j.x+=j.x*d.x+d.y,j.y+=j.y*d.x+d.y,j.z+=j.z*d.x+d.y),{minimum:h,maximum:j}}function j(a,b){let c=i(a,0,a.length/3),d=c.maximum.subtract(c.minimum).scale(.5).add(c.minimum),f=new e.Vector3,g=new e.Vector3,h=new e.Vector3,j=new e.Vector3,k=new e.Vector3,l=new e.Vector3,m=new e.Vector3;for(let c=0;c<b.length;c+=3){let i=b[c],n=b[c+1],o=b[c+2];f.fromArray(a,3*i),g.fromArray(a,3*n),h.fromArray(a,3*o),g.subtractToRef(f,j),h.subtractToRef(f,k),e.Vector3.CrossToRef(j,k,l),l.normalize();let p=f.x+g.x+h.x,q=f.y+g.y+h.y,r=f.z+g.z+h.z;m.set(p/3,q/3,r/3),m.subtractInPlace(d),m.normalize(),e.Vector3.Dot(l,m)>=0&&(b[c]=o,b[c+2]=i)}}(0,d.__decorate)([f.nativeOverride.filter((...[a,b])=>!Array.isArray(a)&&!Array.isArray(b))],g,"extractMinAndMaxIndexed",null),(0,d.__decorate)([f.nativeOverride.filter((...[a])=>!Array.isArray(a))],g,"extractMinAndMax",null),a.s(["FixFlippedFaces",()=>j,"extractMinAndMax",()=>i,"extractMinAndMaxIndexed",()=>h],100118);var k=a.i(625562);a.i(399154),a.i(320125),a.i(937034),a.i(643926),a.i(554265),a.i(931041),a.i(252115),a.i(175163);let l="gpuTransformVertexShader",m=`attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
out vec3 outPosition;const mat4 identity=mat4(
vec4(1.0,0.0,0.0,0.0),
vec4(0.0,1.0,0.0,0.0),
vec4(0.0,0.0,1.0,0.0),
vec4(0.0,0.0,0.0,1.0)
);void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
mat4 finalWorld=identity;
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);outPosition=worldPos.xyz;}`;k.ShaderStore.ShadersStore[l]||(k.ShaderStore.ShadersStore[l]=m);let n="gpuTransformPixelShader",o=`#version 300 es
void main() {discard;}
`;k.ShaderStore.ShadersStore[n]||(k.ShaderStore.ShadersStore[n]=o);class p{constructor(a){this._buffers={},this._effects={},this._meshListCounter=0,this._engine=a}processAsync(a){return Array.isArray(a)||(a=[a]),this._meshListCounter=0,this._processMeshList(a),Promise.resolve()}_processMeshList(a){let d=this._engine.getCaps().parallelShaderCompile;this._engine.getCaps().parallelShaderCompile=void 0;for(let d=0;d<a.length;++d){let e,f=a[d];if(0===f.getTotalVertices()||!f.getVertexBuffer||!f.getVertexBuffer(b.VertexBuffer.PositionKind))continue;let g=[],h=[b.VertexBuffer.PositionKind];f&&f.useBones&&f.computeBonesUsingShaders&&f.skeleton?(h.push(b.VertexBuffer.MatricesIndicesKind),h.push(b.VertexBuffer.MatricesWeightsKind),f.numBoneInfluencers>4&&(h.push(b.VertexBuffer.MatricesIndicesExtraKind),h.push(b.VertexBuffer.MatricesWeightsExtraKind)),g.push("#define NUM_BONE_INFLUENCERS "+f.numBoneInfluencers),g.push("#define BONETEXTURE "+f.skeleton.isUsingTextureForMatrices),g.push("#define BonesPerMesh "+(f.skeleton.bones.length+1))):g.push("#define NUM_BONE_INFLUENCERS 0");let i=f.morphTargetManager?(0,c.PrepareDefinesAndAttributesForMorphTargets)(f.morphTargetManager,g,h,f,!0,!1,!1,!1,!1,!1):0,j=f.bakedVertexAnimationManager;j&&j.isEnabled&&(g.push("#define BAKED_VERTEX_ANIMATION_TEXTURE"),(0,c.PrepareAttributesForBakedVertexAnimation)(h,f,g));let k=g.join("\n");if(this._effects[k])e=this._effects[k];else{let a={attributes:h,uniformsNames:["boneTextureWidth","mBones","morphTargetInfluences","morphTargetCount","morphTargetTextureInfo","morphTargetTextureIndices","bakedVertexAnimationSettings","bakedVertexAnimationTextureSizeInverted","bakedVertexAnimationTime"],uniformBuffersNames:[],samplers:["boneSampler","morphTargets","bakedVertexAnimationTexture"],defines:k,fallbacks:null,onCompiled:null,onError:null,indexParameters:{maxSimultaneousMorphTargets:i},maxSimultaneousLights:0,transformFeedbackVaryings:["outPosition"]};e=this._engine.createEffect("gpuTransform",a,this._engine),this._effects[k]=e}this._compute(f,e)}this._engine.getCaps().parallelShaderCompile=d}_compute(a,d){let e,f=this._engine,g=a.getTotalVertices();if(this._buffers[a.uniqueId])e=this._buffers[a.uniqueId];else{let c=new Float32Array(3*g);e=new b.Buffer(a.getEngine(),c,!0,3),this._buffers[a.uniqueId]=e}d.getEngine().enableEffect(d),a._bindDirect(d,null,!0),(0,c.BindBonesParameters)(a,d),(0,c.BindMorphTargetParameters)(a,d),a.morphTargetManager&&a.morphTargetManager.isUsingTextureForTargets&&a.morphTargetManager._bind(d);let h=a.bakedVertexAnimationManager;h&&h.isEnabled&&a.bakedVertexAnimationManager?.bind(d,!1);let j=e.getData();if(f.bindTransformFeedbackBuffer(e.getBuffer()),f.setRasterizerState(!1),f.beginTransformFeedback(!0),f.drawArraysType(2,0,g),f.endTransformFeedback(),f.setRasterizerState(!0),f.readTransformFeedbackBuffer(j),f.bindTransformFeedbackBuffer(null),0===this._meshListCounter)a._refreshBoundingInfo(j,null);else{let b=a.getBoundingInfo().boundingBox,c=i(j,0,g);p._Min.copyFrom(b.minimum).minimizeInPlace(c.minimum),p._Max.copyFrom(b.maximum).maximizeInPlace(c.maximum),a._refreshBoundingInfoDirect({minimum:p._Min,maximum:p._Max})}}registerMeshListAsync(a){return Array.isArray(a)||(a=[a]),this._meshList=a,this._meshListCounter=0,Promise.resolve()}processMeshList(){0!==this._meshList.length&&(this._processMeshList(this._meshList),this._meshListCounter++)}fetchResultsForMeshListAsync(){return this._meshListCounter=0,Promise.resolve()}dispose(){for(let a in this._buffers)this._buffers[a].dispose();this._buffers={},this._effects={},this._engine=null}}p._Min=new e.Vector3,p._Max=new e.Vector3,a.s(["TransformFeedbackBoundingHelper",()=>p],714280)},42211,a=>{"use strict";var b=a.i(625562);let c="iblShadowVoxelTracingPixelShader",d=`#define PI 3.1415927
varying vUV: vec2f;
#define DISABLE_UNIFORMITY_ANALYSIS
var depthSampler: texture_2d<f32>;var worldNormalSampler : texture_2d<f32>;var blueNoiseSampler: texture_2d<f32>;var icdfSamplerSampler: sampler;var icdfSampler: texture_2d<f32>;var voxelGridSamplerSampler: sampler;var voxelGridSampler: texture_3d<f32>;
#ifdef COLOR_SHADOWS
var iblSamplerSampler: sampler;var iblSampler: texture_cube<f32>;
#endif
uniform shadowParameters: vec4f;
#define SHADOWdirs uniforms.shadowParameters.x
#define SHADOWframe uniforms.shadowParameters.y
#define SHADOWenvRot uniforms.shadowParameters.w
uniform voxelBiasParameters : vec4f;
#define highestMipLevel uniforms.voxelBiasParameters.z
uniform sssParameters: vec4f;
#define SSSsamples uniforms.sssParameters.x
#define SSSstride uniforms.sssParameters.y
#define SSSmaxDistance uniforms.sssParameters.z
#define SSSthickness uniforms.sssParameters.w
uniform shadowOpacity: vec4f;uniform projMtx: mat4x4f;uniform viewMtx: mat4x4f;uniform invProjMtx: mat4x4f;uniform invViewMtx: mat4x4f;uniform wsNormalizationMtx: mat4x4f;uniform invVPMtx: mat4x4f;
#define PI 3.1415927
#define GOLD 0.618034
struct AABB3f {m_min: vec3f,
m_max: vec3f,};struct Ray {orig: vec3f,
dir: vec3f,
dir_rcp: vec3f,
t_min: f32,
t_max: f32,};fn make_ray(origin: vec3f,direction: vec3f,tmin: f32,
tmax: f32)->Ray {var ray: Ray;ray.orig=origin;ray.dir=direction;ray.dir_rcp=1.0f/direction;ray.t_min=tmin;ray.t_max=tmax;return ray;}
fn ray_box_intersection(aabb: AABB3f,ray: Ray ,
distance_near: ptr<function,f32>,distance_far: ptr<function,f32>)->bool{var tbot: vec3f=ray.dir_rcp*(aabb.m_min-ray.orig);var ttop: vec3f=ray.dir_rcp*(aabb.m_max-ray.orig);var tmin: vec3f=min(ttop,tbot);var tmax: vec3f=max(ttop,tbot);*distance_near=max(ray.t_min,max(tmin.x,max(tmin.y,tmin.z)));*distance_far=min(ray.t_max,min(tmax.x,min(tmax.y,tmax.z)));return *distance_near<=*distance_far;}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
struct VoxelMarchDiagnosticInfo {heat: f32,
voxel_intersect_coords: vec3i,};
#endif
fn hash(i: u32)->u32 {var temp=i ^ (i>>16u);temp*=0x7FEB352Du;temp ^= temp>>15u;temp*=0x846CA68Bu;temp ^= temp>>16u;return temp;}
fn uintBitsToFloat(x: u32)->f32 {return bitcast<f32>(x);}
fn uint2float(i: u32)->f32 {return uintBitsToFloat(0x3F800000u | (i>>9u))-1.0;}
fn uv_to_normal(uv: vec2f)->vec3f {var N: vec3f;var uvRange: vec2f=uv;var theta: f32=uvRange.x*2.0*PI;var phi: f32=uvRange.y*PI;N.x=cos(theta)*sin(phi);N.z=sin(theta)*sin(phi);N.y=cos(phi);return N;}
fn plasticSequence(rstate: u32)->vec2f {return vec2f(uint2float(rstate*3242174889u),
uint2float(rstate*2447445414u));}
fn goldenSequence(rstate: u32)->f32 {return uint2float(rstate*2654435769u);}
fn distanceSquared(a: vec2f,b: vec2f)->f32 {var diff: vec2f=a-b;return dot(diff,diff);}
fn genTB(N: vec3f,T: ptr<function,vec3f>,B: ptr<function,vec3f>) {var s: f32=select(1.0,-1.0,N.z<0.0);var a: f32=-1.0/(s+N.z);var b: f32=N.x*N.y*a;*T= vec3f(1.0+s*N.x*N.x*a,s*b,-s*N.x);*B= vec3f(b,s+N.y*N.y*a,-N.y);}
fn lessThan(x: vec3f,y: vec3f)->vec3<bool> {return x<y;}
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
fn anyHitVoxels(ray_vs: Ray,
voxel_march_diagnostic_info: ptr<function,VoxelMarchDiagnosticInfo>)->bool {
#else
fn anyHitVoxels(ray_vs: Ray)->bool {
#endif
var stack=array<i32,24>(); 
var invD: vec3f=ray_vs.dir_rcp;var D: vec3f=ray_vs.dir;var O: vec3f=ray_vs.orig;var negD=vec3i(lessThan(D, vec3f(0,0,0)));var voxel0: i32=negD.x | (negD.y<<1) | (negD.z<<2);var t0: vec3f=-O*invD;var t1=(vec3f(1.0)-O)*invD;var maxLod: i32= i32(highestMipLevel);var stackLevel: i32=0;
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
var steps: u32=0u;
#endif
stack[stackLevel]=maxLod<<24;stackLevel++;while (stackLevel>0) {stackLevel=stackLevel-1;var elem: i32=stack[stackLevel];var Coords: vec4i =
vec4i(elem & 0xFF,(elem>>8) & 0xFF,(elem>>16) & 0xFF,elem>>24);if (Coords.w==0) {
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
*voxel_march_diagnostic_info.heat= f32(steps)/24.0;
#endif
return true;}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
++steps;
#endif
var invRes: f32=exp2(f32(Coords.w-maxLod));var bbmin: vec3f=invRes*vec3f(Coords.xyz+negD);var bbmax: vec3f=invRes*vec3f(Coords.xyz-negD+vec3i(1));var mint: vec3f=mix(t0,t1,bbmin);var maxt: vec3f=mix(t0,t1,bbmax);var midt: vec3f=0.5*(mint+maxt);mint.x=max(0.0,mint.x);midt.x=max(0.0,midt.x);var nodeMask: u32= u32(
round(textureLoad(voxelGridSampler,Coords.xyz,Coords.w).x*255.0));Coords.w--;var voxelBit: u32=u32(voxel0);Coords=vec4i((Coords.xyz<<vec3u(1))+negD,Coords.w);var packedCoords: i32 =
Coords.x | (Coords.y<<8) | (Coords.z<<16) | (Coords.w<<24);if (max(mint.x,max(mint.y,mint.z))<min(midt.x,min(midt.y,midt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}
voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(midt.x,max(mint.y,mint.z))<min(maxt.x,min(midt.y,midt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}
voxelBit ^= 0x2;packedCoords ^= 0x00100;if (max(midt.x,max(midt.y,mint.z))<min(maxt.x,min(maxt.y,midt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}
voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(mint.x,max(midt.y,mint.z))<min(midt.x,min(maxt.y,midt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}
voxelBit ^= 0x4;packedCoords ^= 0x10000;if (max(mint.x,max(midt.y,midt.z))<min(midt.x,min(maxt.y,maxt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}
voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(midt.x,max(midt.y,midt.z))<min(maxt.x,min(maxt.y,maxt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}
voxelBit ^= 0x2;packedCoords ^= 0x00100;if (max(midt.x,max(mint.y,midt.z))<min(maxt.x,min(midt.y,maxt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}
voxelBit ^= 0x1;packedCoords ^= 0x00001;if (max(mint.x,max(mint.y,midt.z))<min(midt.x,min(midt.y,maxt.z)) &&
((1u<<voxelBit) & nodeMask) != 0) {stack[stackLevel]=packedCoords;stackLevel++;}}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
*voxel_march_diagnostic_info.heat= f32(steps)/24.0;
#endif
return false;}
fn linearizeDepth(depth: f32,near: f32,far: f32)->f32 {return (near*far)/(far-depth*(far-near));}
fn screenSpaceShadow(csOrigin: vec3f,csDirection: vec3f,csZBufferSize: vec2f,
nearPlaneZ: f32,farPlaneZ: f32,noise: f32)->f32 {
#ifdef RIGHT_HANDED
var csZDir : f32=-1.0;
#else 
var csZDir : f32=1.0;
#endif
var ssSamples: f32=SSSsamples;var ssMaxDist: f32=SSSmaxDistance;var ssStride: f32=SSSstride;var ssThickness: f32=SSSthickness;var rayLength: f32 =
select(ssMaxDist,(nearPlaneZ-csOrigin.z)/csDirection.z,
csZDir*(csOrigin.z+ssMaxDist*csDirection.z)<csZDir*nearPlaneZ);var csEndPoint: vec3f=csOrigin+rayLength*csDirection;var H0: vec4f=uniforms.projMtx*vec4f(csOrigin,1.0);var H1: vec4f=uniforms.projMtx*vec4f(csEndPoint,1.0);var Z0=vec2f(csOrigin.z ,1.0)/H0.w;var Z1=vec2f(csEndPoint.z,1.0)/H1.w;var P0=csZBufferSize*(0.5*H0.xy*Z0.y+0.5);var P1=csZBufferSize*(0.5*H1.xy*Z1.y+0.5);P1+= vec2f(select(0.0,0.01,distanceSquared(P0,P1)<0.0001));var delta: vec2f=P1-P0;var permute: bool=false;if (abs(delta.x)<abs(delta.y)) {permute=true;P0=P0.yx;P1=P1.yx;delta=delta.yx;}
var stepDirection: f32=sign(delta.x);var invdx: f32=stepDirection/delta.x;var dP: vec2f=ssStride* vec2f(stepDirection,invdx*delta.y);var dZ: vec2f=ssStride*invdx*(Z1-Z0);var opacity: f32=0.0;var P: vec2f=P0+noise*dP;var Z: vec2f=Z0+noise*dZ;var end: f32=P1.x*stepDirection;var rayZMax=csZDir*Z.x/Z.y;var sceneDepth=rayZMax;Z+=dZ;for (var stepCount: f32=0.0; 
opacity<1.0 && P.x*stepDirection<end && sceneDepth>0.0 && stepCount<ssSamples;stepCount+=1) { 
var coords=vec2i(select(P,P.yx,permute));sceneDepth=textureLoad(depthSampler,coords,0).x;sceneDepth=linearizeDepth(sceneDepth,nearPlaneZ,farPlaneZ);sceneDepth=csZDir*sceneDepth;if (sceneDepth<=0.0) {break;}
var rayZMin: f32=rayZMax;rayZMax=csZDir*Z.x/Z.y;opacity+=max(opacity,step(rayZMax,sceneDepth+ssThickness)*step(sceneDepth,rayZMin));P+=dP;Z+=dZ;}
return opacity;}
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
fn voxelShadow(wsOrigin: vec3f,wsDirection: vec3f,wsNormal: vec3f,
DitherNoise: vec2f,
voxel_march_diagnostic_info: ptr<function,VoxelMarchDiagnosticInfo>)->f32 {
#else
fn voxelShadow(wsOrigin: vec3f,wsDirection: vec3f,wsNormal: vec3f,
DitherNoise: vec2f)->f32 {
#endif
var vxResolution: f32=f32(textureDimensions(voxelGridSampler,0).x);var T: vec3f;var B: vec3f;genTB(wsDirection,&T,&B);var DitherXY: vec2f=sqrt(DitherNoise.x)* vec2f(cos(2.0*PI*DitherNoise.y),
sin(2.0*PI*DitherNoise.y));var Dithering : vec3f=(uniforms.voxelBiasParameters.x*wsNormal +
uniforms.voxelBiasParameters.y*wsDirection +
DitherXY.x*T+DitherXY.y*B) /
vxResolution;var O: vec3f=0.5*wsOrigin+0.5+Dithering;var ray_vs=make_ray(O,wsDirection,0.0,10.0);var voxel_aabb: AABB3f;voxel_aabb.m_min=vec3f(0);voxel_aabb.m_max=vec3f(1);var near: f32=0;var far: f32=0;if (!ray_box_intersection(voxel_aabb,ray_vs,&near,&far)) {return 0.0;}
ray_vs.t_min=max(ray_vs.t_min,near);ray_vs.t_max=min(ray_vs.t_max,far);
#if VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
return select(0.0f,1.0f,anyHitVoxels(ray_vs,voxel_march_diagnostic_info));
#else
return select(0.0f,1.0f,anyHitVoxels(ray_vs));
#endif
}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var nbDirs=u32(SHADOWdirs);var frameId=u32(SHADOWframe);var envRot: f32=SHADOWenvRot;var Resolution: vec2f= vec2f(textureDimensions(depthSampler,0));var currentPixel=vec2i(fragmentInputs.vUV*Resolution);var GlobalIndex =
(frameId*u32(Resolution.y)+u32(currentPixel.y))*u32(Resolution.x) +
u32(currentPixel.x);var N : vec3f=textureLoad(worldNormalSampler,currentPixel,0).xyz;if (length(N)<0.01) {fragmentOutputs.color=vec4f(1.0,1.0,0.0,1.0);return fragmentOutputs;}
var normalizedRotation: f32=envRot/(2.0*PI);var depth : f32=textureLoad(depthSampler,currentPixel,0).x;
#ifndef IS_NDC_HALF_ZRANGE
depth=depth*2.0-1.0;
#endif
var temp : vec2f=(vec2f(currentPixel)+vec2f(0.5))*2.0/Resolution -
vec2f(1.0);var VP : vec4f=uniforms.invProjMtx*vec4f(temp.x,-temp.y,depth,1.0);VP/=VP.w;N=normalize(N);var noise : vec3f=textureLoad(blueNoiseSampler,currentPixel & vec2i(0xFF),0).xyz;noise.z=fract(noise.z+goldenSequence(frameId*nbDirs));
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
var heat: f32=0.0f;
#endif
var shadowAccum: f32=0.001;var specShadowAccum: f32=0.001;var sampleWeight : f32=0.001;
#ifdef COLOR_SHADOWS
var totalLight: vec3f=vec3f(0.001);var shadowedLight: vec3f=vec3f(0.0);
#endif
for (var i: u32=0; i<nbDirs; i++) {var dirId: u32=nbDirs*GlobalIndex+i;var L: vec4f;var T: vec2f;{var r: vec2f=plasticSequence(frameId*nbDirs+i);r=fract(r+ vec2f(2.0)*abs(noise.xy- vec2f(0.5)));T.x=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2f(r.x,0.0),0.0).x;T.y=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2f(T.x,r.y),0.0).y;L= vec4f(uv_to_normal(vec2f(T.x-normalizedRotation,T.y)),0);
#ifndef RIGHT_HANDED
L.z*=-1.0;
#endif
}
#ifdef COLOR_SHADOWS
var lightDir: vec3f=uv_to_normal(vec2f(1.0-fract(T.x+0.25),T.y));var ibl: vec3f=textureSampleLevel(iblSampler,iblSamplerSampler,lightDir,0.0).xyz;var pdf: f32=textureSampleLevel(icdfSampler,icdfSamplerSampler,T,0.0).z;
#endif
var cosNL: f32=dot(N,L.xyz);var opacity: f32=0.0;if (cosNL>0.0) {var VP2: vec4f=VP;VP2.y*=-1.0;var unormWP : vec4f=uniforms.invViewMtx*VP2;var WP: vec3f=(uniforms.wsNormalizationMtx*unormWP).xyz;var vxNoise: vec2f=vec2f(uint2float(hash(dirId*2)),uint2float(hash(dirId*2+1)));
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
VoxelMarchDiagnosticInfo voxel_march_diagnostic_info;opacity=max(opacity,
uniforms.shadowOpacity.x*voxelShadow(WP,L.xyz,N,vxNoise,
voxel_march_diagnostic_info));heat+=voxel_march_diagnostic_info.heat;
#else
opacity =
max(opacity,uniforms.shadowOpacity.x*voxelShadow(WP,L.xyz,N,vxNoise));
#endif
var VL : vec3f=(uniforms.viewMtx*L).xyz;
#ifdef RIGHT_HANDED
var nearPlaneZ: f32=-2.0*uniforms.projMtx[3][2]/(uniforms.projMtx[2][2]-1.0); 
var farPlaneZ: f32=-uniforms.projMtx[3][2]/(uniforms.projMtx[2][2]+1.0);
#else
var nearPlaneZ: f32=-2.0*uniforms.projMtx[3][2]/(uniforms.projMtx[2][2]+1.0); 
var farPlaneZ: f32=-uniforms.projMtx[3][2]/(uniforms.projMtx[2][2]-1.0);
#endif
var ssShadow: f32=uniforms.shadowOpacity.y *
screenSpaceShadow(VP2.xyz,VL,Resolution,nearPlaneZ,farPlaneZ,
abs(2.0*noise.z-1.0));opacity=max(opacity,ssShadow);
#ifdef COLOR_SHADOWS
var light: vec3f=select(vec3f(0.0),vec3f(cosNL)/vec3f(pdf)*ibl,pdf>1e-6);shadowedLight+=light*opacity;totalLight+=light;
#else
var rcos: f32=1.0-cosNL;shadowAccum+=(1.0-opacity*(1.0-pow(rcos,8.0)));sampleWeight+=1.0;var VR : vec3f=abs((uniforms.viewMtx*vec4f(reflect(-L.xyz,N),0.0)).xyz);specShadowAccum+=max(1.0-(opacity*pow(VR.z,8.0)),0.0);
#endif
}
noise.z=fract(noise.z+GOLD);}
#ifdef COLOR_SHADOWS
var shadow: vec3f=(totalLight-shadowedLight)/totalLight;var maxShadow: f32=max(max(shadow.x,max(shadow.y,shadow.z)),1.0);fragmentOutputs.color=vec4f(shadow/maxShadow,1.0);
#else
#ifdef VOXEL_MARCH_DIAGNOSTIC_INFO_OPTION
fragmentOutputs.color =
vec4f(shadowAccum/sampleWeight,specShadowAccum/sampleWeight,heat/sampleWeight,1.0);
#else
fragmentOutputs.color=vec4f(shadowAccum/sampleWeight,specShadowAccum/sampleWeight,0.0,1.0);
#endif
#endif
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["iblShadowVoxelTracingPixelShaderWGSL",0,{name:c,shader:d}])},530035,a=>{"use strict";var b=a.i(304396),c=a.i(779438),d=a.i(503102),e=a.i(719984),f=a.i(994060),g=a.i(308124);class h extends b.FlowGraphCachedOperationBlock{constructor(a,b,d){super(b,d);for(let b=0;b<a;b++)this.registerDataInput(`input_${b}`,c.RichTypeNumber,0)}}class i extends d.FlowGraphBlock{constructor(a,b,d){super(d),this.registerDataInput("input",b);for(let b=0;b<a;b++)this.registerDataOutput(`output_${b}`,c.RichTypeNumber,0)}}class j extends h{constructor(a){super(2,c.RichTypeVector2,a)}_doOperation(a){a._hasExecutionVariable(this,"cachedVector")||a._setExecutionVariable(this,"cachedVector",new e.Vector2);let b=a._getExecutionVariable(this,"cachedVector",null);return b.set(this.getDataInput("input_0").getValue(a),this.getDataInput("input_1").getValue(a)),b}getClassName(){return"FlowGraphCombineVector2Block"}}(0,f.RegisterClass)("FlowGraphCombineVector2Block",j);class k extends h{constructor(a){super(3,c.RichTypeVector3,a)}_doOperation(a){a._hasExecutionVariable(this,"cachedVector")||a._setExecutionVariable(this,"cachedVector",new e.Vector3);let b=a._getExecutionVariable(this,"cachedVector",null);return b.set(this.getDataInput("input_0").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_2").getValue(a)),b}getClassName(){return"FlowGraphCombineVector3Block"}}(0,f.RegisterClass)("FlowGraphCombineVector3Block",k);class l extends h{constructor(a){super(4,c.RichTypeVector4,a)}_doOperation(a){a._hasExecutionVariable(this,"cachedVector")||a._setExecutionVariable(this,"cachedVector",new e.Vector4);let b=a._getExecutionVariable(this,"cachedVector",null);return b.set(this.getDataInput("input_0").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_2").getValue(a),this.getDataInput("input_3").getValue(a)),b}getClassName(){return"FlowGraphCombineVector4Block"}}(0,f.RegisterClass)("FlowGraphCombineVector4Block",l);class m extends h{constructor(a){super(16,c.RichTypeMatrix,a)}_doOperation(a){a._hasExecutionVariable(this,"cachedMatrix")||a._setExecutionVariable(this,"cachedMatrix",new e.Matrix);let b=a._getExecutionVariable(this,"cachedMatrix",null);return this.config?.inputIsColumnMajor?b.set(this.getDataInput("input_0").getValue(a),this.getDataInput("input_4").getValue(a),this.getDataInput("input_8").getValue(a),this.getDataInput("input_12").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_5").getValue(a),this.getDataInput("input_9").getValue(a),this.getDataInput("input_13").getValue(a),this.getDataInput("input_2").getValue(a),this.getDataInput("input_6").getValue(a),this.getDataInput("input_10").getValue(a),this.getDataInput("input_14").getValue(a),this.getDataInput("input_3").getValue(a),this.getDataInput("input_7").getValue(a),this.getDataInput("input_11").getValue(a),this.getDataInput("input_15").getValue(a)):b.set(this.getDataInput("input_0").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_2").getValue(a),this.getDataInput("input_3").getValue(a),this.getDataInput("input_4").getValue(a),this.getDataInput("input_5").getValue(a),this.getDataInput("input_6").getValue(a),this.getDataInput("input_7").getValue(a),this.getDataInput("input_8").getValue(a),this.getDataInput("input_9").getValue(a),this.getDataInput("input_10").getValue(a),this.getDataInput("input_11").getValue(a),this.getDataInput("input_12").getValue(a),this.getDataInput("input_13").getValue(a),this.getDataInput("input_14").getValue(a),this.getDataInput("input_15").getValue(a)),b}getClassName(){return"FlowGraphCombineMatrixBlock"}}(0,f.RegisterClass)("FlowGraphCombineMatrixBlock",m);class n extends h{constructor(a){super(4,c.RichTypeMatrix2D,a)}_doOperation(a){a._hasExecutionVariable(this,"cachedMatrix")||a._setExecutionVariable(this,"cachedMatrix",new g.FlowGraphMatrix2D);let b=a._getExecutionVariable(this,"cachedMatrix",null),c=this.config?.inputIsColumnMajor?[this.getDataInput("input_0").getValue(a),this.getDataInput("input_2").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_3").getValue(a)]:[this.getDataInput("input_0").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_2").getValue(a),this.getDataInput("input_3").getValue(a)];return b.fromArray(c),b}getClassName(){return"FlowGraphCombineMatrix2DBlock"}}(0,f.RegisterClass)("FlowGraphCombineMatrix2DBlock",n);class o extends h{constructor(a){super(9,c.RichTypeMatrix3D,a)}_doOperation(a){a._hasExecutionVariable(this,"cachedMatrix")||a._setExecutionVariable(this,"cachedMatrix",new g.FlowGraphMatrix3D);let b=a._getExecutionVariable(this,"cachedMatrix",null),c=this.config?.inputIsColumnMajor?[this.getDataInput("input_0").getValue(a),this.getDataInput("input_3").getValue(a),this.getDataInput("input_6").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_4").getValue(a),this.getDataInput("input_7").getValue(a),this.getDataInput("input_2").getValue(a),this.getDataInput("input_5").getValue(a),this.getDataInput("input_8").getValue(a)]:[this.getDataInput("input_0").getValue(a),this.getDataInput("input_1").getValue(a),this.getDataInput("input_2").getValue(a),this.getDataInput("input_3").getValue(a),this.getDataInput("input_4").getValue(a),this.getDataInput("input_5").getValue(a),this.getDataInput("input_6").getValue(a),this.getDataInput("input_7").getValue(a),this.getDataInput("input_8").getValue(a)];return b.fromArray(c),b}getClassName(){return"FlowGraphCombineMatrix3DBlock"}}(0,f.RegisterClass)("FlowGraphCombineMatrix3DBlock",o);class p extends i{constructor(a){super(2,c.RichTypeVector2,a)}_updateOutputs(a){let b=this.getDataInput("input")?.getValue(a);b||(b=e.Vector2.Zero(),this.getDataInput("input").setValue(b,a)),this.getDataOutput("output_0").setValue(b.x,a),this.getDataOutput("output_1").setValue(b.y,a)}getClassName(){return"FlowGraphExtractVector2Block"}}(0,f.RegisterClass)("FlowGraphExtractVector2Block",p);class q extends i{constructor(a){super(3,c.RichTypeVector3,a)}_updateOutputs(a){let b=this.getDataInput("input")?.getValue(a);b||(b=e.Vector3.Zero(),this.getDataInput("input").setValue(b,a)),this.getDataOutput("output_0").setValue(b.x,a),this.getDataOutput("output_1").setValue(b.y,a),this.getDataOutput("output_2").setValue(b.z,a)}getClassName(){return"FlowGraphExtractVector3Block"}}(0,f.RegisterClass)("FlowGraphExtractVector3Block",q);class r extends i{constructor(a){super(4,c.RichTypeVector4,a)}_updateOutputs(a){let b=this.getDataInput("input")?.getValue(a);b||(b=e.Vector4.Zero(),this.getDataInput("input").setValue(b,a)),this.getDataOutput("output_0").setValue(b.x,a),this.getDataOutput("output_1").setValue(b.y,a),this.getDataOutput("output_2").setValue(b.z,a),this.getDataOutput("output_3").setValue(b.w,a)}getClassName(){return"FlowGraphExtractVector4Block"}}(0,f.RegisterClass)("FlowGraphExtractVector4Block",r);class s extends i{constructor(a){super(16,c.RichTypeMatrix,a)}_updateOutputs(a){let b=this.getDataInput("input")?.getValue(a);b||(b=e.Matrix.Identity(),this.getDataInput("input").setValue(b,a));for(let c=0;c<16;c++)this.getDataOutput(`output_${c}`).setValue(b.m[c],a)}getClassName(){return"FlowGraphExtractMatrixBlock"}}(0,f.RegisterClass)("FlowGraphExtractMatrixBlock",s);class t extends i{constructor(a){super(4,c.RichTypeMatrix2D,a)}_updateOutputs(a){let b=this.getDataInput("input")?.getValue(a);b||(b=new g.FlowGraphMatrix2D,this.getDataInput("input").setValue(b,a));for(let c=0;c<4;c++)this.getDataOutput(`output_${c}`).setValue(b.m[c],a)}getClassName(){return"FlowGraphExtractMatrix2DBlock"}}(0,f.RegisterClass)("FlowGraphExtractMatrix2DBlock",t);class u extends i{constructor(a){super(9,c.RichTypeMatrix3D,a)}_updateOutputs(a){let b=this.getDataInput("input")?.getValue(a);b||(b=new g.FlowGraphMatrix3D,this.getDataInput("input").setValue(b,a));for(let c=0;c<9;c++)this.getDataOutput(`output_${c}`).setValue(b.m[c],a)}getClassName(){return"FlowGraphExtractMatrix3DBlock"}}(0,f.RegisterClass)("FlowGraphExtractMatrix3DBlock",u),a.s(["FlowGraphCombineMatrix2DBlock",()=>n,"FlowGraphCombineMatrix3DBlock",()=>o,"FlowGraphCombineMatrixBlock",()=>m,"FlowGraphCombineVector2Block",()=>j,"FlowGraphCombineVector3Block",()=>k,"FlowGraphCombineVector4Block",()=>l,"FlowGraphExtractMatrix2DBlock",()=>t,"FlowGraphExtractMatrix3DBlock",()=>u,"FlowGraphExtractMatrixBlock",()=>s,"FlowGraphExtractVector2Block",()=>p,"FlowGraphExtractVector3Block",()=>q,"FlowGraphExtractVector4Block",()=>r])},951423,267651,302004,a=>{"use strict";var b=a.i(719984);class c{static ConvertPanoramaToCubemap(a,b,c,d,e=!1,f=!0){if(!a)throw"ConvertPanoramaToCubemap: input cannot be null";let g=0;if(a.length!=b*c*3)if(a.length!=b*c*4)throw"ConvertPanoramaToCubemap: input size is wrong";else g=4;else g=3;return{front:this.CreateCubemapTexture(d,this.FACE_FRONT,a,b,c,e,f,g),back:this.CreateCubemapTexture(d,this.FACE_BACK,a,b,c,e,f,g),left:this.CreateCubemapTexture(d,this.FACE_LEFT,a,b,c,e,f,g),right:this.CreateCubemapTexture(d,this.FACE_RIGHT,a,b,c,e,f,g),up:this.CreateCubemapTexture(d,this.FACE_UP,a,b,c,e,f,g),down:this.CreateCubemapTexture(d,this.FACE_DOWN,a,b,c,e,f,g),size:d,type:1,format:4,gammaSpace:!1}}static CreateCubemapTexture(a,b,c,d,e,f,g,h){let i=new Float32Array(new ArrayBuffer(a*a*12)),j=f?Math.max(1,Math.round(d/4/a)):1,k=1/j,l=k*k,m=b[1].subtract(b[0]).scale(k/a),n=b[3].subtract(b[2]).scale(k/a),o=1/a,p=0;for(let f=0;f<a;f++)for(let q=0;q<j;q++){let q=b[0],r=b[2];for(let b=0;b<a;b++)for(let k=0;k<j;k++){let j=r.subtract(q).scale(p).add(q);j.normalize();let k=this.CalcProjectionSpherical(j,c,d,e,h,g);i[f*a*3+3*b+0]+=k.r*l,i[f*a*3+3*b+1]+=k.g*l,i[f*a*3+3*b+2]+=k.b*l,q=q.add(m),r=r.add(n)}p+=o*k}return i}static CalcProjectionSpherical(a,b,c,d,e,f){let g=Math.atan2(a.z,a.x),h=Math.acos(a.y);for(;g<-Math.PI;)g+=2*Math.PI;for(;g>Math.PI;)g-=2*Math.PI;let i=g/Math.PI,j=h/Math.PI,k=Math.round((i=.5*i+.5)*c);k<0?k=0:k>=c&&(k=c-1);let l=Math.round(j*d);l<0?l=0:l>=d&&(l=d-1);let m=f?d-l-1:l;return{r:b[m*c*e+k*e+0],g:b[m*c*e+k*e+1],b:b[m*c*e+k*e+2]}}}function d(a,b,c,d,e,f){if(e>0){var g;e=(g=e-136)>1023?898846567431158e293*Math.pow(2,g-1023):g<-1074?5e-324*Math.pow(2,g+1074):+Math.pow(2,g),a[f+0]=b*e,a[f+1]=c*e,a[f+2]=d*e}else a[f+0]=0,a[f+1]=0,a[f+2]=0}function e(a,b){let c="",d="";for(let e=b;e<a.length-b&&"\n"!=(d=String.fromCharCode(a[e]));e++)c+=d;return c}function f(a){let b=0,c=0,d=e(a,0);if("#"!=d[0]||"?"!=d[1])throw"Bad HDR Format.";let f=!1,g=!1,h=0;do h+=d.length+1,"FORMAT=32-bit_rle_rgbe"==(d=e(a,h))?g=!0:0==d.length&&(f=!0);while(!f)if(!g)throw"HDR Bad header format, unsupported FORMAT";h+=d.length+1,d=e(a,h);let i=/^-Y (.*) \+X (.*)$/g.exec(d);if(!i||i.length<3)throw"HDR Bad header format, no size";if(c=parseInt(i[2]),b=parseInt(i[1]),c<8||c>32767)throw"HDR Bad header format, unsupported size";return{height:b,width:c,dataPosition:h+=d.length+1}}function g(a,b,d=!1){let e=new Uint8Array(a),h=f(e),j=i(e,h);return c.ConvertPanoramaToCubemap(j,h.width,h.height,b,d)}function h(a,b){return i(a,b)}function i(a,b){let c,e,f,g,h,i=b.height,j=b.width,k=b.dataPosition,l=0,m=0,n=0,o=new Uint8Array(new ArrayBuffer(4*j)),p=new Float32Array(new ArrayBuffer(b.width*b.height*12));for(;i>0;){if(c=a[k++],e=a[k++],f=a[k++],g=a[k++],2!=c||2!=e||128&f||b.width<8||b.width>32767)return function(a,b){let c,e,f,g=b.height,h=b.width,i=b.dataPosition,j=new Float32Array(new ArrayBuffer(b.width*b.height*12));for(;g>0;){for(f=0;f<b.width;f++)c=a[i++],e=a[i++],d(j,c,e,a[i++],a[i++],(b.height-g)*h*3+3*f);g--}return j}(a,b);if((f<<8|g)!=j)throw"HDR Bad header format, wrong scan line width";for(n=0,l=0;n<4;n++)for(m=(n+1)*j;l<m;)if(c=a[k++],e=a[k++],c>128){if(0==(h=c-128)||h>m-l)throw"HDR Bad Format, bad scanline data (run)";for(;h-- >0;)o[l++]=e}else{if(0==(h=c)||h>m-l)throw"HDR Bad Format, bad scanline data (non-run)";if(o[l++]=e,--h>0)for(let b=0;b<h;b++)o[l++]=a[k++]}for(n=0;n<j;n++)c=o[n],e=o[n+j],d(p,c,e,f=o[n+2*j],g=o[n+3*j],(b.height-i)*j*3+3*n);i--}return p}c.FACE_LEFT=[new b.Vector3(-1,-1,-1),new b.Vector3(1,-1,-1),new b.Vector3(-1,1,-1),new b.Vector3(1,1,-1)],c.FACE_RIGHT=[new b.Vector3(1,-1,1),new b.Vector3(-1,-1,1),new b.Vector3(1,1,1),new b.Vector3(-1,1,1)],c.FACE_FRONT=[new b.Vector3(1,-1,-1),new b.Vector3(1,-1,1),new b.Vector3(1,1,-1),new b.Vector3(1,1,1)],c.FACE_BACK=[new b.Vector3(-1,-1,1),new b.Vector3(-1,-1,-1),new b.Vector3(-1,1,1),new b.Vector3(-1,1,-1)],c.FACE_DOWN=[new b.Vector3(1,1,-1),new b.Vector3(1,1,1),new b.Vector3(-1,1,-1),new b.Vector3(-1,1,1)],c.FACE_UP=[new b.Vector3(-1,-1,-1),new b.Vector3(-1,-1,1),new b.Vector3(1,-1,-1),new b.Vector3(1,-1,1)],a.s(["PanoramaToCubeMapTools",()=>c],267651),a.s(["GetCubeMapTextureData",()=>g,"RGBE_ReadHeader",()=>f,"RGBE_ReadPixels",()=>h],302004);class j{constructor(){this.supportCascades=!1}loadCubeData(){throw".hdr not supported in Cube."}loadData(a,b,c){let d=new Uint8Array(a.buffer,a.byteOffset,a.byteLength),e=f(d),g=i(d,e),h=e.width*e.height,j=new Float32Array(4*h);for(let a=0;a<h;a+=1)j[4*a]=g[3*a],j[4*a+1]=g[3*a+1],j[4*a+2]=g[3*a+2],j[4*a+3]=1;c(e.width,e.height,b.generateMipMaps,!1,()=>{let a=b.getEngine();b.type=1,b.format=5,b._gammaSpace=!1,a._uploadDataToTextureDirectly(b,j)})}}a.s(["_HDRTextureLoader",()=>j],951423)},689140,440787,a=>{"use strict";var b=a.i(392511),c=a.i(397197),d=a.i(518369);class e extends d.AbstractSound{constructor(a,b,c){super(a,b,c),this._preloadedInstances=[]}get preloadCount(){return this._options.preloadCount??1}get preloadCompletedCount(){return this._preloadedInstances.length}preloadInstanceAsync(){let a=this._createInstance();return this._addPreloadedInstance(a),a.preloadedPromise}async preloadInstancesAsync(a){for(let b=0;b<a;b++)this.preloadInstanceAsync();await Promise.all(this._preloadedInstances.map(async a=>await a.preloadedPromise))}play(a={}){let b;if(5===this.state)return void this.resume();this.preloadCompletedCount>0?((b=this._preloadedInstances[0]).startOffset=this.startOffset,this._removePreloadedInstance(b)):b=this._createInstance();let c=()=>{3===b.state&&(this._stopExcessInstances(),b.onStateChangedObservable.removeCallback(c))};b.onStateChangedObservable.add(c),a.startOffset??(a.startOffset=this.startOffset),a.loop??(a.loop=this.loop),a.volume??(a.volume=1),this._beforePlay(b),b.play(a),this._afterPlay(b)}stop(){if(this._setState(1),this._instances)for(let a of Array.from(this._instances))a.stop()}_addPreloadedInstance(a){this._preloadedInstances.includes(a)||this._preloadedInstances.push(a)}_removePreloadedInstance(a){let b=this._preloadedInstances.indexOf(a);-1!==b&&this._preloadedInstances.splice(b,1)}}a.s(["StreamingSound",()=>e],440787);var f=a.i(608568),g=a.i(871978);class h extends g._AbstractSoundInstance{constructor(a){super(a),this.onReadyObservable=new f.Observable,this.preloadedPromise=new Promise((a,b)=>{this._rejectPreloadedProimse=b,this._resolvePreloadedPromise=a}),this.onErrorObservable.add(this._rejectPreloadedProimse),this.onReadyObservable.add(this._resolvePreloadedPromise)}set startOffset(a){this._options.startOffset=a}dispose(){super.dispose(),this.onErrorObservable.clear(),this.onReadyObservable.clear(),this._resolvePreloadedPromise()}}var i=a.i(633619),j=a.i(470165),k=a.i(995796),l=a.i(221553),m=a.i(736394);class n extends e{constructor(a,b,c){super(a,b,c),this._stereo=null,this._options={autoplay:c.autoplay??!1,loop:c.loop??!1,maxInstances:c.maxInstances??1/0,preloadCount:c.preloadCount??1,startOffset:c.startOffset??0},this._subGraph=new n._SubGraph(this)}async _initAsync(a,b){let c=this.engine._audioContext;if(!(c instanceof AudioContext))throw Error("Unsupported audio context type.");this._audioContext=c,this._source=a,b.outBus?this.outBus=b.outBus:!1!==b.outBusAutoDefault&&(await this.engine.isReadyPromise,this.outBus=this.engine.defaultMainBus),await this._subGraph.initAsync(b),(0,i._HasSpatialAudioOptions)(b)&&this._initSpatialProperty(),this.preloadCount&&await this.preloadInstancesAsync(this.preloadCount),b.autoplay&&this.play(b),this.engine._addSound(this)}get _inNode(){return this._subGraph._inNode}get _outNode(){return this._subGraph._outNode}get stereo(){return this._stereo??(this._stereo=new j._StereoAudio(this._subGraph))}dispose(){super.dispose(),this._stereo=null,this._subGraph.dispose(),this.engine._removeSound(this)}getClassName(){return"_WebAudioStreamingSound"}_createInstance(){return new o(this,this._options)}_connect(a){return!!super._connect(a)&&(a._inNode&&this._outNode?.connect(a._inNode),!0)}_disconnect(a){return!!super._disconnect(a)&&(a._inNode&&this._outNode?.disconnect(a._inNode),!0)}_createSpatialProperty(a,b){return new m._SpatialWebAudio(this._subGraph,a,b)}_getOptions(){return this._options}}n._SubGraph=class extends l._WebAudioBusAndSoundSubGraph{get _downstreamNodes(){return this._owner._downstreamNodes??null}get _upstreamNodes(){return this._owner._upstreamNodes??null}};class o extends h{constructor(a,b){if(super(a),this._currentTimeChangedWhilePaused=!1,this._enginePlayTime=1/0,this._enginePauseTime=0,this._isReady=!1,this._isReadyPromise=new Promise((a,b)=>{this._resolveIsReadyPromise=a,this._rejectIsReadyPromise=b}),this._onCanPlayThrough=()=>{this._isReady=!0,this._resolveIsReadyPromise(this._mediaElement),this.onReadyObservable.notifyObservers(this)},this._onEnded=()=>{this.onEndedObservable.notifyObservers(this),this.dispose()},this._onError=a=>{this._setState(4),this.onErrorObservable.notifyObservers(a),this._rejectIsReadyPromise(a),this.dispose()},this._onEngineStateChanged=()=>{"running"===this.engine.state&&(this._options.loop&&2===this.state&&this.play(),this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged))},this._onUserGesture=()=>{this.play()},this._options=b,this._volumeNode=new GainNode(a._audioContext),"string"==typeof a._source)this._initFromUrl(a._source);else if(Array.isArray(a._source))this._initFromUrls(a._source);else if(a._source instanceof HTMLMediaElement)this._initFromMediaElement(a._source);else throw Error(`Invalid streaming sound source (${a._source}).`)}get currentTime(){if(1===this._state)return 0;let a=5===this._state?0:this.engine.currentTime-this._enginePlayTime;return this._enginePauseTime+a+this._options.startOffset}set currentTime(a){let b=2===this._state||3===this._state;b&&(this._mediaElement.pause(),this._state=1),this._options.startOffset=a,b?this.play({startOffset:a}):5===this._state&&(this._currentTimeChangedWhilePaused=!0)}get _outNode(){return this._volumeNode}get startTime(){return 1===this._state?0:this._enginePlayTime}dispose(){for(let a of(super.dispose(),this.stop(),this._sourceNode?.disconnect(this._volumeNode),this._sourceNode=null,this._mediaElement.removeEventListener("error",this._onError),this._mediaElement.removeEventListener("ended",this._onEnded),this._mediaElement.removeEventListener("canplaythrough",this._onCanPlayThrough),Array.from(this._mediaElement.children)))this._mediaElement.removeChild(a);this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged),this.engine.userGestureObservable.removeCallback(this._onUserGesture)}play(a={}){if(3===this._state)return;void 0!==a.loop&&(this._options.loop=a.loop),this._mediaElement.loop=this._options.loop;let b=a.startOffset;this._currentTimeChangedWhilePaused?(b=this._options.startOffset,this._currentTimeChangedWhilePaused=!1):5===this._state&&(b=this.currentTime+this._options.startOffset),b&&b>0&&(this._mediaElement.currentTime=b),this._volumeNode.gain.value=a.volume??1,this._play()}pause(){(2===this._state||3===this._state)&&(this._setState(5),this._enginePauseTime+=this.engine.currentTime-this._enginePlayTime,this._mediaElement.pause())}resume(){5===this._state?this.play():this._currentTimeChangedWhilePaused&&this.play()}stop(){1!==this._state&&this._stop()}getClassName(){return"_WebAudioStreamingSoundInstance"}_connect(a){return!!super._connect(a)&&(a instanceof n&&a._inNode&&this._outNode?.connect(a._inNode),!0)}_disconnect(a){return!!super._disconnect(a)&&(a instanceof n&&a._inNode&&this._outNode?.disconnect(a._inNode),!0)}_initFromMediaElement(a){if(c.Tools.SetCorsBehavior(a.currentSrc,a),a.controls=!1,a.loop=this._options.loop,a.preload="auto",a.addEventListener("canplaythrough",this._onCanPlayThrough,{once:!0}),a.addEventListener("ended",this._onEnded,{once:!0}),a.addEventListener("error",this._onError,{once:!0}),a.load(),this._sourceNode=new MediaElementAudioSourceNode(this._sound._audioContext,{mediaElement:a}),this._sourceNode.connect(this._volumeNode),!this._connect(this._sound))throw Error("Connect failed");this._mediaElement=a}_initFromUrl(a){let b=new Audio((0,k._CleanUrl)(a));this._initFromMediaElement(b)}_initFromUrls(a){let b=new Audio;for(let c of a){let a=document.createElement("source");a.src=(0,k._CleanUrl)(c),b.appendChild(a)}this._initFromMediaElement(b)}_play(){if(this._setState(2),!this._isReady)return void this._playWhenReady();if(2===this._state)if("running"===this.engine.state){let a=this._mediaElement.play();this._enginePlayTime=this.engine.currentTime,this._setState(3),a.catch(()=>{this._setState(4),this._options.loop&&this.engine.userGestureObservable.addOnce(this._onUserGesture)})}else this._options.loop?this.engine.stateChangedObservable.add(this._onEngineStateChanged):(this.stop(),this._setState(4))}_playWhenReady(){this._isReadyPromise.then(()=>{this._play()}).catch(()=>{b.Logger.Error("Streaming sound instance failed to play"),this._setState(4)})}_stop(){this._mediaElement.pause(),this._setState(1),this._onEnded(),this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged)}}a.s(["_WebAudioStreamingSound",()=>n],689140)},650884,119907,a=>{"use strict";var b,c,d=a.i(397197),e=a.i(45436),f=a.i(386219);function g(){let a=null;onmessage=b=>{if("init"===b.data.action){if(b.data.url)try{importScripts(b.data.url)}catch(a){postMessage({action:"error",error:a})}a||(a=BASIS({wasmBinary:b.data.wasmBinary})),null!==a&&a.then(a=>{BASIS=a,a.initializeBasis(),postMessage({action:"init"})})}else if("transcode"===b.data.action){var c,d;let a,e=b.data.config,f=b.data.imageData,g=new BASIS.BasisFile(f),h=function(a){let b=a.getHasAlpha(),c=a.getNumImages(),d=[];for(let b=0;b<c;b++){let c={levels:[]},e=a.getNumLevels(b);for(let d=0;d<e;d++){let e={width:a.getImageWidth(b,d),height:a.getImageHeight(b,d)};c.levels.push(e)}d.push(c)}return{hasAlpha:b,images:d}}(g),i=b.data.ignoreSupportedFormats?null:(c=b.data.config,d=h,a=null,c.supportedCompressionFormats&&(a=c.supportedCompressionFormats.astc?10:c.supportedCompressionFormats.bc7?6:c.supportedCompressionFormats.s3tc?d.hasAlpha?3:2:c.supportedCompressionFormats.pvrtc?d.hasAlpha?9:8:c.supportedCompressionFormats.etc2?1:14*!c.supportedCompressionFormats.etc1),a),j=!1;null===i&&(j=!0,i=h.hasAlpha?3:2);let k=!0;g.startTranscoding()||(k=!1);let l=[];for(let a=0;a<h.images.length&&k;a++){let b=h.images[a];if(void 0===e.loadSingleImage||e.loadSingleImage===a){let c=b.levels.length;!1===e.loadMipmapLevels&&(c=1);for(let d=0;d<c;d++){let c=b.levels[d],e=function(a,b,c,d,e){let f=new Uint8Array(a.getImageTranscodedSizeInBytes(b,c,d));return a.transcodeImage(f,b,c,d,1,0)?(e&&(f=function(a,b,c,d){let e=new Uint16Array(4),f=new Uint16Array(c*d),g=c/4,h=d/4;for(let b=0;b<h;b++)for(let d=0;d<g;d++){let h=0+8*(b*g+d);e[0]=a[h]|a[h+1]<<8,e[1]=a[h+2]|a[h+3]<<8,e[2]=(2*(31&e[0])+ +(31&e[1]))/3|(2*(2016&e[0])+ +(2016&e[1]))/3&2016|(2*(63488&e[0])+ +(63488&e[1]))/3&63488,e[3]=(2*(31&e[1])+ +(31&e[0]))/3|(2*(2016&e[1])+ +(2016&e[0]))/3&2016|(2*(63488&e[1])+ +(63488&e[0]))/3&63488;for(let g=0;g<4;g++){let i=a[h+4+g],j=(4*b+g)*c+4*d;f[j++]=e[3&i],f[j++]=e[i>>2&3],f[j++]=e[i>>4&3],f[j++]=e[i>>6&3]}}return f}(f,0,a.getImageWidth(b,c)+3&-4,a.getImageHeight(b,c)+3&-4)),f):null}(g,a,d,i,j);if(!e){k=!1;break}c.transcodedPixels=e,l.push(c.transcodedPixels.buffer)}}}g.close(),g.delete(),j&&(i=-1),k?postMessage({action:"transcode",success:k,id:b.data.id,fileInfo:h,format:i},l):postMessage({action:"transcode",success:k,id:b.data.id})}}}async function h(a,b,c){return await new Promise((e,f)=>{let g=b=>{"init"===b.data.action?(a.removeEventListener("message",g),e(a)):"error"===b.data.action&&f(b.data.error||"error initializing worker")};a.addEventListener("message",g),a.postMessage({action:"init",url:c?d.Tools.GetBabylonScriptURL(c):void 0,wasmBinary:b},[b])})}(b=c||(c={}))[b.cTFETC1=0]="cTFETC1",b[b.cTFETC2=1]="cTFETC2",b[b.cTFBC1=2]="cTFBC1",b[b.cTFBC3=3]="cTFBC3",b[b.cTFBC4=4]="cTFBC4",b[b.cTFBC5=5]="cTFBC5",b[b.cTFBC7=6]="cTFBC7",b[b.cTFPVRTC1_4_RGB=8]="cTFPVRTC1_4_RGB",b[b.cTFPVRTC1_4_RGBA=9]="cTFPVRTC1_4_RGBA",b[b.cTFASTC_4x4=10]="cTFASTC_4x4",b[b.cTFATC_RGB=11]="cTFATC_RGB",b[b.cTFATC_RGBA_INTERPOLATED_ALPHA=12]="cTFATC_RGBA_INTERPOLATED_ALPHA",b[b.cTFRGBA32=13]="cTFRGBA32",b[b.cTFRGB565=14]="cTFRGB565",b[b.cTFBGR565=15]="cTFBGR565",b[b.cTFRGBA4444=16]="cTFRGBA4444",b[b.cTFFXT1_RGB=17]="cTFFXT1_RGB",b[b.cTFPVRTC2_4_RGB=18]="cTFPVRTC2_4_RGB",b[b.cTFPVRTC2_4_RGBA=19]="cTFPVRTC2_4_RGBA",b[b.cTFETC2_EAC_R11=20]="cTFETC2_EAC_R11",b[b.cTFETC2_EAC_RG11=21]="cTFETC2_EAC_RG11";let i={JSModuleURL:`${d.Tools._DefaultCdnUrl}/basisTranscoder/1/basis_transcoder.js`,WasmModuleURL:`${d.Tools._DefaultCdnUrl}/basisTranscoder/1/basis_transcoder.wasm`},j=null,k=null,l=0,m=async()=>(j||(j=new Promise((a,b)=>{k?a(k):d.Tools.LoadFileAsync(d.Tools.GetBabylonScriptURL(i.WasmModuleURL)).then(c=>{if("function"!=typeof URL)return b("Basis transcoder requires an environment with a URL constructor");h(k=new Worker(URL.createObjectURL(new Blob([`(${g})()`],{type:"application/javascript"}))),c,i.JSModuleURL).then(a,b)}).catch(b)})),await j),n=async(a,b)=>{let c=a instanceof ArrayBuffer?new Uint8Array(a):a;return await new Promise((a,d)=>{m().then(()=>{let e=l++,f=b=>{"transcode"===b.data.action&&b.data.id===e&&(k.removeEventListener("message",f),b.data.success?a(b.data):d("Transcode is not supported on this device"))};k.addEventListener("message",f);let g=new Uint8Array(c.byteLength);g.set(new Uint8Array(c.buffer,c.byteOffset,c.byteLength)),k.postMessage({action:"transcode",id:e,imageData:g,config:b,ignoreSupportedFormats:!1},[g.buffer])},a=>{d(a)})})},o=(a,b)=>{let c=b._gl?.TEXTURE_2D;a.isCube&&(c=b._gl?.TEXTURE_CUBE_MAP),b._bindTextureDirectly(c,a,!0)},p=(a,b)=>{let g=a.getEngine();for(let h=0;h<b.fileInfo.images.length;h++){let i=b.fileInfo.images[h].levels[0];if(a._invertVScale=a.invertY,-1===b.format||b.format===c.cTFRGB565)if(a.type=10,a.format=4,g._features.basisNeedsPOT&&(Math.log2(i.width)%1!=0||Math.log2(i.height)%1!=0)){let b=new f.InternalTexture(g,2);a._invertVScale=a.invertY,b.type=10,b.format=4,b.width=i.width+3&-4,b.height=i.height+3&-4,o(b,g),g._uploadDataToTextureDirectly(b,new Uint16Array(i.transcodedPixels.buffer),h,0,4,!0),g._rescaleTexture(b,a,g.scenes[0],g._getInternalFormat(4),()=>{g._releaseTexture(b),o(a,g)})}else a._invertVScale=!a.invertY,a.width=i.width+3&-4,a.height=i.height+3&-4,a.samplingMode=2,o(a,g),g._uploadDataToTextureDirectly(a,new Uint16Array(i.transcodedPixels.buffer),h,0,4,!0);else{a.width=i.width,a.height=i.height,a.generateMipMaps=b.fileInfo.images[h].levels.length>1;let c=q.GetInternalFormatFromBasisFormat(b.format,g);a.format=c,o(a,g);let f=b.fileInfo.images[h].levels;for(let b=0;b<f.length;b++){let d=f[b];g._uploadCompressedDataToTextureDirectly(a,c,d.width,d.height,d.transcodedPixels,h,b)}g._features.basisNeedsPOT&&(Math.log2(a.width)%1!=0||Math.log2(a.height)%1!=0)&&(d.Tools.Warn("Loaded .basis texture width and height are not a power of two. Texture wrapping will be set to Texture.CLAMP_ADDRESSMODE as other modes are not supported with non power of two dimensions in webGL 1."),a._cachedWrapU=e.Texture.CLAMP_ADDRESSMODE,a._cachedWrapV=e.Texture.CLAMP_ADDRESSMODE)}}},q={JSModuleURL:i.JSModuleURL,WasmModuleURL:i.WasmModuleURL,GetInternalFormatFromBasisFormat:(a,b)=>{let d;switch(a){case c.cTFETC1:d=36196;break;case c.cTFBC1:d=33776;break;case c.cTFBC4:d=33779;break;case c.cTFASTC_4x4:d=37808;break;case c.cTFETC2:d=37496;break;case c.cTFBC7:d=36492}if(void 0===d)throw"The chosen Basis transcoder format is not currently supported";return d},TranscodeAsync:n,LoadTextureFromTranscodeResult:p};Object.defineProperty(q,"JSModuleURL",{get:function(){return i.JSModuleURL},set:function(a){i.JSModuleURL=a}}),Object.defineProperty(q,"WasmModuleURL",{get:function(){return i.WasmModuleURL},set:function(a){i.WasmModuleURL=a}}),a.s(["LoadTextureFromTranscodeResult",0,p,"TranscodeAsync",0,n],119907);class r{constructor(){this.supportCascades=!1}loadCubeData(a,b,c,e,f){if(Array.isArray(a))return;let g=b.getEngine().getCaps();n(a,{supportedCompressionFormats:{etc1:!!g.etc1,s3tc:!!g.s3tc,pvrtc:!!g.pvrtc,etc2:!!g.etc2,astc:!!g.astc,bc7:!!g.bptc}}).then(a=>{let c=a.fileInfo.images[0].levels.length>1&&b.generateMipMaps;p(b,a),b.getEngine()._setCubeMapTextureParams(b,c),b.isReady=!0,b.onLoadedObservable.notifyObservers(b),b.onLoadedObservable.clear(),e&&e()}).catch(a=>{d.Tools.Warn("Failed to transcode Basis file, transcoding may not be supported on this device"),b.isReady=!0,f&&f(a)})}loadData(a,b,c){let e=b.getEngine().getCaps();n(a,{supportedCompressionFormats:{etc1:!!e.etc1,s3tc:!!e.s3tc,pvrtc:!!e.pvrtc,etc2:!!e.etc2,astc:!!e.astc,bc7:!!e.bptc}}).then(a=>{let d=a.fileInfo.images[0].levels[0],e=a.fileInfo.images[0].levels.length>1&&b.generateMipMaps;c(d.width,d.height,e,-1!==a.format,()=>{p(b,a)})}).catch(a=>{d.Tools.Warn("Failed to transcode Basis file, transcoding may not be supported on this device"),d.Tools.Warn(`Failed to transcode Basis file: ${a}`),c(0,0,!1,!1,()=>{},!0)})}}a.s(["_BasisTextureLoader",()=>r],650884)},253177,955775,a=>{"use strict";var b=a.i(503102),c=a.i(779438),d=a.i(994060),e=a.i(465679),f=a.i(71870),g=a.i(719984),h=a.i(210312),i=a.i(664731);function j(a,b){return`{X: ${a.x.toFixed(b)} Y: ${a.y.toFixed(b)}}`}function k(a,b){return a.x*b.x+a.y*b.y+a.z*b.z}function l(a,b){let c,d,e;return Math.sqrt((c=b.x-a.x,d=b.y-a.y,c*c+d*d+(e=b.z-a.z)*e))}function m(a,b){return b.x=a.x,b.y=a.y,b.z=a.z,b}function n(a,b){return`{X: ${a.x.toFixed(b)} Y: ${a.y.toFixed(b)} Z: ${a.z.toFixed(b)}}`}function o(a,b){return a.x*b.x+a.y*b.y+a.z*b.z+a.w*b.w}function p(a,b){return`{X: ${a.x.toFixed(b)} Y: ${a.y.toFixed(b)} Z: ${a.z.toFixed(b)} W: ${a.w.toFixed(b)}}`}a.s(["Vector2ToFixed",()=>j,"Vector3CopyToRef",()=>m,"Vector3Distance",()=>l,"Vector3Dot",()=>k,"Vector3ToFixed",()=>n,"Vector4Dot",()=>o,"Vector4ToFixed",()=>p],955775);let q="cachedOperationAxis",r="cachedOperationAngle",s="cachedExecutionId";class t extends f.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeAny,c.RichTypeNumber,a=>this._polymorphicLength(a),"FlowGraphLengthBlock",a)}_polymorphicLength(a){switch((0,h._GetClassNameOf)(a)){case"Vector2":case"Vector3":case"Vector4":case"Quaternion":return a.length();default:throw Error(`Cannot compute length of value ${a}`)}}}(0,d.RegisterClass)("FlowGraphLengthBlock",t);class u extends f.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeAny,c.RichTypeAny,a=>this._polymorphicNormalize(a),"FlowGraphNormalizeBlock",a)}_polymorphicNormalize(a){let b;switch((0,h._GetClassNameOf)(a)){case"Vector2":case"Vector3":case"Vector4":case"Quaternion":return b=a.normalizeToNew(),this.config?.nanOnZeroLength&&0===a.length()&&b.setAll(NaN),b;default:throw Error(`Cannot normalize value ${a}`)}}}(0,d.RegisterClass)("FlowGraphNormalizeBlock",u);class v extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeAny,c.RichTypeAny,c.RichTypeNumber,(a,b)=>this._polymorphicDot(a,b),"FlowGraphDotBlock",a)}_polymorphicDot(a,b){switch((0,h._GetClassNameOf)(a)){case"Vector2":case"Vector3":case"Vector4":case"Quaternion":return a.dot(b);default:throw Error(`Cannot get dot product of ${a} and ${b}`)}}}(0,d.RegisterClass)("FlowGraphDotBlock",v);class w extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeVector3,c.RichTypeVector3,c.RichTypeVector3,(a,b)=>g.Vector3.Cross(a,b),"FlowGraphCrossBlock",a)}}(0,d.RegisterClass)("FlowGraphCrossBlock",w);class x extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeVector2,c.RichTypeNumber,c.RichTypeVector2,(a,b)=>a.rotate(b),"FlowGraphRotate2DBlock",a)}}(0,d.RegisterClass)("FlowGraphRotate2DBlock",x);class y extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeVector3,c.RichTypeQuaternion,c.RichTypeVector3,(a,b)=>a.applyRotationQuaternion(b),"FlowGraphRotate3DBlock",a)}}function z(a,b){switch((0,h._GetClassNameOf)(a)){case"Vector2":case"Vector3":return b.transformVector(a);case"Vector4":return new g.Vector4(a.x*b.m[0]+a.y*b.m[1]+a.z*b.m[2]+a.w*b.m[3],a.x*b.m[4]+a.y*b.m[5]+a.z*b.m[6]+a.w*b.m[7],a.x*b.m[8]+a.y*b.m[9]+a.z*b.m[10]+a.w*b.m[11],a.x*b.m[12]+a.y*b.m[13]+a.z*b.m[14]+a.w*b.m[15]);default:throw Error(`Cannot transform value ${a}`)}}(0,d.RegisterClass)("FlowGraphRotate3DBlock",y);class A extends e.FlowGraphBinaryOperationBlock{constructor(a){const b=a?.vectorType||"Vector3";super((0,c.getRichTypeByFlowGraphType)(b),(0,c.getRichTypeByFlowGraphType)("Vector2"===b?"Matrix2D":"Vector3"===b?"Matrix3D":"Matrix"),(0,c.getRichTypeByFlowGraphType)(b),z,"FlowGraphTransformVectorBlock",a)}}(0,d.RegisterClass)("FlowGraphTransformVectorBlock",A);class B extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeVector3,c.RichTypeMatrix,c.RichTypeVector3,(a,b)=>g.Vector3.TransformCoordinates(a,b),"FlowGraphTransformCoordinatesBlock",a)}}(0,d.RegisterClass)("FlowGraphTransformCoordinatesBlock",B);class C extends f.FlowGraphUnaryOperationBlock{constructor(a){super(c.RichTypeQuaternion,c.RichTypeQuaternion,a=>a.conjugate(),"FlowGraphConjugateBlock",a)}}(0,d.RegisterClass)("FlowGraphConjugateBlock",C);class D extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeQuaternion,c.RichTypeQuaternion,c.RichTypeNumber,(a,b)=>2*Math.acos((0,i.Clamp)(o(a,b),-1,1)),"FlowGraphAngleBetweenBlock",a)}}(0,d.RegisterClass)("FlowGraphAngleBetweenBlock",D);class E extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeVector3,c.RichTypeNumber,c.RichTypeQuaternion,(a,b)=>g.Quaternion.RotationAxis(a,b),"FlowGraphQuaternionFromAxisAngleBlock",a)}}(0,d.RegisterClass)("FlowGraphQuaternionFromAxisAngleBlock",E);class F extends b.FlowGraphBlock{constructor(a){super(a),this.a=this.registerDataInput("a",c.RichTypeQuaternion),this.axis=this.registerDataOutput("axis",c.RichTypeVector3),this.angle=this.registerDataOutput("angle",c.RichTypeNumber),this.isValid=this.registerDataOutput("isValid",c.RichTypeBoolean)}_updateOutputs(a){let b=a._getExecutionVariable(this,s,-1),c=a._getExecutionVariable(this,q,null),d=a._getExecutionVariable(this,r,null);if(null!=c&&null!=d&&b===a.executionId)this.axis.setValue(c,a),this.angle.setValue(d,a);else try{let{axis:b,angle:c}=this.a.getValue(a).toAxisAngle();a._setExecutionVariable(this,q,b),a._setExecutionVariable(this,r,c),a._setExecutionVariable(this,s,a.executionId),this.axis.setValue(b,a),this.angle.setValue(c,a),this.isValid.setValue(!0,a)}catch(b){this.isValid.setValue(!1,a)}}getClassName(){return"FlowGraphAxisAngleFromQuaternionBlock"}}(0,d.RegisterClass)("FlowGraphAxisAngleFromQuaternionBlock",F);class G extends e.FlowGraphBinaryOperationBlock{constructor(a){super(c.RichTypeVector3,c.RichTypeVector3,c.RichTypeQuaternion,(a,b)=>{var c,d,e;let f,h,j;return f=new g.Quaternion,c=a,d=b,e=f,h=g.Vector3.Cross(c,d),j=Math.acos((0,i.Clamp)(k(c,d),-1,1)),g.Quaternion.RotationAxisToRef(h,j,e),f},"FlowGraphQuaternionFromDirectionsBlock",a)}}a.s(["FlowGraphAngleBetweenBlock",()=>D,"FlowGraphAxisAngleFromQuaternionBlock",()=>F,"FlowGraphConjugateBlock",()=>C,"FlowGraphCrossBlock",()=>w,"FlowGraphDotBlock",()=>v,"FlowGraphLengthBlock",()=>t,"FlowGraphNormalizeBlock",()=>u,"FlowGraphQuaternionFromAxisAngleBlock",()=>E,"FlowGraphQuaternionFromDirectionsBlock",()=>G,"FlowGraphRotate2DBlock",()=>x,"FlowGraphRotate3DBlock",()=>y,"FlowGraphTransformBlock",()=>A,"FlowGraphTransformCoordinatesBlock",()=>B],253177)},585921,179352,a=>{"use strict";var b=a.i(625562);a.i(618072),a.i(115747),a.i(589762),a.i(604045),a.i(463068),a.i(830981),a.i(784075),a.i(36816),a.i(845386);let c="fresnelFunction",d=`#ifdef FRESNEL
fn computeFresnelTerm(viewDirection: vec3f,worldNormal: vec3f,bias: f32,power: f32)->f32
{let fresnelTerm: f32=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([],179352),a.i(630447),a.i(196025),a.i(850492),a.i(580887),a.i(782111),a.i(435),a.i(160815),a.i(842357),a.i(197011),a.i(89689),a.i(623876),a.i(670124),a.i(439654),a.i(410897),a.i(316972),a.i(852591);let e="defaultPixelShader",f=`#include<defaultUboDeclaration>
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#define CUSTOM_FRAGMENT_BEGIN
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#include<mainUVVaryingDeclaration>[1..7]
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<samplerFragmentDeclaration>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse,_SAMPLERNAME_,diffuse)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_SAMPLERNAME_,ambient)
#include<samplerFragmentDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_SAMPLERNAME_,opacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_SAMPLERNAME_,emissive)
#include<samplerFragmentDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_SAMPLERNAME_,lightmap)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#ifdef REFRACTION
#ifdef REFRACTIONMAP_3D
var refractionCubeSamplerSampler: sampler;var refractionCubeSampler: texture_cube<f32>;
#else
var refraction2DSamplerSampler: sampler;var refraction2DSampler: texture_2d<f32>;
#endif
#endif
#if defined(SPECULARTERM)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular,_SAMPLERNAME_,specular)
#endif
#include<fresnelFunction>
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
var reflectionCubeSamplerSampler: sampler;var reflectionCubeSampler: texture_cube<f32>;
#else
var reflection2DSamplerSampler: sampler;var reflection2DSampler: texture_2d<f32>;
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#endif
#include<reflectionFunction>
#endif
#include<imageProcessingDeclaration>
#include<imageProcessingFunctions>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f= vec4f(1.,1.,1.,1.);var diffuseColor: vec3f=uniforms.vDiffuseColor.rgb;var alpha: f32=uniforms.vDiffuseColor.a;
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f=normalize(cross(dpdx(fragmentInputs.vPositionW),dpdy(fragmentInputs.vPositionW)))* scene.vEyePosition.w;
#endif
#include<bumpFragment>
#ifdef TWOSIDEDLIGHTING
normalW=select(-normalW,normalW,fragmentInputs.frontFacing);
#endif
#ifdef DIFFUSE
baseColor=textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vDiffuseUV+uvOffset);
#if defined(ALPHATEST) && !defined(ALPHATEST_AFTERALLALPHACOMPUTATIONS)
if (baseColor.a<uniforms.alphaCutOff) {discard;}
#endif
#ifdef ALPHAFROMDIFFUSE
alpha*=baseColor.a;
#endif
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
baseColor=vec4f(baseColor.rgb*uniforms.vDiffuseInfos.y,baseColor.a);
#endif
#if defined(DECAL) && !defined(DECAL_AFTER_DETAIL)
var decalColor: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#include<decalFragment>(surfaceAlbedo,baseColor,GAMMADECAL,_GAMMADECAL_NOTUSED_)
#endif
#include<depthPrePass>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
#ifdef DETAIL
baseColor=vec4f(baseColor.rgb*2.0*mix(0.5,detailColor.r,uniforms.vDetailInfos.y),baseColor.a);
#endif
#if defined(DECAL) && defined(DECAL_AFTER_DETAIL)
var decalColor: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#include<decalFragment>(surfaceAlbedo,baseColor,GAMMADECAL,_GAMMADECAL_NOTUSED_)
#endif
#define CUSTOM_FRAGMENT_UPDATE_DIFFUSE
var baseAmbientColor: vec3f= vec3f(1.,1.,1.);
#ifdef AMBIENT
baseAmbientColor=textureSample(ambientSampler,ambientSamplerSampler,fragmentInputs.vAmbientUV+uvOffset).rgb*uniforms.vAmbientInfos.y;
#endif
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
var glossiness: f32=uniforms.vSpecularColor.a;var specularColor: vec3f=uniforms.vSpecularColor.rgb;
#ifdef SPECULARTERM
#ifdef SPECULAR
var specularMapColor: vec4f=textureSample(specularSampler,specularSamplerSampler,fragmentInputs.vSpecularUV+uvOffset);specularColor=specularMapColor.rgb;
#ifdef GLOSSINESS
glossiness=glossiness*specularMapColor.a;
#endif
#endif
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;
#ifdef SPECULARTERM
var specularBase: vec3f= vec3f(0.,0.,0.);
#endif
var shadow: f32=1.;var aggShadow: f32=0.;var numLights: f32=0.;
#ifdef LIGHTMAP
var lightmapColor: vec4f=textureSample(lightmapSampler,lightmapSamplerSampler,fragmentInputs.vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor=vec4f(fromRGBD(lightmapColor),lightmapColor.a);
#endif
lightmapColor=vec4f(lightmapColor.rgb*uniforms.vLightmapInfos.y,lightmapColor.a);
#endif
#include<lightFragment>[0..maxSimultaneousLights]
aggShadow=aggShadow/numLights;var refractionColor: vec4f= vec4f(0.,0.,0.,1.);
#ifdef REFRACTION
var refractionVector: vec3f=normalize(refract(-viewDirectionW,normalW,uniforms.vRefractionInfos.y));
#ifdef REFRACTIONMAP_3D
#ifdef USE_LOCAL_REFRACTIONMAP_CUBIC
refractionVector=parallaxCorrectNormal(fragmentInputs.vPositionW,refractionVector,uniforms.vRefractionSize,uniforms.vRefractionPosition);
#endif
refractionVector.y=refractionVector.y*uniforms.vRefractionInfos.w;var refractionLookup: vec4f=textureSample(refractionCubeSampler,refractionCubeSamplerSampler,refractionVector);if (dot(refractionVector,viewDirectionW)<1.0) {refractionColor=refractionLookup;}
#else
var vRefractionUVW: vec3f= (uniforms.refractionMatrix*(scene.view* vec4f(fragmentInputs.vPositionW+refractionVector*uniforms.vRefractionInfos.z,1.0))).xyz;var refractionCoords: vec2f=vRefractionUVW.xy/vRefractionUVW.z;refractionCoords.y=1.0-refractionCoords.y;refractionColor=textureSample(refraction2DSampler,refraction2DSamplerSampler,refractionCoords);
#endif
#ifdef RGBDREFRACTION
refractionColor=vec4f(fromRGBD(refractionColor),refractionColor.a);
#endif
#ifdef IS_REFRACTION_LINEAR
refractionColor=vec4f(toGammaSpaceVec3(refractionColor.rgb),refractionColor.a);
#endif
refractionColor=vec4f(refractionColor.rgb*uniforms.vRefractionInfos.x,refractionColor.a);
#endif
var reflectionColor: vec4f= vec4f(0.,0.,0.,1.);
#ifdef REFLECTION
var vReflectionUVW: vec3f=computeReflectionCoords( vec4f(fragmentInputs.vPositionW,1.0),normalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
vReflectionUVW=vec3f(vReflectionUVW.x,vReflectionUVW.y,vReflectionUVW.z*-1.0);
#endif
#ifdef REFLECTIONMAP_3D
#ifdef ROUGHNESS
var bias: f32=uniforms.vReflectionInfos.y;
#ifdef SPECULARTERM
#ifdef SPECULAR
#ifdef GLOSSINESS
bias*=(1.0-specularMapColor.a);
#endif
#endif
#endif
reflectionColor=textureSampleLevel(reflectionCubeSampler,reflectionCubeSamplerSampler,vReflectionUVW,bias);
#else
reflectionColor=textureSample(reflectionCubeSampler,reflectionCubeSamplerSampler,vReflectionUVW);
#endif
#else
var coords: vec2f=vReflectionUVW.xy;
#ifdef REFLECTIONMAP_PROJECTION
coords/=vReflectionUVW.z;
#endif
coords.y=1.0-coords.y;reflectionColor=textureSample(reflection2DSampler,reflection2DSamplerSampler,coords);
#endif
#ifdef RGBDREFLECTION
reflectionColor=vec4f(fromRGBD(reflectionColor),reflectionColor.a);
#endif
#ifdef IS_REFLECTION_LINEAR
reflectionColor=vec4f(toGammaSpaceVec3(reflectionColor.rgb),reflectionColor.a);
#endif
reflectionColor=vec4f(reflectionColor.rgb*uniforms.vReflectionInfos.x,reflectionColor.a);
#ifdef REFLECTIONFRESNEL
var reflectionFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.reflectionRightColor.a,uniforms.reflectionLeftColor.a);
#ifdef REFLECTIONFRESNELFROMSPECULAR
#ifdef SPECULARTERM
reflectionColor=vec4f(reflectionColor.rgb*specularColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*uniforms.reflectionRightColor.rgb,reflectionColor.a);
#else
reflectionColor=vec4f(reflectionColor.rgb*uniforms.reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*uniforms.reflectionRightColor.rgb,reflectionColor.a);
#endif
#else
reflectionColor=vec4f(reflectionColor.rgb*uniforms.reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*uniforms.reflectionRightColor.rgb,reflectionColor.a);
#endif
#endif
#endif
#ifdef REFRACTIONFRESNEL
var refractionFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.refractionRightColor.a,uniforms.refractionLeftColor.a);refractionColor=vec4f(refractionColor.rgb*uniforms.refractionLeftColor.rgb*(1.0-refractionFresnelTerm)+refractionFresnelTerm*uniforms.refractionRightColor.rgb,refractionColor.a);
#endif
#ifdef OPACITY
var opacityMap: vec4f=textureSample(opacitySampler,opacitySamplerSampler,fragmentInputs.vOpacityUV+uvOffset);
#ifdef OPACITYRGB
opacityMap=vec4f(opacityMap.rgb* vec3f(0.3,0.59,0.11),opacityMap.a);alpha*=(opacityMap.x+opacityMap.y+opacityMap.z)* uniforms.vOpacityInfos.y;
#else
alpha*=opacityMap.a*uniforms.vOpacityInfos.y;
#endif
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
#ifdef OPACITYFRESNEL
var opacityFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.opacityParts.z,uniforms.opacityParts.w);alpha+=uniforms.opacityParts.x*(1.0-opacityFresnelTerm)+opacityFresnelTerm*uniforms.opacityParts.y;
#endif
#ifdef ALPHATEST
#ifdef ALPHATEST_AFTERALLALPHACOMPUTATIONS
if (alpha<uniforms.alphaCutOff) {discard;}
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
var emissiveColor: vec3f=uniforms.vEmissiveColor;
#ifdef EMISSIVE
emissiveColor+=textureSample(emissiveSampler,emissiveSamplerSampler,fragmentInputs.vEmissiveUV+uvOffset).rgb*uniforms.vEmissiveInfos.y;
#endif
#ifdef EMISSIVEFRESNEL
var emissiveFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.emissiveRightColor.a,uniforms.emissiveLeftColor.a);emissiveColor*=uniforms.emissiveLeftColor.rgb*(1.0-emissiveFresnelTerm)+emissiveFresnelTerm*uniforms.emissiveRightColor.rgb;
#endif
#ifdef DIFFUSEFRESNEL
var diffuseFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.diffuseRightColor.a,uniforms.diffuseLeftColor.a);diffuseBase*=uniforms.diffuseLeftColor.rgb*(1.0-diffuseFresnelTerm)+diffuseFresnelTerm*uniforms.diffuseRightColor.rgb;
#endif
#ifdef EMISSIVEASILLUMINATION
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor+uniforms.vAmbientColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;
#else
#ifdef LINKEMISSIVEWITHDIFFUSE
var finalDiffuse: vec3f=clamp((diffuseBase+emissiveColor)*diffuseColor+uniforms.vAmbientColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;
#else
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor+emissiveColor+uniforms.vAmbientColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;
#endif
#endif
#ifdef SPECULARTERM
var finalSpecular: vec3f=specularBase*specularColor;
#ifdef SPECULAROVERALPHA
alpha=clamp(alpha+dot(finalSpecular, vec3f(0.3,0.59,0.11)),0.0,1.0);
#endif
#else
var finalSpecular: vec3f= vec3f(0.0);
#endif
#ifdef REFLECTIONOVERALPHA
alpha=clamp(alpha+dot(reflectionColor.rgb, vec3f(0.3,0.59,0.11)),0.0,1.0);
#endif
#ifdef EMISSIVEASILLUMINATION
var color: vec4f= vec4f(clamp(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+emissiveColor+refractionColor.rgb,0.0,1.0),alpha);
#else
var color: vec4f= vec4f(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+refractionColor.rgb,alpha);
#endif
#ifdef LIGHTMAP
#ifndef LIGHTMAPEXCLUDED
#ifdef USELIGHTMAPASSHADOWMAP
color=vec4f(color.rgb*lightmapColor.rgb,color.a);
#else
color=vec4f(color.rgb+lightmapColor.rgb,color.a);
#endif
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_FOG
color=vec4f(max(color.rgb,vec3f(0.)),color.a);
#include<logDepthFragment>
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
color=vec4f(toLinearSpaceVec3(color.rgb),color.a);
#else
#ifdef IMAGEPROCESSING
color=vec4f(toLinearSpaceVec3(color.rgb),color.a);color=applyImageProcessing(color);
#endif
#endif
color=vec4f(color.rgb,color.a*mesh.visibility);
#ifdef PREMULTIPLYALPHA
color=vec4f(color.rgb*color.a, color.a);
#endif
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#if SCENE_MRT_COUNT>0
var writeGeometryInfo: f32=select(0.0,1.0,color.a>0.4);var fragData: array<vec4<f32>,SCENE_MRT_COUNT>;
#ifdef PREPASS_COLOR
fragData[PREPASS_COLOR_INDEX]=color; 
#endif
#ifdef PREPASS_POSITION
fragData[PREPASS_POSITION_INDEX]=vec4f(fragmentInputs.vPositionW,writeGeometryInfo);
#endif
#ifdef PREPASS_LOCAL_POSITION
fragData[PREPASS_LOCAL_POSITION_INDEX]=vec4f(fragmentInputs.vPosition,writeGeometryInfo);
#endif
#ifdef PREPASS_VELOCITY
var a: vec2f=(fragmentInputs.vCurrentPosition.xy/fragmentInputs.vCurrentPosition.w)*0.5+0.5;var b: vec2f=(fragmentInputs.vPreviousPosition.xy/fragmentInputs.vPreviousPosition.w)*0.5+0.5;var velocity: vec2f=abs(a-b);velocity= vec2f(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;fragData[PREPASS_VELOCITY_INDEX]= vec4f(velocity,0.0,writeGeometryInfo);
#elif defined(PREPASS_VELOCITY_LINEAR)
var velocity : vec2f=vec2f(0.5)*((fragmentInputs.vPreviousPosition.xy/fragmentInputs.vPreviousPosition.w) -
(fragmentInputs.vCurrentPosition.xy/fragmentInputs.vCurrentPosition.w));fragData[PREPASS_VELOCITY_LINEAR_INDEX]=vec4f(velocity,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_IRRADIANCE
fragData[PREPASS_IRRADIANCE_INDEX]=vec4f(0.0,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_DEPTH
fragData[PREPASS_DEPTH_INDEX]=vec4f(fragmentInputs.vViewPos.z,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_SCREENSPACE_DEPTH
fragData[PREPASS_SCREENSPACE_DEPTH_INDEX]=vec4f(fragmentInputs.position.z,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
fragData[PREPASS_NORMALIZED_VIEW_DEPTH_INDEX]=vec4f(fragmentInputs.vNormViewDepth,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMAL
#ifdef PREPASS_NORMAL_WORLDSPACE
fragData[PREPASS_NORMAL_INDEX]=vec4f(normalW,writeGeometryInfo);
#else
fragData[PREPASS_NORMAL_INDEX]=vec4f(normalize((scene.view*vec4f(normalW,0.0)).rgb),writeGeometryInfo);
#endif
#endif
#ifdef PREPASS_WORLD_NORMAL
fragData[PREPASS_WORLD_NORMAL_INDEX]=vec4f(normalW*0.5+0.5,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO
fragData[PREPASS_ALBEDO_INDEX]=vec4f(baseColor.rgb,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
fragData[PREPASS_ALBEDO_SQRT_INDEX]=vec4f(sqrt(baseColor.rgb),writeGeometryInfo);
#endif
#ifdef PREPASS_REFLECTIVITY
#if defined(SPECULAR)
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(toLinearSpaceVec4(specularMapColor))*writeGeometryInfo; 
#else
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(toLinearSpaceVec3(specularColor),1.0)*writeGeometryInfo;
#endif
#endif
#if SCENE_MRT_COUNT>0
fragmentOutputs.fragData0=fragData[0];
#endif
#if SCENE_MRT_COUNT>1
fragmentOutputs.fragData1=fragData[1];
#endif
#if SCENE_MRT_COUNT>2
fragmentOutputs.fragData2=fragData[2];
#endif
#if SCENE_MRT_COUNT>3
fragmentOutputs.fragData3=fragData[3];
#endif
#if SCENE_MRT_COUNT>4
fragmentOutputs.fragData4=fragData[4];
#endif
#if SCENE_MRT_COUNT>5
fragmentOutputs.fragData5=fragData[5];
#endif
#if SCENE_MRT_COUNT>6
fragmentOutputs.fragData6=fragData[6];
#endif
#if SCENE_MRT_COUNT>7
fragmentOutputs.fragData7=fragData[7];
#endif
#endif
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=color;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+color.rgb*color.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-color.a));} else {fragmentOutputs.backColor+=color;}
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;b.ShaderStore.ShadersStoreWGSL[e]||(b.ShaderStore.ShadersStoreWGSL[e]=f),a.s(["defaultPixelShaderWGSL",0,{name:e,shader:f}],585921)},857890,a=>{"use strict";var b=a.i(625562);a.i(284660),a.i(142967);let c="openpbrUboDeclaration",d=`uniform vTangentSpaceParams: vec2f;uniform vLightingIntensity: vec4f;uniform pointSize: f32;uniform vDebugMode: vec2f;uniform cameraInfo: vec4f;uniform vReflectionInfos: vec2f;uniform reflectionMatrix: mat4x4f;uniform vReflectionMicrosurfaceInfos: vec3f;uniform vReflectionPosition: vec3f;uniform vReflectionSize: vec3f;uniform vReflectionFilteringInfo: vec2f;uniform vReflectionDominantDirection: vec3f;uniform vReflectionColor: vec3f;uniform vSphericalL00: vec3f;uniform vSphericalL1_1: vec3f;uniform vSphericalL10: vec3f;uniform vSphericalL11: vec3f;uniform vSphericalL2_2: vec3f;uniform vSphericalL2_1: vec3f;uniform vSphericalL20: vec3f;uniform vSphericalL21: vec3f;uniform vSphericalL22: vec3f;uniform vSphericalX: vec3f;uniform vSphericalY: vec3f;uniform vSphericalZ: vec3f;uniform vSphericalXX_ZZ: vec3f;uniform vSphericalYY_ZZ: vec3f;uniform vSphericalZZ: vec3f;uniform vSphericalXY: vec3f;uniform vSphericalYZ: vec3f;uniform vSphericalZX: vec3f;uniform vBaseWeight: f32;uniform vBaseColor: vec4f;uniform vBaseDiffuseRoughness: f32;uniform vReflectanceInfo: vec4f;uniform vSpecularColor: vec4f;uniform vSpecularAnisotropy: vec3f;uniform vCoatWeight: f32;uniform vCoatColor: vec3f;uniform vCoatRoughness: f32;uniform vCoatRoughnessAnisotropy: f32;uniform vCoatIor: f32;uniform vCoatDarkening : f32;uniform vFuzzWeight: f32;uniform vFuzzColor: vec3f;uniform vFuzzRoughness: f32;uniform vGeometryCoatTangent: vec2f;uniform vEmissionColor: vec3f;uniform vThinFilmWeight: f32;uniform vThinFilmThickness: vec2f;uniform vThinFilmIor: f32;uniform vBaseWeightInfos: vec2f;uniform baseWeightMatrix: mat4x4f;uniform vBaseColorInfos: vec2f;uniform baseColorMatrix: mat4x4f;uniform vBaseDiffuseRoughnessInfos: vec2f;uniform baseDiffuseRoughnessMatrix: mat4x4f;uniform vBaseMetalnessInfos: vec2f;uniform baseMetalnessMatrix: mat4x4f;uniform vSpecularWeightInfos: vec2f;uniform specularWeightMatrix: mat4x4f;uniform vSpecularColorInfos: vec2f;uniform specularColorMatrix: mat4x4f;uniform vSpecularRoughnessInfos: vec2f;uniform specularRoughnessMatrix: mat4x4f;uniform vSpecularRoughnessAnisotropyInfos: vec2f;uniform specularRoughnessAnisotropyMatrix: mat4x4f;uniform vCoatWeightInfos: vec2f;uniform coatWeightMatrix: mat4x4f;uniform vCoatColorInfos: vec2f;uniform coatColorMatrix: mat4x4f;uniform vCoatRoughnessInfos: vec2f;uniform coatRoughnessMatrix: mat4x4f;uniform vCoatRoughnessAnisotropyInfos: vec2f;uniform coatRoughnessAnisotropyMatrix: mat4x4f;uniform vCoatDarkeningInfos : vec2f;uniform coatDarkeningMatrix : mat4x4f;uniform vFuzzWeightInfos: vec2f;uniform fuzzWeightMatrix: mat4x4f;uniform vFuzzColorInfos: vec2f;uniform fuzzColorMatrix: mat4x4f;uniform vFuzzRoughnessInfos: vec2f;uniform fuzzRoughnessMatrix: mat4x4f;uniform vGeometryNormalInfos: vec2f;uniform geometryNormalMatrix: mat4x4f;uniform vGeometryTangentInfos: vec2f;uniform geometryTangentMatrix: mat4x4f;uniform vGeometryCoatNormalInfos: vec2f;uniform geometryCoatNormalMatrix: mat4x4f;uniform vGeometryCoatTangentInfos: vec2f;uniform geometryCoatTangentMatrix: mat4x4f;uniform vGeometryOpacityInfos: vec2f;uniform geometryOpacityMatrix: mat4x4f;uniform vEmissionInfos: vec2f;uniform emissionMatrix: mat4x4f;uniform vThinFilmWeightInfos: vec2f;uniform thinFilmWeightMatrix: mat4x4f;uniform vThinFilmThicknessInfos: vec2f;uniform thinFilmThicknessMatrix: mat4x4f;uniform vAmbientOcclusionInfos: vec2f;uniform ambientOcclusionMatrix: mat4x4f;
#define ADDITIONAL_UBO_DECLARATION
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},90324,a=>{"use strict";var b=a.i(625562);a.i(857890),a.i(673971),a.i(604045),a.i(463068),a.i(51308),a.i(662384),a.i(616212),a.i(488049),a.i(489452),a.i(494348),a.i(254147);let c="openpbrNormalMapVertexDeclaration",d=`#if defined(GEOMETRY_NORMAL) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.i(315937),a.i(431801),a.i(214918),a.i(475114),a.i(549432),a.i(160815),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067),a.i(929547),a.i(357272),a.i(751814);let e="openpbrNormalMapVertex",f=`#if defined(GEOMETRY_NORMAL) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL)
var tbnNormal: vec3f=normalize(normalUpdated);var tbnTangent: vec3f=normalize(tangentUpdated.xyz);var tbnBitangent: vec3f=cross(tbnNormal,tbnTangent)*tangentUpdated.w;var matTemp= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz)* mat3x3f(tbnTangent,tbnBitangent,tbnNormal);vertexOutputs.vTBN0=matTemp[0];vertexOutputs.vTBN1=matTemp[1];vertexOutputs.vTBN2=matTemp[2];
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[e]||(b.ShaderStore.IncludesShadersStoreWGSL[e]=f),a.i(736380),a.i(43607),a.i(668273),a.i(700778),a.i(5021);let g="openpbrVertexShader",h=`#define OPENPBR_VERTEX_SHADER
#include<openpbrUboDeclaration>
#define CUSTOM_VERTEX_BEGIN
attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef TANGENT
attribute tangent: vec4f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#include<uvAttributeDeclaration>[2..7]
#include<mainUVVaryingDeclaration>[1..7]
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
varying vPositionW: vec3f;
#if DEBUGMODE>0
varying vClipSpacePosition: vec4f;
#endif
#ifdef NORMAL
varying vNormalW: vec3f;
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
varying vEnvironmentIrradiance: vec3f;
#include<harmonicsFunctions>
#endif
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<openpbrNormalMapVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<lightVxUboDeclaration>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var positionUpdated: vec3f=vertexInputs.position;
#ifdef NORMAL
var normalUpdated: vec3f=vertexInputs.normal;
#endif
#ifdef TANGENT
var tangentUpdated: vec4f=vertexInputs.tangent;
#endif
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
vertexOutputs.vPositionUVW=positionUpdated;
#endif
#define CUSTOM_VERTEX_UPDATE_POSITION
#define CUSTOM_VERTEX_UPDATE_NORMAL
#include<instancesVertex>
#if defined(PREPASS) && ((defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vertexOutputs.vCurrentPosition=scene.viewProjection*finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld*vec4f(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);vertexOutputs.vPositionW= worldPos.xyz;
#ifdef PREPASS
#include<prePassVertex>
#endif
#ifdef NORMAL
var normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vertexOutputs.vNormalW=normalUpdated/ vec3f(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));vertexOutputs.vNormalW=normalize(normalWorld*vertexOutputs.vNormalW);
#else
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vertexOutputs.vNormalW=normalize(normalWorld*normalUpdated);
#endif
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-vertexOutputs.vPositionW);var NdotV: f32=max(dot(vertexOutputs.vNormalW,viewDirectionW),0.0);var roughNormal: vec3f=mix(vertexOutputs.vNormalW,viewDirectionW,(0.5*(1.0-NdotV))*uniforms.vBaseDiffuseRoughness);var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(roughNormal,0)).xyz;
#else
var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(vertexOutputs.vNormalW,0)).xyz;
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
vertexOutputs.vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*worldPos;} else {vertexOutputs.position=scene.viewProjectionR*worldPos;}
#else
vertexOutputs.position=scene.viewProjection*worldPos;
#endif
#if DEBUGMODE>0
vertexOutputs.vClipSpacePosition=vertexOutputs.position;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vertexOutputs.vDirectionW=normalize((finalWorld*vec4f(positionUpdated,0.0)).xyz);
#endif
#ifndef UV1
var uvUpdated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV1
vertexOutputs.vMainUV1=uvUpdated;
#endif
#ifndef UV2
var uv2Updated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV2
vertexOutputs.vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_MATRIXNAME_,baseColor,_INFONAME_,BaseColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_MATRIXNAME_,baseWeight,_INFONAME_,BaseWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_MATRIXNAME_,baseDiffuseRoughness,_INFONAME_,BaseDiffuseRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness,_MATRIXNAME_,baseMetalness,_INFONAME_,BaseMetalnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight,_MATRIXNAME_,specularWeight,_INFONAME_,SpecularWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor,_MATRIXNAME_,specularColor,_INFONAME_,SpecularColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness,_MATRIXNAME_,specularRoughness,_INFONAME_,SpecularRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy,_MATRIXNAME_,specularRoughnessAnisotropy,_INFONAME_,SpecularRoughnessAnisotropyInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight,_MATRIXNAME_,coatWeight,_INFONAME_,CoatWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_COLOR,_VARYNAME_,CoatColor,_MATRIXNAME_,coatColor,_INFONAME_,CoatColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness,_MATRIXNAME_,coatRoughness,_INFONAME_,CoatRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy,_MATRIXNAME_,coatRoughnessAnisotropy,_INFONAME_,CoatRoughnessAnisotropyInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening,_MATRIXNAME_,coatDarkening,_INFONAME_,CoatDarkeningInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight,_MATRIXNAME_,fuzzWeight,_INFONAME_,FuzzWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor,_MATRIXNAME_,fuzzColor,_INFONAME_,FuzzColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness,_MATRIXNAME_,fuzzRoughness,_INFONAME_,FuzzRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_MATRIXNAME_,geometryNormal,_INFONAME_,GeometryNormalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent,_MATRIXNAME_,geometryTangent,_INFONAME_,GeometryTangentInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_MATRIXNAME_,geometryCoatNormal,_INFONAME_,GeometryCoatNormalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity,_MATRIXNAME_,geometryOpacity,_INFONAME_,GeometryOpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor,_MATRIXNAME_,emissionColor,_INFONAME_,EmissionColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight,_MATRIXNAME_,thinFilmWeight,_INFONAME_,ThinFilmWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness,_MATRIXNAME_,thinFilmThickness,_INFONAME_,ThinFilmThicknessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion,_MATRIXNAME_,ambientOcclusion,_INFONAME_,AmbientOcclusionInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<openpbrNormalMapVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[g]||(b.ShaderStore.ShadersStoreWGSL[g]=h),a.s(["openpbrVertexShaderWGSL",0,{name:g,shader:h}],90324)},142967,a=>{"use strict";var b=a.i(625562);let c="meshUboDeclaration",d=`struct Mesh {world : mat4x4<f32>,
visibility : f32,};var<uniform> mesh : Mesh;
#define WORLD_UBO
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},160815,a=>{"use strict";var b=a.i(625562);let c="logDepthDeclaration",d=`#ifdef LOGARITHMICDEPTH
uniform logarithmicDepthConstant: f32;varying vFragmentDepth: f32;
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},284660,a=>{"use strict";var b=a.i(625562);let c="sceneUboDeclaration",d=`struct Scene {viewProjection : mat4x4<f32>,
#ifdef MULTIVIEW
viewProjectionR : mat4x4<f32>,
#endif 
view : mat4x4<f32>,
projection : mat4x4<f32>,
vEyePosition : vec4<f32>,};
#define SCENE_UBO
var<uniform> scene : Scene;
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},604045,a=>{"use strict";var b=a.i(625562);let c="mainUVVaryingDeclaration",d=`#ifdef MAINUV{X}
varying vMainUV{X}: vec2f;
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},254147,a=>{"use strict";var b=a.i(625562);let c="harmonicsFunctions",d=`#ifdef USESPHERICALFROMREFLECTIONMAP
#ifdef SPHERICAL_HARMONICS
fn computeEnvironmentIrradiance(normal: vec3f)->vec3f {return uniforms.vSphericalL00
+ uniforms.vSphericalL1_1*(normal.y)
+ uniforms.vSphericalL10*(normal.z)
+ uniforms.vSphericalL11*(normal.x)
+ uniforms.vSphericalL2_2*(normal.y*normal.x)
+ uniforms.vSphericalL2_1*(normal.y*normal.z)
+ uniforms.vSphericalL20*((3.0*normal.z*normal.z)-1.0)
+ uniforms.vSphericalL21*(normal.z*normal.x)
+ uniforms.vSphericalL22*(normal.x*normal.x-(normal.y*normal.y));}
#else
fn computeEnvironmentIrradiance(normal: vec3f)->vec3f {var Nx: f32=normal.x;var Ny: f32=normal.y;var Nz: f32=normal.z;var C1: vec3f=uniforms.vSphericalZZ.rgb;var Cx: vec3f=uniforms.vSphericalX.rgb;var Cy: vec3f=uniforms.vSphericalY.rgb;var Cz: vec3f=uniforms.vSphericalZ.rgb;var Cxx_zz: vec3f=uniforms.vSphericalXX_ZZ.rgb;var Cyy_zz: vec3f=uniforms.vSphericalYY_ZZ.rgb;var Cxy: vec3f=uniforms.vSphericalXY.rgb;var Cyz: vec3f=uniforms.vSphericalYZ.rgb;var Czx: vec3f=uniforms.vSphericalZX.rgb;var a1: vec3f=Cyy_zz*Ny+Cy;var a2: vec3f=Cyz*Nz+a1;var b1: vec3f=Czx*Nz+Cx;var b2: vec3f=Cxy*Ny+b1;var b3: vec3f=Cxx_zz*Nx+b2;var t1: vec3f=Cz *Nz+C1;var t2: vec3f=a2 *Ny+t1;var t3: vec3f=b3 *Nx+t2;return t3;}
#endif
#endif
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},292330,a=>{"use strict";var b=a.i(625562);a.i(284660),a.i(142967);let c="pbrUboDeclaration",d=`uniform vAlbedoInfos: vec2f;uniform vBaseWeightInfos: vec2f;uniform vBaseDiffuseRoughnessInfos: vec2f;uniform vAmbientInfos: vec4f;uniform vOpacityInfos: vec2f;uniform vEmissiveInfos: vec2f;uniform vLightmapInfos: vec2f;uniform vReflectivityInfos: vec3f;uniform vMicroSurfaceSamplerInfos: vec2f;uniform vBumpInfos: vec3f;uniform albedoMatrix: mat4x4f;uniform baseWeightMatrix: mat4x4f;uniform baseDiffuseRoughnessMatrix: mat4x4f;uniform ambientMatrix: mat4x4f;uniform opacityMatrix: mat4x4f;uniform emissiveMatrix: mat4x4f;uniform lightmapMatrix: mat4x4f;uniform reflectivityMatrix: mat4x4f;uniform microSurfaceSamplerMatrix: mat4x4f;uniform bumpMatrix: mat4x4f;uniform vTangentSpaceParams: vec2f;uniform vAlbedoColor: vec4f;uniform baseWeight: f32;uniform baseDiffuseRoughness: f32;uniform vLightingIntensity: vec4f;uniform pointSize: f32;uniform vReflectivityColor: vec4f;uniform vEmissiveColor: vec3f;uniform vAmbientColor: vec3f;uniform vDebugMode: vec2f;uniform vMetallicReflectanceFactors: vec4f;uniform vMetallicReflectanceInfos: vec2f;uniform metallicReflectanceMatrix: mat4x4f;uniform vReflectanceInfos: vec2f;uniform reflectanceMatrix: mat4x4f;uniform cameraInfo: vec4f;uniform vReflectionInfos: vec2f;uniform reflectionMatrix: mat4x4f;uniform vReflectionMicrosurfaceInfos: vec3f;uniform vReflectionPosition: vec3f;uniform vReflectionSize: vec3f;uniform vReflectionFilteringInfo: vec2f;uniform vReflectionDominantDirection: vec3f;uniform vReflectionColor: vec3f;uniform vSphericalL00: vec3f;uniform vSphericalL1_1: vec3f;uniform vSphericalL10: vec3f;uniform vSphericalL11: vec3f;uniform vSphericalL2_2: vec3f;uniform vSphericalL2_1: vec3f;uniform vSphericalL20: vec3f;uniform vSphericalL21: vec3f;uniform vSphericalL22: vec3f;uniform vSphericalX: vec3f;uniform vSphericalY: vec3f;uniform vSphericalZ: vec3f;uniform vSphericalXX_ZZ: vec3f;uniform vSphericalYY_ZZ: vec3f;uniform vSphericalZZ: vec3f;uniform vSphericalXY: vec3f;uniform vSphericalYZ: vec3f;uniform vSphericalZX: vec3f;
#define ADDITIONAL_UBO_DECLARATION
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;b.ShaderStore.IncludesShadersStoreWGSL[c]||(b.ShaderStore.IncludesShadersStoreWGSL[c]=d),a.s([])},539588,a=>{"use strict";var b=a.i(625562);a.i(292330),a.i(673971),a.i(604045),a.i(463068),a.i(51308),a.i(662384),a.i(616212),a.i(488049),a.i(489452),a.i(494348),a.i(254147),a.i(919955),a.i(315937),a.i(431801),a.i(214918),a.i(475114),a.i(549432),a.i(160815),a.i(250197),a.i(705357),a.i(707101),a.i(304277),a.i(83067),a.i(929547),a.i(357272),a.i(751814),a.i(524322),a.i(736380),a.i(43607),a.i(668273),a.i(700778),a.i(5021);let c="pbrVertexShader",d=`#define PBR_VERTEX_SHADER
#include<pbrUboDeclaration>
#define CUSTOM_VERTEX_BEGIN
attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef TANGENT
attribute tangent: vec4f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#include<uvAttributeDeclaration>[2..7]
#include<mainUVVaryingDeclaration>[1..7]
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<samplerVertexDeclaration>(_DEFINENAME_,ALBEDO,_VARYINGNAME_,Albedo)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient)
#include<samplerVertexDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive)
#include<samplerVertexDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap)
#include<samplerVertexDeclaration>(_DEFINENAME_,REFLECTIVITY,_VARYINGNAME_,Reflectivity)
#include<samplerVertexDeclaration>(_DEFINENAME_,MICROSURFACEMAP,_VARYINGNAME_,MicroSurfaceSampler)
#include<samplerVertexDeclaration>(_DEFINENAME_,METALLIC_REFLECTANCE,_VARYINGNAME_,MetallicReflectance)
#include<samplerVertexDeclaration>(_DEFINENAME_,REFLECTANCE,_VARYINGNAME_,Reflectance)
#include<samplerVertexDeclaration>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
#ifdef CLEARCOAT
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE,_VARYINGNAME_,ClearCoat)
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE_ROUGHNESS,_VARYINGNAME_,ClearCoatRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_BUMP,_VARYINGNAME_,ClearCoatBump)
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_TINT_TEXTURE,_VARYINGNAME_,ClearCoatTint)
#endif
#ifdef IRIDESCENCE
#include<samplerVertexDeclaration>(_DEFINENAME_,IRIDESCENCE_TEXTURE,_VARYINGNAME_,Iridescence)
#include<samplerVertexDeclaration>(_DEFINENAME_,IRIDESCENCE_THICKNESS_TEXTURE,_VARYINGNAME_,IridescenceThickness)
#endif
#ifdef SHEEN
#include<samplerVertexDeclaration>(_DEFINENAME_,SHEEN_TEXTURE,_VARYINGNAME_,Sheen)
#include<samplerVertexDeclaration>(_DEFINENAME_,SHEEN_TEXTURE_ROUGHNESS,_VARYINGNAME_,SheenRoughness)
#endif
#ifdef ANISOTROPIC
#include<samplerVertexDeclaration>(_DEFINENAME_,ANISOTROPIC_TEXTURE,_VARYINGNAME_,Anisotropy)
#endif
#ifdef SUBSURFACE
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_THICKNESSANDMASK_TEXTURE,_VARYINGNAME_,Thickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_REFRACTIONINTENSITY_TEXTURE,_VARYINGNAME_,RefractionIntensity)
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYINTENSITY_TEXTURE,_VARYINGNAME_,TranslucencyIntensity)
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYCOLOR_TEXTURE,_VARYINGNAME_,TranslucencyColor)
#endif
varying vPositionW: vec3f;
#if DEBUGMODE>0
varying vClipSpacePosition: vec4f;
#endif
#ifdef NORMAL
varying vNormalW: vec3f;
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
varying vEnvironmentIrradiance: vec3f;
#include<harmonicsFunctions>
#endif
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<bumpVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<lightVxUboDeclaration>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var positionUpdated: vec3f=vertexInputs.position;
#ifdef NORMAL
var normalUpdated: vec3f=vertexInputs.normal;
#endif
#ifdef TANGENT
var tangentUpdated: vec4f=vertexInputs.tangent;
#endif
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
vertexOutputs.vPositionUVW=positionUpdated;
#endif
#define CUSTOM_VERTEX_UPDATE_POSITION
#define CUSTOM_VERTEX_UPDATE_NORMAL
#include<instancesVertex>
#if defined(PREPASS) && ((defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vertexOutputs.vCurrentPosition=scene.viewProjection*finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld*vec4f(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);vertexOutputs.vPositionW= worldPos.xyz;
#ifdef PREPASS
#include<prePassVertex>
#endif
#ifdef NORMAL
var normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vertexOutputs.vNormalW=normalUpdated/ vec3f(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));vertexOutputs.vNormalW=normalize(normalWorld*vertexOutputs.vNormalW);
#else
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vertexOutputs.vNormalW=normalize(normalWorld*normalUpdated);
#endif
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-vertexOutputs.vPositionW);var NdotV: f32=max(dot(vertexOutputs.vNormalW,viewDirectionW),0.0);var roughNormal: vec3f=mix(vertexOutputs.vNormalW,viewDirectionW,(0.5*(1.0-NdotV))*uniforms.baseDiffuseRoughness);var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(roughNormal,0)).xyz;
#else
var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(vertexOutputs.vNormalW,0)).xyz;
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
vertexOutputs.vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*worldPos;} else {vertexOutputs.position=scene.viewProjectionR*worldPos;}
#else
vertexOutputs.position=scene.viewProjection*worldPos;
#endif
#if DEBUGMODE>0
vertexOutputs.vClipSpacePosition=vertexOutputs.position;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vertexOutputs.vDirectionW=normalize((finalWorld*vec4f(positionUpdated,0.0)).xyz);
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
vertexOutputs.vViewDepth=(scene.view*worldPos).z;
#endif
#ifndef UV1
var uvUpdated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV1
vertexOutputs.vMainUV1=uvUpdated;
#endif
#ifndef UV2
var uv2Updated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV2
vertexOutputs.vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,ALBEDO,_VARYINGNAME_,Albedo,_MATRIXNAME_,albedo,_INFONAME_,AlbedoInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_MATRIXNAME_,baseWeight,_INFONAME_,BaseWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_MATRIXNAME_,baseDiffuseRoughness,_INFONAME_,BaseDiffuseRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_MATRIXNAME_,ambient,_INFONAME_,AmbientInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_MATRIXNAME_,opacity,_INFONAME_,OpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_MATRIXNAME_,emissive,_INFONAME_,EmissiveInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_MATRIXNAME_,lightmap,_INFONAME_,LightmapInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,REFLECTIVITY,_VARYINGNAME_,Reflectivity,_MATRIXNAME_,reflectivity,_INFONAME_,ReflectivityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,MICROSURFACEMAP,_VARYINGNAME_,MicroSurfaceSampler,_MATRIXNAME_,microSurfaceSampler,_INFONAME_,MicroSurfaceSamplerInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,METALLIC_REFLECTANCE,_VARYINGNAME_,MetallicReflectance,_MATRIXNAME_,metallicReflectance,_INFONAME_,MetallicReflectanceInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,REFLECTANCE,_VARYINGNAME_,Reflectance,_MATRIXNAME_,reflectance,_INFONAME_,ReflectanceInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_MATRIXNAME_,bump,_INFONAME_,BumpInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#ifdef CLEARCOAT
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_TEXTURE,_VARYINGNAME_,ClearCoat,_MATRIXNAME_,clearCoat,_INFONAME_,ClearCoatInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_TEXTURE_ROUGHNESS,_VARYINGNAME_,ClearCoatRoughness,_MATRIXNAME_,clearCoatRoughness,_INFONAME_,ClearCoatInfos.z)
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_BUMP,_VARYINGNAME_,ClearCoatBump,_MATRIXNAME_,clearCoatBump,_INFONAME_,ClearCoatBumpInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_TINT_TEXTURE,_VARYINGNAME_,ClearCoatTint,_MATRIXNAME_,clearCoatTint,_INFONAME_,ClearCoatTintInfos.x)
#endif
#ifdef IRIDESCENCE
#include<samplerVertexImplementation>(_DEFINENAME_,IRIDESCENCE_TEXTURE,_VARYINGNAME_,Iridescence,_MATRIXNAME_,iridescence,_INFONAME_,IridescenceInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,IRIDESCENCE_THICKNESS_TEXTURE,_VARYINGNAME_,IridescenceThickness,_MATRIXNAME_,iridescenceThickness,_INFONAME_,IridescenceInfos.z)
#endif
#ifdef SHEEN
#include<samplerVertexImplementation>(_DEFINENAME_,SHEEN_TEXTURE,_VARYINGNAME_,Sheen,_MATRIXNAME_,sheen,_INFONAME_,SheenInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SHEEN_TEXTURE_ROUGHNESS,_VARYINGNAME_,SheenRoughness,_MATRIXNAME_,sheenRoughness,_INFONAME_,SheenInfos.z)
#endif
#ifdef ANISOTROPIC
#include<samplerVertexImplementation>(_DEFINENAME_,ANISOTROPIC_TEXTURE,_VARYINGNAME_,Anisotropy,_MATRIXNAME_,anisotropy,_INFONAME_,AnisotropyInfos.x)
#endif
#ifdef SUBSURFACE
#include<samplerVertexImplementation>(_DEFINENAME_,SS_THICKNESSANDMASK_TEXTURE,_VARYINGNAME_,Thickness,_MATRIXNAME_,thickness,_INFONAME_,ThicknessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SS_REFRACTIONINTENSITY_TEXTURE,_VARYINGNAME_,RefractionIntensity,_MATRIXNAME_,refractionIntensity,_INFONAME_,RefractionIntensityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SS_TRANSLUCENCYINTENSITY_TEXTURE,_VARYINGNAME_,TranslucencyIntensity,_MATRIXNAME_,translucencyIntensity,_INFONAME_,TranslucencyIntensityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SS_TRANSLUCENCYCOLOR_TEXTURE,_VARYINGNAME_,TranslucencyColor,_MATRIXNAME_,translucencyColor,_INFONAME_,TranslucencyColorInfos.x)
#endif
#include<bumpVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;b.ShaderStore.ShadersStoreWGSL[c]||(b.ShaderStore.ShadersStoreWGSL[c]=d),a.s(["pbrVertexShaderWGSL",0,{name:c,shader:d}])},38959,a=>{"use strict";var b=a.i(16350);class c extends b.AbstractAudioOutNode{constructor(a,b,c,d=2){super(a,b,d),this._spatialAutoUpdate=!0,this._spatialMinUpdateTime=0,this._outBus=null,this._spatial=null,this._onOutBusDisposed=()=>{this._outBus=null},"boolean"==typeof c.spatialAutoUpdate&&(this._spatialAutoUpdate=c.spatialAutoUpdate),"number"==typeof c.spatialMinUpdateTime&&(this._spatialMinUpdateTime=c.spatialMinUpdateTime)}get outBus(){return this._outBus}set outBus(a){if(this._outBus!==a){if(this._outBus&&(this._outBus.onDisposeObservable.removeCallback(this._onOutBusDisposed),!this._disconnect(this._outBus)))throw Error("Disconnect failed");if(this._outBus=a,this._outBus&&(this._outBus.onDisposeObservable.add(this._onOutBusDisposed),!this._connect(this._outBus)))throw Error("Connect failed")}}get spatial(){return this._spatial?this._spatial:this._initSpatialProperty()}dispose(){super.dispose(),this._spatial?.dispose(),this._spatial=null,this._outBus=null}_initSpatialProperty(){return this._spatial=this._createSpatialProperty(this._spatialAutoUpdate,this._spatialMinUpdateTime)}get _isSpatial(){return null!==this._spatial}set _isSpatial(a){a&&!this._spatial?this._initSpatialProperty():!a&&this._spatial&&(this._spatial.dispose(),this._spatial=null)}}a.s(["AbstractSoundSource",()=>c])},518369,871978,a=>{"use strict";var b=a.i(608568),c=a.i(38959);class d extends c.AbstractSoundSource{constructor(a,c,d){super(a,c,d,3),this._newestInstance=null,this._privateInstances=new Set,this._state=1,this._instances=this._privateInstances,this.onEndedObservable=new b.Observable,this._onInstanceEnded=a=>{this._newestInstance===a&&(this._newestInstance=null),this._privateInstances.delete(a),0===this._instances.size&&(this._state=1,this.onEndedObservable.notifyObservers(this)),a.dispose()}}get activeInstancesCount(){return this._instances.size}get autoplay(){return this._options.autoplay}get currentTime(){let a=this._getNewestInstance();return a?a.currentTime:0}set currentTime(a){this.startOffset=a;let b=this._getNewestInstance();b&&(b.currentTime=a)}get loop(){return this._options.loop}set loop(a){this._options.loop=a}get maxInstances(){return this._options.maxInstances}set maxInstances(a){this._options.maxInstances=a}get startOffset(){return this._options.startOffset}set startOffset(a){this._options.startOffset=a}get state(){return this._state}dispose(){super.dispose(),this.stop(),this._newestInstance=null,this._privateInstances.clear(),this.onEndedObservable.clear()}pause(){let a=this._instances.values();for(let b=a.next();!b.done;b=a.next())b.value.pause();this._state=5}resume(){if(5!==this._state)return;let a=this._instances.values();for(let b=a.next();!b.done;b=a.next())b.value.resume();this._state=3}_beforePlay(a){5===this.state&&this._instances.size>0?this.resume():(a.onEndedObservable.addOnce(this._onInstanceEnded),this._privateInstances.add(a),this._newestInstance=a)}_afterPlay(a){this._state=a.state}_getNewestInstance(){if(0===this._instances.size)return null;if(!this._newestInstance){let a=this._instances.values();for(let b=a.next();!b.done;b=a.next())this._newestInstance=b.value}return this._newestInstance}_setState(a){this._state=a}_stopExcessInstances(){if(this.maxInstances<1/0){let a=Array.from(this._instances).filter(a=>3===a.state).length-this.maxInstances,b=this._instances.values();for(let c=0;c<a;c++)b.next().value.stop()}}}a.s(["AbstractSound",()=>d],518369);var e=a.i(102269);class f extends e.AbstractAudioNode{constructor(a){super(a.engine,2),this._state=1,this.onEndedObservable=new b.Observable,this.onErrorObservable=new b.Observable,this.onStateChangedObservable=new b.Observable,this._sound=a}get state(){return this._state}dispose(){super.dispose(),this.stop(),this.onEndedObservable.clear(),this.onStateChangedObservable.clear()}_setState(a){this._state!==a&&(this._state=a,this.onStateChangedObservable.notifyObservers(this),1===this._state&&this.onEndedObservable.notifyObservers(this))}}a.s(["_AbstractSoundInstance",()=>f],871978)},484046,471044,784473,a=>{"use strict";var b=a.i(518369);class c extends b.AbstractSound{constructor(a,b,c){super(a,b,c)}get duration(){return this._options.duration}set duration(a){this._options.duration=a}get loopStart(){return this._options.loopStart}set loopStart(a){this._options.loopStart=a}get loopEnd(){return this._options.loopEnd}set loopEnd(a){this._options.loopEnd=a}get pitch(){return this._options.pitch}set pitch(a){this._options.pitch=a;let b=this._instances.values();for(let c=b.next();!c.done;c=b.next())c.value.pitch=a}get playbackRate(){return this._options.playbackRate}set playbackRate(a){this._options.playbackRate=a;let b=this._instances.values();for(let c=b.next();!c.done;c=b.next())c.value.playbackRate=a}play(a={}){if(5===this.state)return void this.resume();a.duration??(a.duration=this.duration),a.loop??(a.loop=this.loop),a.loopStart??(a.loopStart=this.loopStart),a.loopEnd??(a.loopEnd=this.loopEnd),a.startOffset??(a.startOffset=this.startOffset),a.volume??(a.volume=1),a.waitTime??(a.waitTime=0);let b=this._createInstance();this._beforePlay(b),b.play(a),this._afterPlay(b),this._stopExcessInstances()}stop(a={}){if(a.waitTime&&0<a.waitTime?this._setState(0):this._setState(1),this._instances)for(let b of Array.from(this._instances))b.stop(a)}}a.s(["StaticSound",()=>c],471044);let d=1;class e{constructor(a){this.name=`StaticSoundBuffer #${d++}`,this.engine=a}}a.s(["StaticSoundBuffer",()=>e],784473);var f=a.i(871978);class g extends f._AbstractSoundInstance{}var h=a.i(633619),i=a.i(470165),j=a.i(995796),k=a.i(739003),l=a.i(221553),m=a.i(736394);class n extends c{constructor(a,b,c){super(a,b,c),this._stereo=null,this._options={autoplay:c.autoplay??!1,duration:c.duration??0,loop:c.loop??!1,loopEnd:c.loopEnd??0,loopStart:c.loopStart??0,maxInstances:c.maxInstances??1/0,pitch:c.pitch??0,playbackRate:c.playbackRate??1,startOffset:c.startOffset??0},this._subGraph=new n._SubGraph(this)}async _initAsync(a,b){this._audioContext=this.engine._audioContext,a instanceof o?this._buffer=a:("string"==typeof a||Array.isArray(a)||a instanceof ArrayBuffer||a instanceof AudioBuffer)&&(this._buffer=await this.engine.createSoundBufferAsync(a,b)),b.outBus?this.outBus=b.outBus:!1!==b.outBusAutoDefault&&(await this.engine.isReadyPromise,this.outBus=this.engine.defaultMainBus),await this._subGraph.initAsync(b),(0,h._HasSpatialAudioOptions)(b)&&this._initSpatialProperty(),b.autoplay&&this.play(),this.engine._addSound(this)}get buffer(){return this._buffer}get _inNode(){return this._subGraph._inNode}get _outNode(){return this._subGraph._outNode}get stereo(){return this._stereo??(this._stereo=new i._StereoAudio(this._subGraph))}async cloneAsync(a=null){let b=await this.engine.createSoundAsync(this.name,a?.cloneBuffer?this.buffer.clone():this.buffer,this._options);return b.outBus=a?.outBus?a.outBus:this.outBus,b}dispose(){super.dispose(),this._stereo=null,this._subGraph.dispose(),this.engine._removeSound(this)}getClassName(){return"_WebAudioStaticSound"}_createInstance(){return new p(this,this._options)}_connect(a){return!!super._connect(a)&&(a._inNode&&this._outNode?.connect(a._inNode),!0)}_disconnect(a){return!!super._disconnect(a)&&(a._inNode&&this._outNode?.disconnect(a._inNode),!0)}_createSpatialProperty(a,b){return new m._SpatialWebAudio(this._subGraph,a,b)}_getOptions(){return this._options}}n._SubGraph=class extends l._WebAudioBusAndSoundSubGraph{get _downstreamNodes(){return this._owner._downstreamNodes??null}get _upstreamNodes(){return this._owner._upstreamNodes??null}};class o extends e{constructor(a){super(a)}async _initAsync(a,b){a instanceof AudioBuffer?this._audioBuffer=a:"string"==typeof a?await this._initFromUrlAsync(a):Array.isArray(a)?await this._initFromUrlsAsync(a,b.skipCodecCheck??!1):a instanceof ArrayBuffer&&await this._initFromArrayBufferAsync(a)}get channelCount(){return this._audioBuffer.numberOfChannels}get duration(){return this._audioBuffer.duration}get length(){return this._audioBuffer.length}get sampleRate(){return this._audioBuffer.sampleRate}clone(a=null){let b=new AudioBuffer({length:this._audioBuffer.length,numberOfChannels:this._audioBuffer.numberOfChannels,sampleRate:this._audioBuffer.sampleRate});for(let a=0;a<this._audioBuffer.numberOfChannels;a++)b.copyToChannel(this._audioBuffer.getChannelData(a),a);let c=new o(this.engine);return c._audioBuffer=b,c.name=a?.name?a.name:this.name,c}async _initFromArrayBufferAsync(a){this._audioBuffer=await this.engine._audioContext.decodeAudioData(a)}async _initFromUrlAsync(a){a=(0,j._CleanUrl)(a),await this._initFromArrayBufferAsync(await (await fetch(a)).arrayBuffer())}async _initFromUrlsAsync(a,b){for(let c of a){if(b)await this._initFromUrlAsync(c);else{let a=c.match(j._FileExtensionRegex),b=a?.at(1);if(b&&this.engine.isFormatValid(b))try{await this._initFromUrlAsync(c)}catch{b&&0<b.length&&this.engine.flagInvalidFormat(b)}}if(this._audioBuffer)break}}}class p extends g{constructor(a,b){super(a),this._enginePlayTime=0,this._enginePauseTime=0,this._isConnected=!1,this._pitch=null,this._playbackRate=null,this._sourceNode=null,this._onEnded=()=>{this._enginePlayTime=0,5!==this._state&&this.onEndedObservable.notifyObservers(this),this._deinitSourceNode()},this._onEngineStateChanged=()=>{"running"===this.engine.state&&(this._options.loop&&2===this.state&&this.play(),this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged))},this._options=b,this._volumeNode=new GainNode(a._audioContext),this._initSourceNode()}dispose(){super.dispose(),this._pitch?.dispose(),this._playbackRate?.dispose(),this._sourceNode=null,this.stop(),this._deinitSourceNode(),this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged)}get currentTime(){if(1===this._state)return 0;let a=5===this._state?0:this.engine.currentTime-this._enginePlayTime;return this._enginePauseTime+a+this._options.startOffset}set currentTime(a){let b=2===this._state||3===this._state;if(b){let a=this._sourceNode;this._deinitSourceNode(),a?.stop(),this._state=1}5===this.state&&(this._enginePauseTime=0),this._options.startOffset=a,b&&this.play()}get _outNode(){return this._volumeNode}set pitch(a){this._pitch?.setTargetValue(a)}set playbackRate(a){this._playbackRate?.setTargetValue(a)}get startTime(){return 1===this._state?0:this._enginePlayTime}getClassName(){return"_WebAudioStaticSoundInstance"}play(a={}){if(3===this._state)return;void 0!==a.duration&&(this._options.duration=a.duration),void 0!==a.loop&&(this._options.loop=a.loop),void 0!==a.loopStart&&(this._options.loopStart=a.loopStart),void 0!==a.loopEnd&&(this._options.loopEnd=a.loopEnd),void 0!==a.startOffset&&(this._options.startOffset=a.startOffset);let b=this._options.startOffset;5===this._state&&(b+=this._enginePauseTime,b%=this._sound.buffer.duration),this._enginePlayTime=this.engine.currentTime+(a.waitTime??0),this._volumeNode.gain.value=a.volume??1,this._initSourceNode(),"running"===this.engine.state?(this._setState(3),this._sourceNode?.start(this._enginePlayTime,b,this._options.duration>0?this._options.duration:void 0)):this._options.loop&&(this._setState(2),this.engine.stateChangedObservable.add(this._onEngineStateChanged))}pause(){5!==this._state&&(this._setState(5),this._enginePauseTime+=this.engine.currentTime-this._enginePlayTime,this._sourceNode?.stop(),this._deinitSourceNode())}resume(){5===this._state&&this.play()}stop(a={}){if(1===this._state)return;let b=this.engine.currentTime+(a.waitTime??0);this._sourceNode?.stop(b),(void 0===a.waitTime||a.waitTime<=0)&&(this._setState(1),this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged))}_connect(a){return!!super._connect(a)&&(a instanceof n&&a._inNode&&(this._outNode?.connect(a._inNode),this._isConnected=!0),!0)}_disconnect(a){return!!super._disconnect(a)&&(a instanceof n&&a._inNode&&(this._outNode?.disconnect(a._inNode),this._isConnected=!1),!0)}_deinitSourceNode(){if(this._sourceNode){if(this._isConnected&&!this._disconnect(this._sound))throw Error("Disconnect failed");this._sourceNode.disconnect(this._volumeNode),this._sourceNode.removeEventListener("ended",this._onEnded),this._sourceNode=null}}_initSourceNode(){if(!this._sourceNode){if(this._sourceNode=new AudioBufferSourceNode(this._sound._audioContext,{buffer:this._sound.buffer._audioBuffer}),this._sourceNode.addEventListener("ended",this._onEnded,{once:!0}),this._sourceNode.connect(this._volumeNode),!this._connect(this._sound))throw Error("Connect failed");this._pitch=new k._WebAudioParameterComponent(this.engine,this._sourceNode.detune),this._playbackRate=new k._WebAudioParameterComponent(this.engine,this._sourceNode.playbackRate)}let a=this._sourceNode;a.detune.value=this._sound.pitch,a.loop=this._options.loop,a.loopEnd=this._options.loopEnd,a.loopStart=this._options.loopStart,a.playbackRate.value=this._sound.playbackRate}}a.s(["_WebAudioStaticSound",()=>n,"_WebAudioStaticSoundBuffer",()=>o],484046)},130162,a=>{"use strict";var b=a.i(625562);a.i(658057),a.i(386919);let c="openpbrUboDeclaration",d=`layout(std140,column_major) uniform;uniform Material {vec2 vTangentSpaceParams;vec4 vLightingIntensity;float pointSize;vec2 vDebugMode;vec4 cameraInfo;vec2 vReflectionInfos;mat4 reflectionMatrix;vec3 vReflectionMicrosurfaceInfos;vec3 vReflectionPosition;vec3 vReflectionSize;vec2 vReflectionFilteringInfo;vec3 vReflectionDominantDirection;vec3 vReflectionColor;vec3 vSphericalL00;vec3 vSphericalL1_1;vec3 vSphericalL10;vec3 vSphericalL11;vec3 vSphericalL2_2;vec3 vSphericalL2_1;vec3 vSphericalL20;vec3 vSphericalL21;vec3 vSphericalL22;vec3 vSphericalX;vec3 vSphericalY;vec3 vSphericalZ;vec3 vSphericalXX_ZZ;vec3 vSphericalYY_ZZ;vec3 vSphericalZZ;vec3 vSphericalXY;vec3 vSphericalYZ;vec3 vSphericalZX;float vBaseWeight;vec4 vBaseColor;float vBaseDiffuseRoughness;vec4 vReflectanceInfo;vec4 vSpecularColor;vec3 vSpecularAnisotropy;float vCoatWeight;vec3 vCoatColor;float vCoatRoughness;float vCoatRoughnessAnisotropy;float vCoatIor;float vCoatDarkening;float vFuzzWeight;vec3 vFuzzColor;float vFuzzRoughness;vec2 vGeometryCoatTangent;vec3 vEmissionColor;float vThinFilmWeight;vec2 vThinFilmThickness;float vThinFilmIor;vec2 vBaseWeightInfos;mat4 baseWeightMatrix;vec2 vBaseColorInfos;mat4 baseColorMatrix;vec2 vBaseDiffuseRoughnessInfos;mat4 baseDiffuseRoughnessMatrix;vec2 vBaseMetalnessInfos;mat4 baseMetalnessMatrix;vec2 vSpecularWeightInfos;mat4 specularWeightMatrix;vec2 vSpecularColorInfos;mat4 specularColorMatrix;vec2 vSpecularRoughnessInfos;mat4 specularRoughnessMatrix;vec2 vSpecularRoughnessAnisotropyInfos;mat4 specularRoughnessAnisotropyMatrix;vec2 vCoatWeightInfos;mat4 coatWeightMatrix;vec2 vCoatColorInfos;mat4 coatColorMatrix;vec2 vCoatRoughnessInfos;mat4 coatRoughnessMatrix;vec2 vCoatRoughnessAnisotropyInfos;mat4 coatRoughnessAnisotropyMatrix;vec2 vCoatDarkeningInfos;mat4 coatDarkeningMatrix;vec2 vFuzzWeightInfos;mat4 fuzzWeightMatrix;vec2 vFuzzColorInfos;mat4 fuzzColorMatrix;vec2 vFuzzRoughnessInfos;mat4 fuzzRoughnessMatrix;vec2 vGeometryNormalInfos;mat4 geometryNormalMatrix;vec2 vGeometryTangentInfos;mat4 geometryTangentMatrix;vec2 vGeometryCoatNormalInfos;mat4 geometryCoatNormalMatrix;vec2 vGeometryCoatTangentInfos;mat4 geometryCoatTangentMatrix;vec2 vGeometryOpacityInfos;mat4 geometryOpacityMatrix;vec2 vEmissionColorInfos;mat4 emissionColorMatrix;vec2 vThinFilmWeightInfos;mat4 thinFilmWeightMatrix;vec2 vThinFilmThicknessInfos;mat4 thinFilmThicknessMatrix;vec2 vAmbientOcclusionInfos;mat4 ambientOcclusionMatrix;
#define ADDITIONAL_UBO_DECLARATION
};
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.s([])},2224,a=>{"use strict";var b=a.i(625562);a.i(456071);let c="openpbrVertexDeclaration",d=`uniform mat4 view;uniform mat4 viewProjection;uniform vec4 vEyePosition;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif
#ifdef BASE_COLOR
uniform vec2 vBaseColorInfos;uniform mat4 baseColorMatrix;
#endif
#ifdef BASE_WEIGHT
uniform mat4 baseWeightMatrix;uniform vec2 vBaseWeightInfos;
#endif
uniform float vBaseDiffuseRoughness;
#ifdef BASE_DIFFUSE_ROUGHNESS
uniform mat4 baseDiffuseRoughnessMatrix;uniform vec2 vBaseDiffuseRoughnessInfos;
#endif
#ifdef AMBIENT_OCCLUSION
uniform vec2 vAmbientOcclusionInfos;uniform mat4 ambientOcclusionMatrix;
#endif
#ifdef EMISSION_COLOR
uniform vec2 vEmissionColorInfos;uniform mat4 emissionColorMatrix;
#endif
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;uniform mat4 lightmapMatrix;
#endif
#ifdef BASE_METALNESS
uniform vec2 vBaseMetalnessInfos;uniform mat4 baseMetalnessMatrix;
#endif
#ifdef SPECULAR_WEIGHT
uniform vec2 vSpecularWeightInfos;uniform mat4 specularWeightMatrix;
#endif
#ifdef SPECULAR_COLOR
uniform vec2 vSpecularColorInfos;uniform mat4 specularColorMatrix;
#endif
#ifdef SPECULAR_ROUGHNESS
uniform vec2 vSpecularRoughnessInfos;uniform mat4 specularRoughnessMatrix;
#endif
#ifdef SPECULAR_ROUGHNESS_ANISOTROPY
uniform vec2 vSpecularRoughnessAnisotropyInfos;uniform mat4 specularRoughnessAnisotropyMatrix;
#endif
#ifdef COAT_WEIGHT
uniform vec2 vCoatWeightInfos;uniform mat4 coatWeightMatrix;
#endif
#ifdef COAT_COLOR
uniform vec2 vCoatColorInfos;uniform mat4 coatColorMatrix;
#endif
#ifdef COAT_ROUGHNESS
uniform vec2 vCoatRoughnessInfos;uniform mat4 coatRoughnessMatrix;
#endif
#ifdef COAT_ROUGHNESS_ANISOTROPY
uniform vec2 vCoatRoughnessAnisotropyInfos;uniform mat4 coatRoughnessAnisotropyMatrix;
#endif
#ifdef COAT_IOR
uniform vec2 vCoatIorInfos;uniform mat4 coatIorMatrix;
#endif
#ifdef COAT_DARKENING
uniform vec2 vCoatDarkeningInfos;uniform mat4 coatDarkeningMatrix;
#endif
#ifdef FUZZ_WEIGHT
uniform vec2 vFuzzWeightInfos;uniform mat4 fuzzWeightMatrix;
#endif
#ifdef FUZZ_COLOR
uniform vec2 vFuzzColorInfos;uniform mat4 fuzzColorMatrix;
#endif
#ifdef FUZZ_ROUGHNESS
uniform vec2 vFuzzRoughnessInfos;uniform mat4 fuzzRoughnessMatrix;
#endif
#ifdef GEOMETRY_NORMAL
uniform vec2 vGeometryNormalInfos;uniform mat4 geometryNormalMatrix;
#endif
#ifdef GEOMETRY_TANGENT
uniform vec2 vGeometryTangentInfos;uniform mat4 geometryTangentMatrix;
#endif
#ifdef GEOMETRY_COAT_NORMAL
uniform vec2 vGeometryCoatNormalInfos;uniform mat4 geometryCoatNormalMatrix;
#endif
#ifdef THIN_FILM_WEIGHT
uniform vec2 vThinFilmWeightInfos;uniform mat4 thinFilmWeightMatrix;
#endif
#ifdef THIN_FILM_THICKNESS
uniform vec2 vThinFilmThicknessInfos;uniform mat4 thinFilmThicknessMatrix;
#endif
#ifdef GEOMETRY_OPACITY
uniform mat4 geometryOpacityMatrix;uniform vec2 vGeometryOpacityInfos;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
uniform vec4 cameraInfo;
#ifdef REFLECTION
uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;
#endif
#ifdef NORMAL
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#ifdef USESPHERICALFROMREFLECTIONMAP
#ifdef SPHERICAL_HARMONICS
uniform vec3 vSphericalL00;uniform vec3 vSphericalL1_1;uniform vec3 vSphericalL10;uniform vec3 vSphericalL11;uniform vec3 vSphericalL2_2;uniform vec3 vSphericalL2_1;uniform vec3 vSphericalL20;uniform vec3 vSphericalL21;uniform vec3 vSphericalL22;
#else
uniform vec3 vSphericalX;uniform vec3 vSphericalY;uniform vec3 vSphericalZ;uniform vec3 vSphericalXX_ZZ;uniform vec3 vSphericalYY_ZZ;uniform vec3 vSphericalZZ;uniform vec3 vSphericalXY;uniform vec3 vSphericalYZ;uniform vec3 vSphericalZX;
#endif
#endif
#endif
#endif
#ifdef DETAIL
uniform vec4 vDetailInfos;uniform mat4 detailMatrix;
#endif
#include<decalVertexDeclaration>
#define ADDITIONAL_VERTEX_DECLARATION
`;b.ShaderStore.IncludesShadersStore[c]||(b.ShaderStore.IncludesShadersStore[c]=d),a.i(130162),a.i(654689),a.i(244561),a.i(964653),a.i(533676),a.i(399154),a.i(320125),a.i(306169),a.i(769348),a.i(747025),a.i(570599);let e="openpbrNormalMapVertexDeclaration",f=`#if defined(GEOMETRY_NORMAL) || defined(PARALLAX) || defined(GEOMETRY_COAT_NORMAL) || defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL) 
varying mat3 vTBN;
#endif
#endif
`;b.ShaderStore.IncludesShadersStore[e]||(b.ShaderStore.IncludesShadersStore[e]=f),a.i(896790),a.i(506404),a.i(419684),a.i(693676),a.i(937034),a.i(643926),a.i(544248),a.i(554265),a.i(931041),a.i(37668),a.i(252115),a.i(175163),a.i(324442),a.i(267217),a.i(99824);let g="openpbrNormalMapVertex",h=`#if defined(GEOMETRY_NORMAL) || defined(PARALLAX) || defined(GEOMETRY_COAT_NORMAL) || defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL)
vec3 tbnNormal=normalize(normalUpdated);vec3 tbnTangent=normalize(tangentUpdated.xyz);vec3 tbnBitangent=cross(tbnNormal,tbnTangent)*tangentUpdated.w;vTBN=mat3(finalWorld)*mat3(tbnTangent,tbnBitangent,tbnNormal);
#endif
#endif
`;b.ShaderStore.IncludesShadersStore[g]||(b.ShaderStore.IncludesShadersStore[g]=h),a.i(403470),a.i(164403),a.i(714719),a.i(9902),a.i(705551);let i="openpbrVertexShader",j=`#define OPENPBR_VERTEX_SHADER
#define CUSTOM_VERTEX_EXTENSION
precision highp float;
#include<__decl__openpbrVertex>
#define CUSTOM_VERTEX_BEGIN
attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef TANGENT
attribute vec4 tangent;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#include<uvAttributeDeclaration>[2..7]
#include<mainUVVaryingDeclaration>[1..7]
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
varying vec3 vPositionW;
#if DEBUGMODE>0
varying vec4 vClipSpacePosition;
#endif
#ifdef NORMAL
varying vec3 vNormalW;
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
varying vec3 vEnvironmentIrradiance;
#include<harmonicsFunctions>
#endif
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#include<openpbrNormalMapVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vec3 positionUpdated=position;
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#ifdef TANGENT
vec4 tangentUpdated=tangent;
#endif
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
vPositionUVW=positionUpdated;
#endif
#define CUSTOM_VERTEX_UPDATE_POSITION
#define CUSTOM_VERTEX_UPDATE_NORMAL
#include<instancesVertex>
#if defined(PREPASS) && ((defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);vPositionW=vec3(worldPos);
#ifdef PREPASS
#include<prePassVertex>
#endif
#ifdef NORMAL
mat3 normalWorld=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vNormalW=normalUpdated/vec3(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));vNormalW=normalize(normalWorld*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vNormalW=normalize(normalWorld*normalUpdated);
#endif
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
#if !defined(NATIVE) && !defined(WEBGPU)
bool bbb=any(isnan(position));if (bbb) { }
#endif
float NdotV=max(dot(vNormalW,viewDirectionW),0.0);vec3 roughNormal=mix(vNormalW,viewDirectionW,(0.5*(1.0-NdotV))*vBaseDiffuseRoughness);vec3 reflectionVector=vec3(reflectionMatrix*vec4(roughNormal,0)).xyz;
#else
vec3 reflectionVector=vec3(reflectionMatrix*vec4(vNormalW,0)).xyz;
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#if DEBUGMODE>0
vClipSpacePosition=gl_Position;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vDirectionW=normalize(vec3(finalWorld*vec4(positionUpdated,0.0)));
#endif
#ifndef UV1
vec2 uvUpdated=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2Updated=vec2(0.,0.);
#endif
#ifdef MAINUV1
vMainUV1=uvUpdated;
#endif
#ifdef MAINUV2
vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_MATRIXNAME_,baseColor,_INFONAME_,BaseColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_MATRIXNAME_,baseWeight,_INFONAME_,BaseWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_MATRIXNAME_,baseDiffuseRoughness,_INFONAME_,BaseDiffuseRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness,_MATRIXNAME_,baseMetalness,_INFONAME_,BaseMetalnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight,_MATRIXNAME_,specularWeight,_INFONAME_,SpecularWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor,_MATRIXNAME_,specularColor,_INFONAME_,SpecularColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness,_MATRIXNAME_,specularRoughness,_INFONAME_,SpecularRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy,_MATRIXNAME_,specularRoughnessAnisotropy,_INFONAME_,SpecularRoughnessAnisotropyInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight,_MATRIXNAME_,coatWeight,_INFONAME_,CoatWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor,_MATRIXNAME_,coatColor,_INFONAME_,CoatColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness,_MATRIXNAME_,coatRoughness,_INFONAME_,CoatRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy,_MATRIXNAME_,coatRoughnessAnisotropy,_INFONAME_,CoatRoughnessAnisotropyInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening,_MATRIXNAME_,coatDarkening,_INFONAME_,CoatDarkeningInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight,_MATRIXNAME_,fuzzWeight,_INFONAME_,FuzzWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor,_MATRIXNAME_,fuzzColor,_INFONAME_,FuzzColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness,_MATRIXNAME_,fuzzRoughness,_INFONAME_,FuzzRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_MATRIXNAME_,geometryNormal,_INFONAME_,GeometryNormalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_MATRIXNAME_,geometryCoatNormal,_INFONAME_,GeometryCoatNormalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity,_MATRIXNAME_,geometryOpacity,_INFONAME_,GeometryOpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent,_MATRIXNAME_,geometryTangent,_INFONAME_,GeometryTangentInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor,_MATRIXNAME_,emissionColor,_INFONAME_,EmissionColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight,_MATRIXNAME_,thinFilmWeight,_INFONAME_,ThinFilmWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness,_MATRIXNAME_,thinFilmThickness,_INFONAME_,ThinFilmThicknessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion,_MATRIXNAME_,ambientOcclusion,_INFONAME_,AmbientOcclusionInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<openpbrNormalMapVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;b.ShaderStore.ShadersStore[i]||(b.ShaderStore.ShadersStore[i]=j),a.s(["openpbrVertexShader",0,{name:i,shader:j}],2224)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1b028e7d._.js.map