(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,788957,207816,338209,621250,346479,e=>{"use strict";var t=e.i(4527),r=e.i(910421),i=e.i(705203),a=e.i(326533),n=e.i(239018),s=e.i(830759),o=e.i(747290);let f=new n.Matrix,d=new n.Matrix,l=new n.Matrix,u={getScene:()=>void 0,eyeAtCamera:!0};function c(e,t,r){let i=r.asArray(),a=t.asArray();for(let e=0;e<16;e++)i[e]=a[e];return i[12]-=e.x,i[13]-=e.y,i[14]-=e.z,r.markAsUpdated(),r}function h(e,t,r){return(0,s.InvertMatrixToRef)(t,d),c(e,d,l),(0,s.InvertMatrixToRef)(l,r),r}function _(e,t,r){if(!u.eyeAtCamera)return h(e,t,r);let i=r.asArray(),a=t.asArray();for(let e=0;e<16;e++)i[e]=a[e];return i[12]=0,i[13]=0,i[14]=0,r.markAsUpdated(),r}function E(e,t,r,i){return(0,s.MultiplyMatricesToRef)(_(e,t,i),r,i),i}function p(e,t,r,i,a){for(let n=0;n<i;++n)T(e,t[n],r[n],d),d.copyToArray(a,16*n);return a}function m(e,t,r,i){return(0,s.InvertMatrixToRef)(r,d),(0,s.MultiplyMatricesToRef)(t,d,l),c(e,l,d),_(e,r,l),(0,s.MultiplyMatricesToRef)(d,l,i),i}function T(e,t,r,i){return h(e,t,l),(0,s.MultiplyMatricesToRef)(l,r,i),i}function S(e,t,r,i,a,n){return(0,s.InvertMatrixToRef)(r,d),(0,s.MultiplyMatricesToRef)(t,d,l),c(e,l,d),E(e,i,a,l),(0,s.MultiplyMatricesToRef)(d,l,n),n}function A(e,t){let r=u.getScene();if(!r||f===t)return t;f.updateFlag=t.updateFlag;let i=r.floatingOriginOffset;switch(e){case"world":return c(i,t,f);case"view":return _(i,t,f);case"worldView":return m(i,t,r.getViewMatrix(),f);case"viewProjection":return E(i,r.getViewMatrix(),r.getProjectionMatrix(),f);case"worldViewProjection":return S(i,t,r.getTransformMatrix(),r.getViewMatrix(),r.getProjectionMatrix(),f);default:if(e.startsWith("u_")){let a=e.toLowerCase();if(a.startsWith("u_worldviewprojection"))return S(i,t,r.getTransformMatrix(),r.getViewMatrix(),r.getProjectionMatrix(),f);if(a.startsWith("u_viewprojection"))return E(i,r.getViewMatrix(),r.getProjectionMatrix(),f);if(a.startsWith("u_worldview"))return m(i,t,r.getViewMatrix(),f);if(a.startsWith("u_world"))return c(i,t,f);if(a.startsWith("u_view"))return _(i,t,f)}return t}}let I=o.UniformBuffer,x=a.Effect,R=I.prototype._updateMatrixForUniform,g=a.Effect.prototype.setMatrix;function N(){a.Effect.prototype.setMatrix=g,x._setMatrixOverride=void 0,I.prototype._updateMatrixForUniform=R,I.prototype._updateMatrixForUniformOverride=void 0}function P(){x.prototype._setMatrixOverride=g,x.prototype.setMatrix=function(e,t){return this._setMatrixOverride(e,A(e,t)),this},I.prototype._updateMatrixForUniformOverride=R,I.prototype._updateMatrixForUniform=function(e,t){this._updateMatrixForUniformOverride(e,A(e,t))}}function O(e){-1===e.indexOf("vClipPlane")&&e.push("vClipPlane"),-1===e.indexOf("vClipPlane2")&&e.push("vClipPlane2"),-1===e.indexOf("vClipPlane3")&&e.push("vClipPlane3"),-1===e.indexOf("vClipPlane4")&&e.push("vClipPlane4"),-1===e.indexOf("vClipPlane5")&&e.push("vClipPlane5"),-1===e.indexOf("vClipPlane6")&&e.push("vClipPlane6")}function U(e,t,r){let i=!!(e.clipPlane??t.clipPlane),a=!!(e.clipPlane2??t.clipPlane2),n=!!(e.clipPlane3??t.clipPlane3),s=!!(e.clipPlane4??t.clipPlane4),o=!!(e.clipPlane5??t.clipPlane5),f=!!(e.clipPlane6??t.clipPlane6);i&&r.push("#define CLIPPLANE"),a&&r.push("#define CLIPPLANE2"),n&&r.push("#define CLIPPLANE3"),s&&r.push("#define CLIPPLANE4"),o&&r.push("#define CLIPPLANE5"),f&&r.push("#define CLIPPLANE6")}function C(e,t,r){let i=!1,a=!!(e.clipPlane??t.clipPlane),n=!!(e.clipPlane2??t.clipPlane2),s=!!(e.clipPlane3??t.clipPlane3),o=!!(e.clipPlane4??t.clipPlane4),f=!!(e.clipPlane5??t.clipPlane5),d=!!(e.clipPlane6??t.clipPlane6);return r.CLIPPLANE!==a&&(r.CLIPPLANE=a,i=!0),r.CLIPPLANE2!==n&&(r.CLIPPLANE2=n,i=!0),r.CLIPPLANE3!==s&&(r.CLIPPLANE3=s,i=!0),r.CLIPPLANE4!==o&&(r.CLIPPLANE4=o,i=!0),r.CLIPPLANE5!==f&&(r.CLIPPLANE5=f,i=!0),r.CLIPPLANE6!==d&&(r.CLIPPLANE6=d,i=!0),i}function M(e,t,r){let i=t.clipPlane??r.clipPlane;b(e,"vClipPlane",i),b(e,"vClipPlane2",i=t.clipPlane2??r.clipPlane2),b(e,"vClipPlane3",i=t.clipPlane3??r.clipPlane3),b(e,"vClipPlane4",i=t.clipPlane4??r.clipPlane4),b(e,"vClipPlane5",i=t.clipPlane5??r.clipPlane5),b(e,"vClipPlane6",i=t.clipPlane6??r.clipPlane6)}function b(e,t,r){if(r){let i=u.getScene()?.floatingOriginOffset||n.Vector3.ZeroReadOnly;e.setFloat4(t,r.normal.x,r.normal.y,r.normal.z,r.d+n.Vector3.Dot(r.normal,i))}}e.s(["FloatingOriginCurrentScene",0,u,"GetFullOffsetViewProjectionToRef",()=>T,"GetOffsetTransformMatrices",()=>p,"OverrideMatrixFunctions",()=>P,"ResetMatrixFunctions",()=>N],207816),e.s(["AddClipPlaneUniforms",()=>O,"BindClipPlane",()=>M,"PrepareDefinesForClipPlanes",()=>C,"PrepareStringDefinesForClipPlanes",()=>U],338209);var L=e.i(916073);class v{static get DiffuseTextureEnabled(){return this._DiffuseTextureEnabled}static set DiffuseTextureEnabled(e){this._DiffuseTextureEnabled!==e&&(this._DiffuseTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get BaseWeightTextureEnabled(){return this._BaseWeightTextureEnabled}static set BaseWeightTextureEnabled(e){this._BaseWeightTextureEnabled!==e&&(this._BaseWeightTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get BaseDiffuseRoughnessTextureEnabled(){return this._BaseDiffuseRoughnessTextureEnabled}static set BaseDiffuseRoughnessTextureEnabled(e){this._BaseDiffuseRoughnessTextureEnabled!==e&&(this._BaseDiffuseRoughnessTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get DetailTextureEnabled(){return this._DetailTextureEnabled}static set DetailTextureEnabled(e){this._DetailTextureEnabled!==e&&(this._DetailTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get DecalMapEnabled(){return this._DecalMapEnabled}static set DecalMapEnabled(e){this._DecalMapEnabled!==e&&(this._DecalMapEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get AmbientTextureEnabled(){return this._AmbientTextureEnabled}static set AmbientTextureEnabled(e){this._AmbientTextureEnabled!==e&&(this._AmbientTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get OpacityTextureEnabled(){return this._OpacityTextureEnabled}static set OpacityTextureEnabled(e){this._OpacityTextureEnabled!==e&&(this._OpacityTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get ReflectionTextureEnabled(){return this._ReflectionTextureEnabled}static set ReflectionTextureEnabled(e){this._ReflectionTextureEnabled!==e&&(this._ReflectionTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get EmissiveTextureEnabled(){return this._EmissiveTextureEnabled}static set EmissiveTextureEnabled(e){this._EmissiveTextureEnabled!==e&&(this._EmissiveTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get SpecularTextureEnabled(){return this._SpecularTextureEnabled}static set SpecularTextureEnabled(e){this._SpecularTextureEnabled!==e&&(this._SpecularTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get BumpTextureEnabled(){return this._BumpTextureEnabled}static set BumpTextureEnabled(e){this._BumpTextureEnabled!==e&&(this._BumpTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get LightmapTextureEnabled(){return this._LightmapTextureEnabled}static set LightmapTextureEnabled(e){this._LightmapTextureEnabled!==e&&(this._LightmapTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get RefractionTextureEnabled(){return this._RefractionTextureEnabled}static set RefractionTextureEnabled(e){this._RefractionTextureEnabled!==e&&(this._RefractionTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get ColorGradingTextureEnabled(){return this._ColorGradingTextureEnabled}static set ColorGradingTextureEnabled(e){this._ColorGradingTextureEnabled!==e&&(this._ColorGradingTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get FresnelEnabled(){return this._FresnelEnabled}static set FresnelEnabled(e){this._FresnelEnabled!==e&&(this._FresnelEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(4))}static get ClearCoatTextureEnabled(){return this._ClearCoatTextureEnabled}static set ClearCoatTextureEnabled(e){this._ClearCoatTextureEnabled!==e&&(this._ClearCoatTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get ClearCoatBumpTextureEnabled(){return this._ClearCoatBumpTextureEnabled}static set ClearCoatBumpTextureEnabled(e){this._ClearCoatBumpTextureEnabled!==e&&(this._ClearCoatBumpTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get ClearCoatTintTextureEnabled(){return this._ClearCoatTintTextureEnabled}static set ClearCoatTintTextureEnabled(e){this._ClearCoatTintTextureEnabled!==e&&(this._ClearCoatTintTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get SheenTextureEnabled(){return this._SheenTextureEnabled}static set SheenTextureEnabled(e){this._SheenTextureEnabled!==e&&(this._SheenTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get AnisotropicTextureEnabled(){return this._AnisotropicTextureEnabled}static set AnisotropicTextureEnabled(e){this._AnisotropicTextureEnabled!==e&&(this._AnisotropicTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get ThicknessTextureEnabled(){return this._ThicknessTextureEnabled}static set ThicknessTextureEnabled(e){this._ThicknessTextureEnabled!==e&&(this._ThicknessTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get RefractionIntensityTextureEnabled(){return this._ThicknessTextureEnabled}static set RefractionIntensityTextureEnabled(e){this._RefractionIntensityTextureEnabled!==e&&(this._RefractionIntensityTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get TranslucencyIntensityTextureEnabled(){return this._TranslucencyIntensityTextureEnabled}static set TranslucencyIntensityTextureEnabled(e){this._TranslucencyIntensityTextureEnabled!==e&&(this._TranslucencyIntensityTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get TranslucencyColorTextureEnabled(){return this._TranslucencyColorTextureEnabled}static set TranslucencyColorTextureEnabled(e){this._TranslucencyColorTextureEnabled!==e&&(this._TranslucencyColorTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}static get IridescenceTextureEnabled(){return this._IridescenceTextureEnabled}static set IridescenceTextureEnabled(e){this._IridescenceTextureEnabled!==e&&(this._IridescenceTextureEnabled=e,L.AbstractEngine.MarkAllMaterialsAsDirty(1))}}v._DiffuseTextureEnabled=!0,v._BaseWeightTextureEnabled=!0,v._BaseDiffuseRoughnessTextureEnabled=!0,v._DetailTextureEnabled=!0,v._DecalMapEnabled=!0,v._AmbientTextureEnabled=!0,v._OpacityTextureEnabled=!0,v._ReflectionTextureEnabled=!0,v._EmissiveTextureEnabled=!0,v._SpecularTextureEnabled=!0,v._BumpTextureEnabled=!0,v._LightmapTextureEnabled=!0,v._RefractionTextureEnabled=!0,v._ColorGradingTextureEnabled=!0,v._FresnelEnabled=!0,v._ClearCoatTextureEnabled=!0,v._ClearCoatBumpTextureEnabled=!0,v._ClearCoatTintTextureEnabled=!0,v._SheenTextureEnabled=!0,v._AnisotropicTextureEnabled=!0,v._ThicknessTextureEnabled=!0,v._RefractionIntensityTextureEnabled=!0,v._TranslucencyIntensityTextureEnabled=!0,v._TranslucencyColorTextureEnabled=!0,v._IridescenceTextureEnabled=!0,e.s(["MaterialFlags",()=>v],621250);var F=e.i(507066);function D(e,r,i){if(!e||e.LOGARITHMICDEPTH||e.indexOf&&e.indexOf("LOGARITHMICDEPTH")>=0){let e=i.activeCamera;1===e.mode&&t.Logger.Error("Logarithmic depth is not compatible with orthographic cameras!",20),r.setFloat("logarithmicDepthConstant",2/(Math.log(e.maxZ+1)/Math.LN2))}}e.s(["BindLogDepth",()=>D],346479);let V={r:0,g:0,b:0},y={NUM_MORPH_INFLUENCERS:0,NORMAL:!1,TANGENT:!1,UV:!1,UV2:!1,COLOR:!1};function B(e,t,r,i=!1){r&&e.fogEnabled&&(!t||t.applyFog)&&0!==e.fogMode&&(r.setFloat4("vFogInfos",e.fogMode,e.fogStart,e.fogEnd,e.fogDensity),i?(e.fogColor.toLinearSpaceToRef(V,e.getEngine().useExactSrgbConversions),r.setColor3("vFogColor",V)):r.setColor3("vFogColor",e.fogColor))}function H(e,t,r,i,a,n,s,o,f,d){let l=e.numMaxInfluencers||e.numInfluencers;return l<=0?0:(t.push("#define MORPHTARGETS"),e.hasPositions&&t.push("#define MORPHTARGETTEXTURE_HASPOSITIONS"),e.hasNormals&&t.push("#define MORPHTARGETTEXTURE_HASNORMALS"),e.hasTangents&&t.push("#define MORPHTARGETTEXTURE_HASTANGENTS"),e.hasUVs&&t.push("#define MORPHTARGETTEXTURE_HASUVS"),e.hasUV2s&&t.push("#define MORPHTARGETTEXTURE_HASUV2S"),e.hasColors&&t.push("#define MORPHTARGETTEXTURE_HASCOLORS"),e.supportsPositions&&a&&t.push("#define MORPHTARGETS_POSITION"),e.supportsNormals&&n&&t.push("#define MORPHTARGETS_NORMAL"),e.supportsTangents&&s&&t.push("#define MORPHTARGETS_TANGENT"),e.supportsUVs&&o&&t.push("#define MORPHTARGETS_UV"),e.supportsUV2s&&f&&t.push("#define MORPHTARGETS_UV2"),e.supportsColors&&d&&t.push("#define MORPHTARGETS_COLOR"),t.push("#define NUM_MORPH_INFLUENCERS "+l),e.isUsingTextureForTargets&&t.push("#define MORPHTARGETS_TEXTURE"),y.NUM_MORPH_INFLUENCERS=l,y.NORMAL=n,y.TANGENT=s,y.UV=o,y.UV2=f,y.COLOR=d,w(r,i,y,a),l)}function G(e,t,r){y.NUM_MORPH_INFLUENCERS=r,y.NORMAL=!1,y.TANGENT=!1,y.UV=!1,y.UV2=!1,y.COLOR=!1,w(e,t,y,!0)}function w(e,i,a,n=!0){let s=a.NUM_MORPH_INFLUENCERS;if(s>0&&r.EngineStore.LastCreatedEngine){let o=r.EngineStore.LastCreatedEngine.getCaps().maxVertexAttribs,f=i.morphTargetManager;if(f?.isUsingTextureForTargets)return;let d=f&&f.supportsPositions&&n,l=f&&f.supportsNormals&&a.NORMAL,u=f&&f.supportsTangents&&a.TANGENT,c=f&&f.supportsUVs&&a.UV1,h=f&&f.supportsUV2s&&a.UV2,_=f&&f.supportsColors&&a.VERTEXCOLOR;for(let r=0;r<s;r++)d&&e.push("position"+r),l&&e.push("normal"+r),u&&e.push("tangent"+r),c&&e.push("uv_"+r),h&&e.push("uv2_"+r),_&&e.push("color"+r),e.length>o&&t.Logger.Error("Cannot add more vertex attributes for mesh "+i.name)}}function z(e,t=!1){e.push("world0"),e.push("world1"),e.push("world2"),e.push("world3"),t&&(e.push("previousWorld0"),e.push("previousWorld1"),e.push("previousWorld2"),e.push("previousWorld3"))}function W(e,t){let r=e.morphTargetManager;e&&r&&t.setFloatArray("morphTargetInfluences",r.influences)}function X(e,t){t.bindToEffect(e,"Scene")}function k(e,t,r,i,a=null,n=!1,s=!1,o=!1,f=!1,d=!1,l=!1,u=0){if(e.texturesEnabled&&a&&v.ReflectionTextureEnabled){if(r.updateMatrix("reflectionMatrix",a.getReflectionTextureMatrix()),r.updateFloat2("vReflectionInfos",a.level*e.iblIntensity,u),o&&a.boundingBoxSize&&(r.updateVector3("vReflectionPosition",a.boundingBoxPosition),r.updateVector3("vReflectionSize",a.boundingBoxSize)),n){let e=a.getSize().width;r.updateFloat2("vReflectionFilteringInfo",e,Math.log2(e))}if(d&&!t.USEIRRADIANCEMAP){let e=a.sphericalPolynomial;if(t.USESPHERICALFROMREFLECTIONMAP&&e)if(t.SPHERICAL_HARMONICS){let t=e.preScaledHarmonics;r.updateVector3("vSphericalL00",t.l00),r.updateVector3("vSphericalL1_1",t.l1_1),r.updateVector3("vSphericalL10",t.l10),r.updateVector3("vSphericalL11",t.l11),r.updateVector3("vSphericalL2_2",t.l2_2),r.updateVector3("vSphericalL2_1",t.l2_1),r.updateVector3("vSphericalL20",t.l20),r.updateVector3("vSphericalL21",t.l21),r.updateVector3("vSphericalL22",t.l22)}else r.updateFloat3("vSphericalX",e.x.x,e.x.y,e.x.z),r.updateFloat3("vSphericalY",e.y.x,e.y.y,e.y.z),r.updateFloat3("vSphericalZ",e.z.x,e.z.y,e.z.z),r.updateFloat3("vSphericalXX_ZZ",e.xx.x-e.zz.x,e.xx.y-e.zz.y,e.xx.z-e.zz.z),r.updateFloat3("vSphericalYY_ZZ",e.yy.x-e.zz.x,e.yy.y-e.zz.y,e.yy.z-e.zz.z),r.updateFloat3("vSphericalZZ",e.zz.x,e.zz.y,e.zz.z),r.updateFloat3("vSphericalXY",e.xy.x,e.xy.y,e.xy.z),r.updateFloat3("vSphericalYZ",e.yz.x,e.yz.y,e.yz.z),r.updateFloat3("vSphericalZX",e.zx.x,e.zx.y,e.zx.z)}else f&&t.USEIRRADIANCEMAP&&t.USE_IRRADIANCE_DOMINANT_DIRECTION&&r.updateVector3("vReflectionDominantDirection",a.irradianceTexture._dominantDirection);s&&r.updateFloat3("vReflectionMicrosurfaceInfos",a.getSize().width,a.lodGenerationScale,a.lodGenerationOffset)}l&&r.updateColor3("vReflectionColor",i)}function Y(e,t,r,i=null,a=!1){if(i&&v.ReflectionTextureEnabled){t.LODBASEDMICROSFURACE?r.setTexture("reflectionSampler",i):(r.setTexture("reflectionSampler",i._lodTextureMid||i),r.setTexture("reflectionSamplerLow",i._lodTextureLow||i),r.setTexture("reflectionSamplerHigh",i._lodTextureHigh||i)),t.USEIRRADIANCEMAP&&r.setTexture("irradianceSampler",i.irradianceTexture);let n=e.iblCdfGenerator;a&&n&&r.setTexture("icdfSampler",n.getIcdfTexture())}}function Z(e,t,r){t._needUVs=!0,t[r]=!0,e.optimizeUVAllocation&&e.getTextureMatrix().isIdentityAs3x2()?(t[r+"DIRECTUV"]=e.coordinatesIndex+1,t["MAINUV"+(e.coordinatesIndex+1)]=!0):t[r+"DIRECTUV"]=0}function K(e,t,r){let i=e.getTextureMatrix();t.updateMatrix(r+"Matrix",i)}function Q(e,t,r){r.BAKED_VERTEX_ANIMATION_TEXTURE&&r.INSTANCES&&e.push("bakedVertexAnimationSettingsInstanced")}function q(e,t,r){if(t&&e&&(e.computeBonesUsingShaders&&t._bonesComputationForcedToCPU&&(e.computeBonesUsingShaders=!1),e.useBones&&e.computeBonesUsingShaders&&e.skeleton)){let i=e.skeleton;if(i.isUsingTextureForMatrices&&t.getUniformIndex("boneTextureWidth")>-1){let r=i.getTransformMatrixTexture(e);t.setTexture("boneSampler",r),t.setFloat("boneTextureWidth",4*(i.bones.length+1))}else{let a=i.getTransformMatrices(e);a&&(t.setMatrices("mBones",a),r&&e.getScene().prePassRenderer&&e.getScene().prePassRenderer.getIndex(2))&&(r.previousBones[e.uniqueId]||(r.previousBones[e.uniqueId]=a.slice()),t.setMatrices("mPreviousBones",r.previousBones[e.uniqueId]),r.previousBones[e.uniqueId].set(a))}}}function j(e,t,r){e.transferToEffect(t,r+"")}function J(e,t,r,i,a,n=!0){e._bindLight(t,r,i,a,n)}function $(e,t,r,i,a=4){let n=Math.min(t.lightSources.length,a);for(let a=0;a<n;a++)J(t.lightSources[a],a,e,r,"boolean"==typeof i?i:i.SPECULARTERM,t.receiveShadows)}function ee(e,t,r,i){r.NUM_BONE_INFLUENCERS>0&&(i.addCPUSkinningFallback(0,t),e.push("matricesIndices"),e.push("matricesWeights"),r.NUM_BONE_INFLUENCERS>4&&(e.push("matricesIndicesExtra"),e.push("matricesWeightsExtra")))}function et(e,t){(t.INSTANCES||t.THIN_INSTANCES)&&z(e,!!t.PREPASS_VELOCITY),t.INSTANCESCOLOR&&e.push("instanceColor")}function er(e,t,r=4,i=0){let a=0;for(let n=0;n<r&&e["LIGHT"+n];n++)n>0&&(a=i+n,t.addFallback(a,"LIGHT"+n)),!e.SHADOWS&&(e["SHADOW"+n]&&t.addFallback(i,"SHADOW"+n),e["SHADOWPCF"+n]&&t.addFallback(i,"SHADOWPCF"+n),e["SHADOWPCSS"+n]&&t.addFallback(i,"SHADOWPCSS"+n),e["SHADOWPOISSON"+n]&&t.addFallback(i,"SHADOWPOISSON"+n),e["SHADOWESM"+n]&&t.addFallback(i,"SHADOWESM"+n),e["SHADOWCLOSEESM"+n]&&t.addFallback(i,"SHADOWCLOSEESM"+n));return a++}function ei(e,t){return t.fogEnabled&&e.applyFog&&0!==t.fogMode}function ea(e,t,r,i,a,n,s,o=!1,f=!1,d,l){if(s._areMiscDirty){s.LOGARITHMICDEPTH=r,s.POINTSIZE=i,s.FOG=a&&ei(e,t),s.NONUNIFORMSCALING=e.nonUniformScaling,s.ALPHATEST=n,s.DECAL_AFTER_DETAIL=o,s.USE_VERTEX_PULLING=f;let u=d?.geometry?.getIndexBuffer();s.VERTEX_PULLING_USE_INDEX_BUFFER=!!u,s.VERTEX_PULLING_INDEX_BUFFER_32BITS=!!u&&u.is32Bits,s.VERTEXOUTPUT_INVARIANT=!!l}}function en(e,t,r,i,a=4,n=!1){if(!r._areLightsDirty)return r._needNormals;let s=0,o={needNormals:r._needNormals,needRebuild:!1,lightmapMode:!1,shadowEnabled:!1,specularEnabled:!1};if(e.lightsEnabled&&!n){for(let n of t.lightSources)if(eo(e,t,n,s,r,i,o),++s===a)break}r.SPECULARTERM=o.specularEnabled,r.SHADOWS=o.shadowEnabled;let f=Math.max(a,r.MAXLIGHTCOUNT||0);for(let e=s;e<f;e++)void 0!==r["LIGHT"+e]&&(r["LIGHT"+e]=!1,r["HEMILIGHT"+e]=!1,r["POINTLIGHT"+e]=!1,r["DIRLIGHT"+e]=!1,r["SPOTLIGHT"+e]=!1,r["AREALIGHT"+e]=!1,r["CLUSTLIGHT"+e]=!1,r["SHADOW"+e]=!1,r["SHADOWCSM"+e]=!1,r["SHADOWCSMDEBUG"+e]=!1,r["SHADOWCSMNUM_CASCADES"+e]=!1,r["SHADOWCSMUSESHADOWMAXZ"+e]=!1,r["SHADOWCSMNOBLEND"+e]=!1,r["SHADOWCSM_RIGHTHANDED"+e]=!1,r["SHADOWPCF"+e]=!1,r["SHADOWPCSS"+e]=!1,r["SHADOWPOISSON"+e]=!1,r["SHADOWESM"+e]=!1,r["SHADOWCLOSEESM"+e]=!1,r["SHADOWCUBE"+e]=!1,r["SHADOWLOWQUALITY"+e]=!1,r["SHADOWMEDIUMQUALITY"+e]=!1);r.MAXLIGHTCOUNT=a;let d=e.getEngine().getCaps();return void 0===r.SHADOWFLOAT&&(o.needRebuild=!0),r.SHADOWFLOAT=o.shadowEnabled&&(d.textureFloatRender&&d.textureFloatLinearFiltering||d.textureHalfFloatRender&&d.textureHalfFloatLinearFiltering),r.LIGHTMAPEXCLUDED=o.lightmapMode,o.needRebuild&&r.rebuild(),o.needNormals}function es(e,t,r,i=!1,a=8,n=!1){if(t&&v.ReflectionTextureEnabled){if(!t.isReadyOrNotBlocking())return!1;r._needNormals=!0,r.REFLECTION=!0,r.GAMMAREFLECTION=t.gammaSpace,r.RGBDREFLECTION=t.isRGBD,r.LODINREFLECTIONALPHA=t.lodLevelInAlpha,r.LINEARSPECULARREFLECTION=t.linearSpecularLOD,r.USEIRRADIANCEMAP=!1;let s=e.getEngine();switch(i&&a>0?(r.NUM_SAMPLES=""+a,s._features.needTypeSuffixInShaderConstants&&(r.NUM_SAMPLES=r.NUM_SAMPLES+"u"),r.REALTIME_FILTERING=!0,e.iblCdfGenerator&&(r.IBL_CDF_FILTERING=!0)):r.REALTIME_FILTERING=!1,r.INVERTCUBICMAP=t.coordinatesMode===F.Texture.INVCUBIC_MODE,r.REFLECTIONMAP_3D=t.isCube,r.REFLECTIONMAP_OPPOSITEZ=r.REFLECTIONMAP_3D&&e.useRightHandedSystem?!t.invertZ:t.invertZ,r.REFLECTIONMAP_CUBIC=!1,r.REFLECTIONMAP_EXPLICIT=!1,r.REFLECTIONMAP_PLANAR=!1,r.REFLECTIONMAP_PROJECTION=!1,r.REFLECTIONMAP_SKYBOX=!1,r.REFLECTIONMAP_SPHERICAL=!1,r.REFLECTIONMAP_EQUIRECTANGULAR=!1,r.REFLECTIONMAP_EQUIRECTANGULAR_FIXED=!1,r.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED=!1,t.coordinatesMode){case F.Texture.EXPLICIT_MODE:r.REFLECTIONMAP_EXPLICIT=!0;break;case F.Texture.PLANAR_MODE:r.REFLECTIONMAP_PLANAR=!0;break;case F.Texture.PROJECTION_MODE:r.REFLECTIONMAP_PROJECTION=!0;break;case F.Texture.SKYBOX_MODE:r.REFLECTIONMAP_SKYBOX=!0;break;case F.Texture.SPHERICAL_MODE:r.REFLECTIONMAP_SPHERICAL=!0;break;case F.Texture.EQUIRECTANGULAR_MODE:r.REFLECTIONMAP_EQUIRECTANGULAR=!0;break;case F.Texture.FIXED_EQUIRECTANGULAR_MODE:r.REFLECTIONMAP_EQUIRECTANGULAR_FIXED=!0;break;case F.Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE:r.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED=!0;break;case F.Texture.CUBIC_MODE:case F.Texture.INVCUBIC_MODE:default:r.REFLECTIONMAP_CUBIC=!0,r.USE_LOCAL_REFLECTIONMAP_CUBIC=!!t.boundingBoxSize}t.coordinatesMode!==F.Texture.SKYBOX_MODE&&(t.irradianceTexture?(r.USEIRRADIANCEMAP=!0,r.USESPHERICALFROMREFLECTIONMAP=!1,r.USESPHERICALINVERTEX=!1,t.irradianceTexture._dominantDirection&&(r.USE_IRRADIANCE_DOMINANT_DIRECTION=!0)):t.isCube&&(r.USESPHERICALFROMREFLECTIONMAP=!0,r.USEIRRADIANCEMAP=!1,r.USE_IRRADIANCE_DOMINANT_DIRECTION=!1,r.USESPHERICALINVERTEX=n))}else r.REFLECTION=!1,r.REFLECTIONMAP_3D=!1,r.REFLECTIONMAP_SPHERICAL=!1,r.REFLECTIONMAP_PLANAR=!1,r.REFLECTIONMAP_CUBIC=!1,r.USE_LOCAL_REFLECTIONMAP_CUBIC=!1,r.REFLECTIONMAP_PROJECTION=!1,r.REFLECTIONMAP_SKYBOX=!1,r.REFLECTIONMAP_EXPLICIT=!1,r.REFLECTIONMAP_EQUIRECTANGULAR=!1,r.REFLECTIONMAP_EQUIRECTANGULAR_FIXED=!1,r.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED=!1,r.INVERTCUBICMAP=!1,r.USESPHERICALFROMREFLECTIONMAP=!1,r.USEIRRADIANCEMAP=!1,r.USE_IRRADIANCE_DOMINANT_DIRECTION=!1,r.USESPHERICALINVERTEX=!1,r.REFLECTIONMAP_OPPOSITEZ=!1,r.LODINREFLECTIONALPHA=!1,r.GAMMAREFLECTION=!1,r.RGBDREFLECTION=!1,r.LINEARSPECULARREFLECTION=!1;return!0}function eo(e,t,r,a,n,s,o){switch(o.needNormals=!0,void 0===n["LIGHT"+a]&&(o.needRebuild=!0),n["LIGHT"+a]=!0,n["SPOTLIGHT"+a]=!1,n["HEMILIGHT"+a]=!1,n["POINTLIGHT"+a]=!1,n["DIRLIGHT"+a]=!1,n["AREALIGHT"+a]=!1,n["CLUSTLIGHT"+a]=!1,r.prepareLightSpecificDefines(n,a),n["LIGHT_FALLOFF_PHYSICAL"+a]=!1,n["LIGHT_FALLOFF_GLTF"+a]=!1,n["LIGHT_FALLOFF_STANDARD"+a]=!1,r.falloffType){case i.LightConstants.FALLOFF_GLTF:n["LIGHT_FALLOFF_GLTF"+a]=!0;break;case i.LightConstants.FALLOFF_PHYSICAL:n["LIGHT_FALLOFF_PHYSICAL"+a]=!0;break;case i.LightConstants.FALLOFF_STANDARD:n["LIGHT_FALLOFF_STANDARD"+a]=!0}if(s&&!r.specular.equalsFloats(0,0,0)&&(o.specularEnabled=!0),n["SHADOW"+a]=!1,n["SHADOWCSM"+a]=!1,n["SHADOWCSMDEBUG"+a]=!1,n["SHADOWCSMNUM_CASCADES"+a]=!1,n["SHADOWCSMUSESHADOWMAXZ"+a]=!1,n["SHADOWCSMNOBLEND"+a]=!1,n["SHADOWCSM_RIGHTHANDED"+a]=!1,n["SHADOWPCF"+a]=!1,n["SHADOWPCSS"+a]=!1,n["SHADOWPOISSON"+a]=!1,n["SHADOWESM"+a]=!1,n["SHADOWCLOSEESM"+a]=!1,n["SHADOWCUBE"+a]=!1,n["SHADOWLOWQUALITY"+a]=!1,n["SHADOWMEDIUMQUALITY"+a]=!1,t&&t.receiveShadows&&e.shadowsEnabled&&r.shadowEnabled){let t=r.getShadowGenerator(e.activeCamera)??r.getShadowGenerator();if(t){let e=t.getShadowMap();e&&e.renderList&&e.renderList.length>0&&(o.shadowEnabled=!0,t.prepareDefines(n,a))}}r.lightmapMode!=i.LightConstants.LIGHTMAP_DEFAULT?(o.lightmapMode=!0,n["LIGHTMAPEXCLUDED"+a]=!0,n["LIGHTMAPNOSPECULAR"+a]=r.lightmapMode==i.LightConstants.LIGHTMAP_SHADOWSONLY):(n["LIGHTMAPEXCLUDED"+a]=!1,n["LIGHTMAPNOSPECULAR"+a]=!1)}function ef(e,t,r,i,a,n=null,s=!1){let o=ep(e,i);!1!==n&&(o=C(r,e,i)),!t.getColorWrite()!==i.DEPTHPREPASS&&(i.DEPTHPREPASS=!i.DEPTHPREPASS,o=!0),i.INSTANCES!==a&&(i.INSTANCES=a,o=!0),i.THIN_INSTANCES!==s&&(i.THIN_INSTANCES=s,o=!0),o&&i.markAsUnprocessed()}function ed(e,t){if(e.useBones&&e.computeBonesUsingShaders&&e.skeleton){t.NUM_BONE_INFLUENCERS=e.numBoneInfluencers;let r=void 0!==t.BONETEXTURE;if(e.skeleton.isUsingTextureForMatrices&&r)t.BONETEXTURE=!0;else{t.BonesPerMesh=e.skeleton.bones.length+1,t.BONETEXTURE=!r&&void 0;let i=e.getScene().prePassRenderer;i&&i.enabled&&(t.BONES_VELOCITY_ENABLED=-1===i.excludedSkinnedMesh.indexOf(e))}}else t.NUM_BONE_INFLUENCERS=0,t.BonesPerMesh=0,void 0!==t.BONETEXTURE&&(t.BONETEXTURE=!1)}function el(e,t){let r=e.morphTargetManager;r?(t.MORPHTARGETS_UV=r.supportsUVs&&t.UV1,t.MORPHTARGETS_UV2=r.supportsUV2s&&t.UV2,t.MORPHTARGETS_TANGENT=r.supportsTangents&&t.TANGENT,t.MORPHTARGETS_NORMAL=r.supportsNormals&&t.NORMAL,t.MORPHTARGETS_POSITION=r.supportsPositions,t.MORPHTARGETS_COLOR=r.supportsColors,t.MORPHTARGETTEXTURE_HASUVS=r.hasUVs,t.MORPHTARGETTEXTURE_HASUV2S=r.hasUV2s,t.MORPHTARGETTEXTURE_HASTANGENTS=r.hasTangents,t.MORPHTARGETTEXTURE_HASNORMALS=r.hasNormals,t.MORPHTARGETTEXTURE_HASPOSITIONS=r.hasPositions,t.MORPHTARGETTEXTURE_HASCOLORS=r.hasColors,t.NUM_MORPH_INFLUENCERS=r.numMaxInfluencers||r.numInfluencers,t.MORPHTARGETS=t.NUM_MORPH_INFLUENCERS>0,t.MORPHTARGETS_TEXTURE=r.isUsingTextureForTargets):(t.MORPHTARGETS_UV=!1,t.MORPHTARGETS_UV2=!1,t.MORPHTARGETS_TANGENT=!1,t.MORPHTARGETS_NORMAL=!1,t.MORPHTARGETS_POSITION=!1,t.MORPHTARGETS_COLOR=!1,t.MORPHTARGETTEXTURE_HASUVS=!1,t.MORPHTARGETTEXTURE_HASUV2S=!1,t.MORPHTARGETTEXTURE_HASTANGENTS=!1,t.MORPHTARGETTEXTURE_HASNORMALS=!1,t.MORPHTARGETTEXTURE_HASPOSITIONS=!1,t.MORPHTARGETTEXTURE_HAS_COLORS=!1,t.MORPHTARGETS=!1,t.NUM_MORPH_INFLUENCERS=0)}function eu(e,t){let r=e.bakedVertexAnimationManager;t.BAKED_VERTEX_ANIMATION_TEXTURE=!!r&&!!r.isEnabled}function ec(e,t,r,i,a=!1,n=!0,s=!0){if(!t._areAttributesDirty&&t._needNormals===t._normals&&t._needUVs===t._uvs)return!1;t._normals=t._needNormals,t._uvs=t._needUVs,t.NORMAL=t._needNormals&&e.isVerticesDataPresent("normal"),t._needNormals&&e.isVerticesDataPresent("tangent")&&(t.TANGENT=!0);for(let r=1;r<=6;++r)t["UV"+r]=!!t._needUVs&&e.isVerticesDataPresent(`uv${1===r?"":r}`);if(r){let r=e.useVertexColors&&e.isVerticesDataPresent("color");t.VERTEXCOLOR=r,t.VERTEXALPHA=e.hasVertexAlpha&&r&&n}return e.isVerticesDataPresent("instanceColor")&&(e.hasInstances||e.hasThinInstances)&&(t.INSTANCESCOLOR=!0),i&&ed(e,t),a&&el(e,t),s&&eu(e,t),!0}function eh(e,t){if(e.activeCamera){let r=t.MULTIVIEW;t.MULTIVIEW=null!==e.activeCamera.outputRenderTarget&&e.activeCamera.outputRenderTarget.getViewCount()>1,t.MULTIVIEW!=r&&t.markAsUnprocessed()}}function e_(e,t,r){let i=t.ORDER_INDEPENDENT_TRANSPARENCY,a=t.ORDER_INDEPENDENT_TRANSPARENCY_16BITS;t.ORDER_INDEPENDENT_TRANSPARENCY=e.useOrderIndependentTransparency&&r,t.ORDER_INDEPENDENT_TRANSPARENCY_16BITS=!e.getEngine().getCaps().textureFloatLinearFiltering,(i!==t.ORDER_INDEPENDENT_TRANSPARENCY||a!==t.ORDER_INDEPENDENT_TRANSPARENCY_16BITS)&&t.markAsUnprocessed()}function eE(e,t,r){let i=t.PREPASS;if(!t._arePrePassDirty)return;let a=[{type:1,define:"PREPASS_POSITION",index:"PREPASS_POSITION_INDEX"},{type:9,define:"PREPASS_LOCAL_POSITION",index:"PREPASS_LOCAL_POSITION_INDEX"},{type:2,define:"PREPASS_VELOCITY",index:"PREPASS_VELOCITY_INDEX"},{type:11,define:"PREPASS_VELOCITY_LINEAR",index:"PREPASS_VELOCITY_LINEAR_INDEX"},{type:3,define:"PREPASS_REFLECTIVITY",index:"PREPASS_REFLECTIVITY_INDEX"},{type:0,define:"PREPASS_IRRADIANCE",index:"PREPASS_IRRADIANCE_INDEX"},{type:7,define:"PREPASS_ALBEDO_SQRT",index:"PREPASS_ALBEDO_SQRT_INDEX"},{type:5,define:"PREPASS_DEPTH",index:"PREPASS_DEPTH_INDEX"},{type:10,define:"PREPASS_SCREENSPACE_DEPTH",index:"PREPASS_SCREENSPACE_DEPTH_INDEX"},{type:6,define:"PREPASS_NORMAL",index:"PREPASS_NORMAL_INDEX"},{type:8,define:"PREPASS_WORLD_NORMAL",index:"PREPASS_WORLD_NORMAL_INDEX"}];if(e.prePassRenderer&&e.prePassRenderer.enabled&&r){t.PREPASS=!0,t.SCENE_MRT_COUNT=e.prePassRenderer.mrtCount,t.PREPASS_NORMAL_WORLDSPACE=e.prePassRenderer.generateNormalsInWorldSpace,t.PREPASS_COLOR=!0,t.PREPASS_COLOR_INDEX=0;for(let r=0;r<a.length;r++){let i=e.prePassRenderer.getIndex(a[r].type);-1!==i?(t[a[r].define]=!0,t[a[r].index]=i):t[a[r].define]=!1}}else{t.PREPASS=!1;for(let e=0;e<a.length;e++)t[a[e].define]=!1}t.PREPASS!=i&&(t.markAsUnprocessed(),t.markAsImageProcessingDirty())}function ep(e,t){let r=!1;if(e.activeCamera){let i=+!!t.CAMERA_ORTHOGRAPHIC,a=+!!t.CAMERA_PERSPECTIVE,n=+(1===e.activeCamera.mode),s=+(0===e.activeCamera.mode);(i^n||a^s)&&(t.CAMERA_ORTHOGRAPHIC=1===n,t.CAMERA_PERSPECTIVE=1===s,r=!0)}return r}function em(e,t,r,i,a=null,n=!1,s=!1,o=!1){a&&a.push("Light"+e),!n&&(t.push("vLightData"+e,"vLightDiffuse"+e,"vLightSpecular"+e,"vLightDirection"+e,"vLightWidth"+e,"vLightHeight"+e,"vLightFalloff"+e,"vLightGround"+e,"vSliceData"+e,"vSliceRanges"+e,"lightMatrix"+e,"shadowsInfo"+e,"depthValues"+e),r.push("shadowTexture"+e),r.push("depthTexture"+e),t.push("viewFrustumZ"+e,"cascadeBlendFactor"+e,"lightSizeUVCorrection"+e,"depthCorrection"+e,"penumbraDarkness"+e,"frustumLengths"+e),i&&(r.push("projectionLightTexture"+e),t.push("textureProjectionMatrix"+e)),s&&r.push("iesLightTexture"+e),o&&(r.push("lightDataTexture"+e),r.push("tileMaskTexture"+e)))}function eT(e,t,r){let i=["vReflectionMicrosurfaceInfos","vReflectionDominantDirection","reflectionMatrix","vReflectionInfos","vReflectionPosition","vReflectionSize","vReflectionColor","vReflectionFilteringInfo"];r&&i.push("vSphericalX","vSphericalY","vSphericalZ","vSphericalXX_ZZ","vSphericalYY_ZZ","vSphericalZZ","vSphericalXY","vSphericalYZ","vSphericalZX","vSphericalL00","vSphericalL1_1","vSphericalL10","vSphericalL11","vSphericalL2_2","vSphericalL2_1","vSphericalL20","vSphericalL21","vSphericalL22"),e.push(...i),t.push("reflectionSampler","reflectionSamplerLow","reflectionSamplerHigh","irradianceSampler","icdfSampler")}function eS(e,t,r,i=4){let a,n;e.uniformsNames?(a=e.uniformsNames,n=e.uniformBuffersNames,t=e.samplers,r=e.defines,i=e.maxSimultaneousLights||0):(a=e,t||(t=[]));for(let e=0;e<i&&r["LIGHT"+e];e++)em(e,a,t,r["PROJECTEDLIGHTTEXTURE"+e],n,!1,r["IESLIGHTTEXTURE"+e],r["CLUSTLIGHT"+e]);r.NUM_MORPH_INFLUENCERS&&(a.push("morphTargetInfluences"),a.push("morphTargetCount")),r.BAKED_VERTEX_ANIMATION_TEXTURE&&(a.push("bakedVertexAnimationSettings"),a.push("bakedVertexAnimationTextureSizeInverted"),a.push("bakedVertexAnimationTime"),t.push("bakedVertexAnimationTexture"))}function eA(e,t=!1,r=!1,i=!1,a=!1,n=!1){e.addUniform("vReflectionInfos",2),e.addUniform("reflectionMatrix",16),t&&e.addUniform("vReflectionMicrosurfaceInfos",3),r&&(e.addUniform("vReflectionPosition",3),e.addUniform("vReflectionSize",3)),i&&(e.addUniform("vReflectionFilteringInfo",2),e.addUniform("vReflectionDominantDirection",3)),n&&e.addUniform("vReflectionColor",3),a&&(e.addUniform("vSphericalL00",3),e.addUniform("vSphericalL1_1",3),e.addUniform("vSphericalL10",3),e.addUniform("vSphericalL11",3),e.addUniform("vSphericalL2_2",3),e.addUniform("vSphericalL2_1",3),e.addUniform("vSphericalL20",3),e.addUniform("vSphericalL21",3),e.addUniform("vSphericalL22",3),e.addUniform("vSphericalX",3),e.addUniform("vSphericalY",3),e.addUniform("vSphericalZ",3),e.addUniform("vSphericalXX_ZZ",3),e.addUniform("vSphericalYY_ZZ",3),e.addUniform("vSphericalZZ",3),e.addUniform("vSphericalXY",3),e.addUniform("vSphericalYZ",3),e.addUniform("vSphericalZX",3))}e.s(["BindBonesParameters",()=>q,"BindFogParameters",()=>B,"BindIBLParameters",()=>k,"BindIBLSamplers",()=>Y,"BindLight",()=>J,"BindLightProperties",()=>j,"BindLights",()=>$,"BindMorphTargetParameters",()=>W,"BindSceneUniformBuffer",()=>X,"BindTextureMatrix",()=>K,"GetFogState",()=>ei,"HandleFallbacksForShadows",()=>er,"PrepareAttributesForBakedVertexAnimation",()=>Q,"PrepareAttributesForBones",()=>ee,"PrepareAttributesForInstances",()=>et,"PrepareAttributesForMorphTargets",()=>w,"PrepareAttributesForMorphTargetsInfluencers",()=>G,"PrepareDefinesAndAttributesForMorphTargets",()=>H,"PrepareDefinesForAttributes",()=>ec,"PrepareDefinesForBakedVertexAnimation",()=>eu,"PrepareDefinesForBones",()=>ed,"PrepareDefinesForCamera",()=>ep,"PrepareDefinesForFrameBoundValues",()=>ef,"PrepareDefinesForIBL",()=>es,"PrepareDefinesForLight",()=>eo,"PrepareDefinesForLights",()=>en,"PrepareDefinesForMergedUV",()=>Z,"PrepareDefinesForMisc",()=>ea,"PrepareDefinesForMorphTargets",()=>el,"PrepareDefinesForMultiview",()=>eh,"PrepareDefinesForOIT",()=>e_,"PrepareDefinesForPrePass",()=>eE,"PrepareUniformLayoutForIBL",()=>eA,"PrepareUniformsAndSamplersForIBL",()=>eT,"PrepareUniformsAndSamplersForLight",()=>em,"PrepareUniformsAndSamplersList",()=>eS,"PushAttributesForInstances",()=>z],788957)},980315,e=>{"use strict";var t=e.i(47662);let r="packingFunctions",i=`vec4 pack(float depth)
{const vec4 bit_shift=vec4(255.0*255.0*255.0,255.0*255.0,255.0,1.0);const vec4 bit_mask=vec4(0.0,1.0/255.0,1.0/255.0,1.0/255.0);vec4 res=fract(depth*bit_shift);res-=res.xxyz*bit_mask;return res;}
float unpack(vec4 color)
{const vec4 bit_shift=vec4(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);return dot(color,bit_shift);}`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["packingFunctions",0,{name:r,shader:i}])},281923,e=>{"use strict";var t=e.i(47662);e.i(981239),e.i(980315),e.i(179939);let r="depthPixelShader",i=`#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
varying float vDepthMetric;
#ifdef PACKED
#include<packingFunctions>
#endif
#ifdef STORE_CAMERASPACE_Z
varying vec4 vViewPos;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#ifdef STORE_CAMERASPACE_Z
#ifdef PACKED
gl_FragColor=pack(vViewPos.z);
#else
gl_FragColor=vec4(vViewPos.z,0.0,0.0,1.0);
#endif
#else
#ifdef NONLINEARDEPTH
#ifdef PACKED
gl_FragColor=pack(gl_FragCoord.z);
#else
gl_FragColor=vec4(gl_FragCoord.z,0.0,0.0,0.0);
#endif
#else
#ifdef PACKED
gl_FragColor=pack(vDepthMetric);
#else
gl_FragColor=vec4(vDepthMetric,0.0,0.0,1.0);
#endif
#endif
#endif
}`;t.ShaderStore.ShadersStore[r]||(t.ShaderStore.ShadersStore[r]=i),e.s(["depthPixelShader",0,{name:r,shader:i}])},764029,e=>{"use strict";var t=e.i(47662);let r="minmaxReduxPixelShader",i=`varying vUV: vec2f;var textureSampler: texture_2d<f32>;
#if defined(INITIAL)
uniform texSize: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let coord=vec2i(fragmentInputs.vUV*(uniforms.texSize-1.0));let f1=textureLoad(textureSampler,coord,0).r;let f2=textureLoad(textureSampler,coord+vec2i(1,0),0).r;let f3=textureLoad(textureSampler,coord+vec2i(1,1),0).r;let f4=textureLoad(textureSampler,coord+vec2i(0,1),0).r;
#ifdef DEPTH_REDUX
#ifdef VIEW_DEPTH
var minz=3.4e38;if (f1 != 0.0) { minz=f1; }
if (f2 != 0.0) { minz=min(minz,f2); }
if (f3 != 0.0) { minz=min(minz,f3); }
if (f4 != 0.0) { minz=min(minz,f4); }
let maxz=max(max(max(f1,f2),f3),f4);
#else
let minz=min(min(min(f1,f2),f3),f4);let maxz=max(max(max(sign(1.0-f1)*f1,sign(1.0-f2)*f2),sign(1.0-f3)*f3),sign(1.0-f4)*f4);
#endif
#else
let minz=min(min(min(f1,f2),f3),f4);let maxz=max(max(max(f1,f2),f3),f4);
#endif
fragmentOutputs.color=vec4f(minz,maxz,0.,0.);}
#elif defined(MAIN)
uniform texSize: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let coord=vec2i(fragmentInputs.vUV*(uniforms.texSize-1.0));let f1=textureLoad(textureSampler,coord,0).rg;let f2=textureLoad(textureSampler,coord+vec2i(1,0),0).rg;let f3=textureLoad(textureSampler,coord+vec2i(1,1),0).rg;let f4=textureLoad(textureSampler,coord+vec2i(0,1),0).rg;let minz=min(min(min(f1.x,f2.x),f3.x),f4.x);let maxz=max(max(max(f1.y,f2.y),f3.y),f4.y);fragmentOutputs.color=vec4(minz,maxz,0.,0.);}
#elif defined(ONEBEFORELAST)
uniform texSize: vec2i;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let coord=vec2i(fragmentInputs.vUV*vec2f(uniforms.texSize-1));let f1=textureLoad(textureSampler,coord % uniforms.texSize,0).rg;let f2=textureLoad(textureSampler,(coord+vec2i(1,0)) % uniforms.texSize,0).rg;let f3=textureLoad(textureSampler,(coord+vec2i(1,1)) % uniforms.texSize,0).rg;let f4=textureLoad(textureSampler,(coord+vec2i(0,1)) % uniforms.texSize,0).rg;let minz=min(min(min(f1.x,f2.x),f3.x),f4.x);let maxz=max(max(max(f1.y,f2.y),f3.y),f4.y);fragmentOutputs.color=vec4(minz,maxz,0.,0.);}
#elif defined(LAST)
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(0.);if (true) { 
discard;}}
#endif
`;t.ShaderStore.ShadersStoreWGSL[r]||(t.ShaderStore.ShadersStoreWGSL[r]=i),e.s(["minmaxReduxPixelShaderWGSL",0,{name:r,shader:i}])},926089,e=>{"use strict";var t=e.i(239018);class r{}r.POINTERDOWN=1,r.POINTERUP=2,r.POINTERMOVE=4,r.POINTERWHEEL=8,r.POINTERPICK=16,r.POINTERTAP=32,r.POINTERDOUBLETAP=64;class i{constructor(e,t){this.type=e,this.event=t}}class a extends i{constructor(e,r,i,a){super(e,r),this.ray=null,this.originalPickingInfo=null,this.skipOnPointerObservable=!1,this.localPosition=new t.Vector2(i,a)}}class n extends i{get pickInfo(){return this._pickInfo||this._generatePickInfo(),this._pickInfo}constructor(e,t,r,i=null){super(e,t),this._pickInfo=r,this._inputManager=i}_generatePickInfo(){this._inputManager&&(this._pickInfo=this._inputManager._pickMove(this.event),this._inputManager._setRayOnPointerInfo(this._pickInfo,this.event),this._inputManager=null)}}e.s(["PointerEventTypes",()=>r,"PointerInfo",()=>n,"PointerInfoPre",()=>a])},651419,e=>{"use strict";var t=e.i(47662);let r="minmaxReduxPixelShader",i=`varying vec2 vUV;uniform sampler2D textureSampler;
#if defined(INITIAL)
uniform vec2 texSize;void main(void)
{ivec2 coord=ivec2(vUV*(texSize-1.0));float f1=texelFetch(textureSampler,coord,0).r;float f2=texelFetch(textureSampler,coord+ivec2(1,0),0).r;float f3=texelFetch(textureSampler,coord+ivec2(1,1),0).r;float f4=texelFetch(textureSampler,coord+ivec2(0,1),0).r;
#ifdef DEPTH_REDUX
#ifdef VIEW_DEPTH
float minz=3.4e38;if (f1 != 0.0) { minz=f1; }
if (f2 != 0.0) { minz=min(minz,f2); }
if (f3 != 0.0) { minz=min(minz,f3); }
if (f4 != 0.0) { minz=min(minz,f4); }
float maxz=max(max(max(f1,f2),f3),f4);
#else
float minz=min(min(min(f1,f2),f3),f4);float maxz=max(max(max(sign(1.0-f1)*f1,sign(1.0-f2)*f2),sign(1.0-f3)*f3),sign(1.0-f4)*f4);
#endif
#else
float minz=min(min(min(f1,f2),f3),f4);float maxz=max(max(max(f1,f2),f3),f4);
#endif
glFragColor=vec4(minz,maxz,0.,0.);}
#elif defined(MAIN)
uniform vec2 texSize;void main(void)
{ivec2 coord=ivec2(vUV*(texSize-1.0));vec2 f1=texelFetch(textureSampler,coord,0).rg;vec2 f2=texelFetch(textureSampler,coord+ivec2(1,0),0).rg;vec2 f3=texelFetch(textureSampler,coord+ivec2(1,1),0).rg;vec2 f4=texelFetch(textureSampler,coord+ivec2(0,1),0).rg;float minz=min(min(min(f1.x,f2.x),f3.x),f4.x);float maxz=max(max(max(f1.y,f2.y),f3.y),f4.y);glFragColor=vec4(minz,maxz,0.,0.);}
#elif defined(ONEBEFORELAST)
uniform ivec2 texSize;void main(void)
{ivec2 coord=ivec2(vUV*vec2(texSize-1));vec2 f1=texelFetch(textureSampler,coord % texSize,0).rg;vec2 f2=texelFetch(textureSampler,(coord+ivec2(1,0)) % texSize,0).rg;vec2 f3=texelFetch(textureSampler,(coord+ivec2(1,1)) % texSize,0).rg;vec2 f4=texelFetch(textureSampler,(coord+ivec2(0,1)) % texSize,0).rg;float minz=min(min(min(f1.x,f2.x),f3.x),f4.x);float maxz=max(max(max(f1.y,f2.y),f3.y),f4.y);glFragColor=vec4(minz,maxz,0.,0.);}
#elif defined(LAST)
void main(void)
{glFragColor=vec4(0.);if (true) { 
discard;}}
#endif
`;t.ShaderStore.ShadersStore[r]||(t.ShaderStore.ShadersStore[r]=i),e.s(["minmaxReduxPixelShader",0,{name:r,shader:i}])},734760,e=>{"use strict";var t=e.i(47662);let r="clipPlaneVertex",i=`#ifdef CLIPPLANE
fClipDistance=dot(worldPos,vClipPlane);
#endif
#ifdef CLIPPLANE2
fClipDistance2=dot(worldPos,vClipPlane2);
#endif
#ifdef CLIPPLANE3
fClipDistance3=dot(worldPos,vClipPlane3);
#endif
#ifdef CLIPPLANE4
fClipDistance4=dot(worldPos,vClipPlane4);
#endif
#ifdef CLIPPLANE5
fClipDistance5=dot(worldPos,vClipPlane5);
#endif
#ifdef CLIPPLANE6
fClipDistance6=dot(worldPos,vClipPlane6);
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["clipPlaneVertex",0,{name:r,shader:i}])},59092,e=>{"use strict";var t=e.i(47662);let r="clipPlaneVertexDeclaration",i=`#ifdef CLIPPLANE
uniform vec4 vClipPlane;varying float fClipDistance;
#endif
#ifdef CLIPPLANE2
uniform vec4 vClipPlane2;varying float fClipDistance2;
#endif
#ifdef CLIPPLANE3
uniform vec4 vClipPlane3;varying float fClipDistance3;
#endif
#ifdef CLIPPLANE4
uniform vec4 vClipPlane4;varying float fClipDistance4;
#endif
#ifdef CLIPPLANE5
uniform vec4 vClipPlane5;varying float fClipDistance5;
#endif
#ifdef CLIPPLANE6
uniform vec4 vClipPlane6;varying float fClipDistance6;
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["clipPlaneVertexDeclaration",0,{name:r,shader:i}])},988335,e=>{"use strict";var t=e.i(47662);let r="morphTargetsVertexGlobal",i=`#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
float vertexID;
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["morphTargetsVertexGlobal",0,{name:r,shader:i}])},52690,e=>{"use strict";var t=e.i(47662);let r="morphTargetsVertexGlobalDeclaration",i=`#ifdef MORPHTARGETS
uniform float morphTargetInfluences[NUM_MORPH_INFLUENCERS];
#ifdef MORPHTARGETS_TEXTURE 
uniform float morphTargetTextureIndices[NUM_MORPH_INFLUENCERS];uniform vec3 morphTargetTextureInfo;uniform highp sampler2DArray morphTargets;vec3 readVector3FromRawSampler(int targetIndex,float vertexIndex)
{ 
float y=floor(vertexIndex/morphTargetTextureInfo.y);float x=vertexIndex-y*morphTargetTextureInfo.y;vec3 textureUV=vec3((x+0.5)/morphTargetTextureInfo.y,(y+0.5)/morphTargetTextureInfo.z,morphTargetTextureIndices[targetIndex]);return texture(morphTargets,textureUV).xyz;}
vec4 readVector4FromRawSampler(int targetIndex,float vertexIndex)
{ 
float y=floor(vertexIndex/morphTargetTextureInfo.y);float x=vertexIndex-y*morphTargetTextureInfo.y;vec3 textureUV=vec3((x+0.5)/morphTargetTextureInfo.y,(y+0.5)/morphTargetTextureInfo.z,morphTargetTextureIndices[targetIndex]);return texture(morphTargets,textureUV);}
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["morphTargetsVertexGlobalDeclaration",0,{name:r,shader:i}])},910370,e=>{"use strict";var t=e.i(47662);let r="morphTargetsVertexDeclaration",i=`#ifdef MORPHTARGETS
#ifndef MORPHTARGETS_TEXTURE
#ifdef MORPHTARGETS_POSITION
attribute vec3 position{X};
#endif
#ifdef MORPHTARGETS_NORMAL
attribute vec3 normal{X};
#endif
#ifdef MORPHTARGETS_TANGENT
attribute vec3 tangent{X};
#endif
#ifdef MORPHTARGETS_UV
attribute vec2 uv_{X};
#endif
#ifdef MORPHTARGETS_UV2
attribute vec2 uv2_{X};
#endif
#ifdef MORPHTARGETS_COLOR
attribute vec4 color{X};
#endif
#elif {X}==0
uniform float morphTargetCount;
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["morphTargetsVertexDeclaration",0,{name:r,shader:i}])},616389,e=>{"use strict";var t=e.i(47662);let r="morphTargetsVertex",i=`#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
#if {X}==0
for (int i=0; i<NUM_MORPH_INFLUENCERS; i++) {if (float(i)>=morphTargetCount) break;vertexID=float(gl_VertexID)*morphTargetTextureInfo.x;
#ifdef MORPHTARGETS_POSITION
positionUpdated+=(readVector3FromRawSampler(i,vertexID)-position)*morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASPOSITIONS
vertexID+=1.0;
#endif
#ifdef MORPHTARGETS_NORMAL
normalUpdated+=(readVector3FromRawSampler(i,vertexID) -normal)*morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASNORMALS
vertexID+=1.0;
#endif
#ifdef MORPHTARGETS_UV
uvUpdated+=(readVector3FromRawSampler(i,vertexID).xy-uv)*morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASUVS
vertexID+=1.0;
#endif
#ifdef MORPHTARGETS_TANGENT
tangentUpdated.xyz+=(readVector3FromRawSampler(i,vertexID) -tangent.xyz)*morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASTANGENTS
vertexID+=1.0;
#endif
#ifdef MORPHTARGETS_UV2
uv2Updated+=(readVector3FromRawSampler(i,vertexID).xy-uv2)*morphTargetInfluences[i];
#endif
#ifdef MORPHTARGETTEXTURE_HASUV2S
vertexID+=1.0;
#endif
#ifdef MORPHTARGETS_COLOR
colorUpdated+=(readVector4FromRawSampler(i,vertexID)-color)*morphTargetInfluences[i];
#endif
}
#endif
#else
#ifdef MORPHTARGETS_POSITION
positionUpdated+=(position{X}-position)*morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_NORMAL
normalUpdated+=(normal{X}-normal)*morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_TANGENT
tangentUpdated.xyz+=(tangent{X}-tangent.xyz)*morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_UV
uvUpdated+=(uv_{X}-uv)*morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_UV2
uv2Updated+=(uv2_{X}-uv2)*morphTargetInfluences[{X}];
#endif
#ifdef MORPHTARGETS_COLOR
colorUpdated+=(color{X}-color)*morphTargetInfluences[{X}];
#endif
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["morphTargetsVertex",0,{name:r,shader:i}])},432817,e=>{"use strict";var t=e.i(47662);let r="instancesVertex",i=`#ifdef INSTANCES
mat4 finalWorld=mat4(world0,world1,world2,world3);
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
mat4 finalPreviousWorld=mat4(previousWorld0,previousWorld1,
previousWorld2,previousWorld3);
#endif
#ifdef THIN_INSTANCES
finalWorld=world*finalWorld;
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
finalPreviousWorld=previousWorld*finalPreviousWorld;
#endif
#endif
#else
mat4 finalWorld=world;
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
mat4 finalPreviousWorld=previousWorld;
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s([])},608559,e=>{"use strict";var t=e.i(47662);let r="instancesDeclaration",i=`#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#ifdef INSTANCESCOLOR
attribute vec4 instanceColor;
#endif
#if defined(THIN_INSTANCES) && !defined(WORLD_UBO)
uniform mat4 world;
#endif
#if defined(VELOCITY) || defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
attribute vec4 previousWorld0;attribute vec4 previousWorld1;attribute vec4 previousWorld2;attribute vec4 previousWorld3;
#ifdef THIN_INSTANCES
uniform mat4 previousWorld;
#endif
#endif
#else
#if !defined(WORLD_UBO)
uniform mat4 world;
#endif
#if defined(VELOCITY) || defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
uniform mat4 previousWorld;
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s([])},168489,e=>{"use strict";var t=e.i(47662);let r="bonesDeclaration",i=`#if NUM_BONE_INFLUENCERS>0
attribute vec4 matricesIndices;attribute vec4 matricesWeights;
#if NUM_BONE_INFLUENCERS>4
attribute vec4 matricesIndicesExtra;attribute vec4 matricesWeightsExtra;
#endif
#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#ifdef BONETEXTURE
uniform highp sampler2D boneSampler;uniform float boneTextureWidth;
#else
uniform mat4 mBones[BonesPerMesh];
#endif
#ifdef BONES_VELOCITY_ENABLED
uniform mat4 mPreviousBones[BonesPerMesh];
#endif
#ifdef BONETEXTURE
#define inline
mat4 readMatrixFromRawSampler(sampler2D smp,float index)
{float offset=index *4.0;float dx=1.0/boneTextureWidth;vec4 m0=texture2D(smp,vec2(dx*(offset+0.5),0.));vec4 m1=texture2D(smp,vec2(dx*(offset+1.5),0.));vec4 m2=texture2D(smp,vec2(dx*(offset+2.5),0.));vec4 m3=texture2D(smp,vec2(dx*(offset+3.5),0.));return mat4(m0,m1,m2,m3);}
#endif
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["bonesDeclaration",0,{name:r,shader:i}])},359862,e=>{"use strict";var t=e.i(47662);let r="bonesVertex",i=`#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#if NUM_BONE_INFLUENCERS>0
mat4 influence;
#ifdef BONETEXTURE
influence=readMatrixFromRawSampler(boneSampler,matricesIndices[0])*matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
influence+=readMatrixFromRawSampler(boneSampler,matricesIndices[1])*matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
influence+=readMatrixFromRawSampler(boneSampler,matricesIndices[2])*matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
influence+=readMatrixFromRawSampler(boneSampler,matricesIndices[3])*matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
influence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[0])*matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
influence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[1])*matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
influence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[2])*matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
influence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[3])*matricesWeightsExtra[3];
#endif
#else
influence=mBones[int(matricesIndices[0])]*matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
influence+=mBones[int(matricesIndices[1])]*matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
influence+=mBones[int(matricesIndices[2])]*matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
influence+=mBones[int(matricesIndices[3])]*matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
influence+=mBones[int(matricesIndicesExtra[0])]*matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
influence+=mBones[int(matricesIndicesExtra[1])]*matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
influence+=mBones[int(matricesIndicesExtra[2])]*matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
influence+=mBones[int(matricesIndicesExtra[3])]*matricesWeightsExtra[3];
#endif
#endif
finalWorld=finalWorld*influence;
#endif
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s(["bonesVertex",0,{name:r,shader:i}])},458483,402947,e=>{"use strict";var t=e.i(47662);let r="bakedVertexAnimationDeclaration",i=`#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
uniform float bakedVertexAnimationTime;uniform vec2 bakedVertexAnimationTextureSizeInverted;uniform vec4 bakedVertexAnimationSettings;uniform sampler2D bakedVertexAnimationTexture;
#ifdef INSTANCES
attribute vec4 bakedVertexAnimationSettingsInstanced;
#endif
#define inline
mat4 readMatrixFromRawSamplerVAT(sampler2D smp,float index,float frame)
{float offset=index*4.0;float frameUV=(frame+0.5)*bakedVertexAnimationTextureSizeInverted.y;float dx=bakedVertexAnimationTextureSizeInverted.x;vec4 m0=texture2D(smp,vec2(dx*(offset+0.5),frameUV));vec4 m1=texture2D(smp,vec2(dx*(offset+1.5),frameUV));vec4 m2=texture2D(smp,vec2(dx*(offset+2.5),frameUV));vec4 m3=texture2D(smp,vec2(dx*(offset+3.5),frameUV));return mat4(m0,m1,m2,m3);}
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s([],458483);let a="bakedVertexAnimation",n=`#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
{
#ifdef INSTANCES
#define BVASNAME bakedVertexAnimationSettingsInstanced
#else
#define BVASNAME bakedVertexAnimationSettings
#endif
float VATStartFrame=BVASNAME.x;float VATEndFrame=BVASNAME.y;float VATOffsetFrame=BVASNAME.z;float VATSpeed=BVASNAME.w;float totalFrames=VATEndFrame-VATStartFrame+1.0;float time=bakedVertexAnimationTime*VATSpeed/totalFrames;float frameCorrection=time<1.0 ? 0.0 : 1.0;float numOfFrames=totalFrames-frameCorrection;float VATFrameNum=fract(time)*numOfFrames;VATFrameNum=mod(VATFrameNum+VATOffsetFrame,numOfFrames);VATFrameNum=floor(VATFrameNum);VATFrameNum+=VATStartFrame+frameCorrection;mat4 VATInfluence;VATInfluence=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndices[0],VATFrameNum)*matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
VATInfluence+=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndices[1],VATFrameNum)*matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
VATInfluence+=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndices[2],VATFrameNum)*matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
VATInfluence+=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndices[3],VATFrameNum)*matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
VATInfluence+=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndicesExtra[0],VATFrameNum)*matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
VATInfluence+=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndicesExtra[1],VATFrameNum)*matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
VATInfluence+=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndicesExtra[2],VATFrameNum)*matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
VATInfluence+=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,matricesIndicesExtra[3],VATFrameNum)*matricesWeightsExtra[3];
#endif
finalWorld=finalWorld*VATInfluence;}
#endif
`;t.ShaderStore.IncludesShadersStore[a]||(t.ShaderStore.IncludesShadersStore[a]=n),e.s([],402947)},90142,e=>{"use strict";var t=e.i(47662);let r="pointCloudVertex",i=`#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.s([])},197913,e=>{"use strict";var t=e.i(47662);e.i(168489),e.i(458483),e.i(52690),e.i(910370),e.i(59092),e.i(608559);let r="pointCloudVertexDeclaration",i=`#ifdef POINTSIZE
uniform float pointSize;
#endif
`;t.ShaderStore.IncludesShadersStore[r]||(t.ShaderStore.IncludesShadersStore[r]=i),e.i(988335),e.i(616389),e.i(432817),e.i(359862),e.i(402947),e.i(734760),e.i(90142);let a="depthVertexShader",n=`attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;uniform vec2 depthValues;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform mat4 view;varying vec4 vViewPos;
#endif
#include<pointCloudVertexDeclaration>
varying float vDepthMetric;
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
#include<clipPlaneVertex>
gl_Position=viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vViewPos=view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));
#else
vDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<pointCloudVertex>
}
`;t.ShaderStore.ShadersStore[a]||(t.ShaderStore.ShadersStore[a]=n),e.s(["depthVertexShader",0,{name:a,shader:n}],197913)},813960,e=>{"use strict";var t=e.i(622623),r=e.i(239018),i=e.i(998583),a=e.i(566452),n=e.i(910421),s=e.i(621217),o=e.i(857746);class f{constructor(){this._doNotSerialize=!1,this._isDisposed=!1,this._sceneRootNodesIndex=-1,this._isEnabled=!0,this._isParentEnabled=!0,this._isReady=!0,this._onEnabledStateChangedObservable=new a.Observable,this._onClonedObservable=new a.Observable,this._inheritVisibility=!1,this._isVisible=!0}}class d{static AddNodeConstructor(e,t){this._NodeConstructors[e]=t}static Construct(e,t,r,i){let a=this._NodeConstructors[e];return a?a(t,r,i):null}set accessibilityTag(e){this._accessibilityTag=e,this.onAccessibilityTagChangedObservable.notifyObservers(e)}get accessibilityTag(){return this._accessibilityTag}get doNotSerialize(){return!!this._nodeDataStorage._doNotSerialize||!!this._parentNode&&this._parentNode.doNotSerialize}set doNotSerialize(e){this._nodeDataStorage._doNotSerialize=e}isDisposed(){return this._nodeDataStorage._isDisposed}set parent(e){if(this._parentNode===e)return;let t=this._parentNode;if(this._parentNode&&void 0!==this._parentNode._children&&null!==this._parentNode._children){let t=this._parentNode._children.indexOf(this);-1!==t&&this._parentNode._children.splice(t,1),e||this._nodeDataStorage._isDisposed||this._addToSceneRootNodes()}this._parentNode=e,this._isDirty=!0,this._parentNode&&((void 0===this._parentNode._children||null===this._parentNode._children)&&(this._parentNode._children=[]),this._parentNode._children.push(this),t||this._removeFromSceneRootNodes()),this._syncParentEnabledState()}get parent(){return this._parentNode}get inheritVisibility(){return this._nodeDataStorage._inheritVisibility}set inheritVisibility(e){this._nodeDataStorage._inheritVisibility=e}get isVisible(){return(!this.inheritVisibility||!this._parentNode||!!this._parentNode.isVisible)&&this._nodeDataStorage._isVisible}set isVisible(e){this._nodeDataStorage._isVisible=e}_serializeAsParent(e){e.parentId=this.uniqueId}_addToSceneRootNodes(){-1===this._nodeDataStorage._sceneRootNodesIndex&&(this._nodeDataStorage._sceneRootNodesIndex=this._scene.rootNodes.length,this._scene.rootNodes.push(this))}_removeFromSceneRootNodes(){if(-1!==this._nodeDataStorage._sceneRootNodesIndex){let e=this._scene.rootNodes,t=e.length-1;e[this._nodeDataStorage._sceneRootNodesIndex]=e[t],e[this._nodeDataStorage._sceneRootNodesIndex]._nodeDataStorage._sceneRootNodesIndex=this._nodeDataStorage._sceneRootNodesIndex,this._scene.rootNodes.pop(),this._nodeDataStorage._sceneRootNodesIndex=-1}}get animationPropertiesOverride(){return this._animationPropertiesOverride?this._animationPropertiesOverride:this._scene.animationPropertiesOverride}set animationPropertiesOverride(e){this._animationPropertiesOverride=e}getClassName(){return"Node"}set onDispose(e){this._onDisposeObserver&&this.onDisposeObservable.remove(this._onDisposeObserver),this._onDisposeObserver=this.onDisposeObservable.add(e)}get onEnabledStateChangedObservable(){return this._nodeDataStorage._onEnabledStateChangedObservable}get onClonedObservable(){return this._nodeDataStorage._onClonedObservable}constructor(e,t=null,i=!0){this._isDirty=!1,this._nodeDataStorage=new f,this.state="",this.metadata=null,this.reservedDataStore=null,this._accessibilityTag=null,this.onAccessibilityTagChangedObservable=new a.Observable,this._parentContainer=null,this.animations=[],this._ranges={},this.onReady=null,this._currentRenderId=-1,this._parentUpdateId=-1,this._childUpdateId=-1,this._waitingParentId=null,this._waitingParentInstanceIndex=null,this._waitingParsedUniqueId=null,this._cache={},this._parentNode=null,this._children=null,this._worldMatrix=r.Matrix.Identity(),this._worldMatrixDeterminant=0,this._worldMatrixDeterminantIsDirty=!0,this._animationPropertiesOverride=null,this._isNode=!0,this.onDisposeObservable=new a.Observable,this._onDisposeObserver=null,this._behaviors=[],this.name=e,this.id=e,this._scene=t||n.EngineStore.LastCreatedScene,this.uniqueId=this._scene.getUniqueId(),this._initCache(),i&&this._addToSceneRootNodes()}getScene(){return this._scene}getEngine(){return this._scene.getEngine()}addBehavior(e,t=!1){return -1!==this._behaviors.indexOf(e)||(e.init(),this._scene.isLoading&&!t?this._scene.onDataLoadedObservable.addOnce(()=>{this._behaviors.includes(e)&&e.attach(this)}):e.attach(this),this._behaviors.push(e)),this}removeBehavior(e){let t=this._behaviors.indexOf(e);return -1===t||(this._behaviors[t].detach(),this._behaviors.splice(t,1)),this}get behaviors(){return this._behaviors}getBehaviorByName(e){for(let t of this._behaviors)if(t.name===e)return t;return null}getWorldMatrix(){return this._currentRenderId!==this._scene.getRenderId()&&this.computeWorldMatrix(),this._worldMatrix}_getWorldMatrixDeterminant(){return this._worldMatrixDeterminantIsDirty&&(this._worldMatrixDeterminantIsDirty=!1,this._worldMatrixDeterminant=this._worldMatrix.determinant()),this._worldMatrixDeterminant}get worldMatrixFromCache(){return this._worldMatrix}_initCache(){this._cache={}}updateCache(e){!e&&this.isSynchronized()||this._updateCache()}_getActionManagerForTrigger(e,t=!0){return this.parent?this.parent._getActionManagerForTrigger(e,!1):null}_updateCache(e){}_isSynchronized(){return!0}_markSyncedWithParent(){this._parentNode&&(this._parentUpdateId=this._parentNode._childUpdateId)}isSynchronizedWithParent(){return!this._parentNode||!this._parentNode._isDirty&&this._parentUpdateId===this._parentNode._childUpdateId&&this._parentNode.isSynchronized()}isSynchronized(){return(!this._parentNode||!!this.isSynchronizedWithParent())&&this._isSynchronized()}isReady(e=!1){return this._nodeDataStorage._isReady}markAsDirty(e){return this._currentRenderId=Number.MAX_VALUE,this._isDirty=!0,this}isEnabled(e=!0){return!1===e?this._nodeDataStorage._isEnabled:!!this._nodeDataStorage._isEnabled&&this._nodeDataStorage._isParentEnabled}_syncParentEnabledState(){if(this._nodeDataStorage._isParentEnabled=!this._parentNode||this._parentNode.isEnabled(),this._children)for(let e of this._children)e._syncParentEnabledState()}setEnabled(e){this._nodeDataStorage._isEnabled!==e&&(this._nodeDataStorage._isEnabled=e,this._syncParentEnabledState(),this._nodeDataStorage._onEnabledStateChangedObservable.notifyObservers(e))}isDescendantOf(e){return!!this.parent&&(this.parent===e||this.parent.isDescendantOf(e))}_getDescendants(e,t=!1,r){if(this._children)for(let i=0;i<this._children.length;i++){let a=this._children[i];(!r||r(a))&&e.push(a),t||a._getDescendants(e,!1,r)}}getDescendants(e,t){let r=[];return this._getDescendants(r,e,t),r}getChildMeshes(e,t){let r=[];return this._getDescendants(r,e,e=>(!t||t(e))&&void 0!==e.cullingStrategy),r}getChildren(e,t=!0){return this.getDescendants(t,e)}_setReady(e){if(e!==this._nodeDataStorage._isReady){if(!e){this._nodeDataStorage._isReady=!1;return}this.onReady&&this.onReady(this),this._nodeDataStorage._isReady=!0}}getAnimationByName(e){for(let t=0;t<this.animations.length;t++){let r=this.animations[t];if(r.name===e)return r}return null}createAnimationRange(e,t,r){if(!this._ranges[e]){this._ranges[e]=d._AnimationRangeFactory(e,t,r);for(let i=0,a=this.animations.length;i<a;i++)this.animations[i]&&this.animations[i].createRange(e,t,r)}}deleteAnimationRange(e,t=!0){for(let r=0,i=this.animations.length;r<i;r++)this.animations[r]&&this.animations[r].deleteRange(e,t);this._ranges[e]=null}getAnimationRange(e){return this._ranges[e]||null}clone(e,t,r){let i=o.SerializationHelper.Clone(()=>new d(e,this.getScene()),this);if(t&&(i.parent=t),!r){let t=this.getDescendants(!0);for(let r=0;r<t.length;r++){let a=t[r];a.clone(e+"."+a.name,i)}}return i}getAnimationRanges(){let e,t=[];for(e in this._ranges)t.push(this._ranges[e]);return t}beginAnimation(e,t,r,i){let a=this.getAnimationRange(e);return a?this._scene.beginAnimation(this,a.from,a.to,t,r,i):null}serializeAnimationRanges(){let e=[];for(let t in this._ranges){let r=this._ranges[t];if(!r)continue;let i={};i.name=t,i.from=r.from,i.to=r.to,e.push(i)}return e}computeWorldMatrix(e){return this._worldMatrix||(this._worldMatrix=r.Matrix.Identity()),this._worldMatrix}dispose(e,t=!1){if(this._nodeDataStorage._isDisposed=!0,!e)for(let r of this.getDescendants(!0))r.dispose(e,t);for(let e of(this.parent?this.parent=null:this._removeFromSceneRootNodes(),this.onDisposeObservable.notifyObservers(this),this.onDisposeObservable.clear(),this.onEnabledStateChangedObservable.clear(),this.onClonedObservable.clear(),this._behaviors))e.detach();this._behaviors.length=0,this.metadata=null}static ParseAnimationRanges(e,t,r){if(t.ranges)for(let r=0;r<t.ranges.length;r++){let i=t.ranges[r];e.createAnimationRange(i.name,i.from,i.to)}}getHierarchyBoundingVectors(e=!0,t=null){let i,a;if(this.getScene().incrementRenderId(),this.computeWorldMatrix(!0),this.getBoundingInfo&&this.subMeshes){let e=this.getBoundingInfo();i=e.boundingBox.minimumWorld.clone(),a=e.boundingBox.maximumWorld.clone()}else i=new r.Vector3(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),a=new r.Vector3(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);if(e)for(let e of this.getDescendants(!1)){if(e.computeWorldMatrix(!0),t&&!t(e)||!e.getBoundingInfo||0===e.getTotalVertices())continue;let n=e.getBoundingInfo().boundingBox,s=n.minimumWorld,o=n.maximumWorld;r.Vector3.CheckExtends(s,i,a),r.Vector3.CheckExtends(o,i,a)}return{min:i,max:a}}}d._AnimationRangeFactory=(e,t,r)=>{throw(0,s._WarnImport)("AnimationRange")},d._NodeConstructors={},(0,t.__decorate)([(0,i.serialize)()],d.prototype,"name",void 0),(0,t.__decorate)([(0,i.serialize)()],d.prototype,"id",void 0),(0,t.__decorate)([(0,i.serialize)()],d.prototype,"uniqueId",void 0),(0,t.__decorate)([(0,i.serialize)()],d.prototype,"state",void 0),(0,t.__decorate)([(0,i.serialize)()],d.prototype,"metadata",void 0),e.s(["Node",()=>d])},747290,e=>{"use strict";var t=e.i(4527),r=e.i(901622);class i{constructor(e,t,r=!1,i,a=!1,n){this._uniformNames=[],this._valueCache={},this._engine=e,this._noUBO=!e.supportsUniformBuffers||a,this._dynamic=r,this._name=i??"no-name",this._data=t||[],this._uniformLocations={},this._uniformSizes={},this._uniformArraySizes={},this._uniformLocationPointer=0,this._needSync=!1,this._trackUBOsInFrame=!1,(void 0===n&&this._engine._features.trackUbosInFrame||!0===n)&&(this._buffers=[],this._bufferIndex=-1,this._bufferUpdatedLastFrame=!1,this._createBufferOnWrite=!1,this._currentFrameId=0,this._trackUBOsInFrame=!0),this._noUBO?(this.updateMatrix3x3=this._updateMatrix3x3ForEffect,this.updateMatrix2x2=this._updateMatrix2x2ForEffect,this.updateFloat=this._updateFloatForEffect,this.updateFloat2=this._updateFloat2ForEffect,this.updateFloat3=this._updateFloat3ForEffect,this.updateFloat4=this._updateFloat4ForEffect,this.updateFloatArray=this._updateFloatArrayForEffect,this.updateArray=this._updateArrayForEffect,this.updateIntArray=this._updateIntArrayForEffect,this.updateUIntArray=this._updateUIntArrayForEffect,this.updateMatrix=this._updateMatrixForEffect,this.updateMatrices=this._updateMatricesForEffect,this.updateVector3=this._updateVector3ForEffect,this.updateVector4=this._updateVector4ForEffect,this.updateColor3=this._updateColor3ForEffect,this.updateColor4=this._updateColor4ForEffect,this.updateDirectColor4=this._updateDirectColor4ForEffect,this.updateInt=this._updateIntForEffect,this.updateInt2=this._updateInt2ForEffect,this.updateInt3=this._updateInt3ForEffect,this.updateInt4=this._updateInt4ForEffect,this.updateUInt=this._updateUIntForEffect,this.updateUInt2=this._updateUInt2ForEffect,this.updateUInt3=this._updateUInt3ForEffect,this.updateUInt4=this._updateUInt4ForEffect):(this._engine._uniformBuffers.push(this),this.updateMatrix3x3=this._updateMatrix3x3ForUniform,this.updateMatrix2x2=this._updateMatrix2x2ForUniform,this.updateFloat=this._updateFloatForUniform,this.updateFloat2=this._updateFloat2ForUniform,this.updateFloat3=this._updateFloat3ForUniform,this.updateFloat4=this._updateFloat4ForUniform,this.updateFloatArray=this._updateFloatArrayForUniform,this.updateArray=this._updateArrayForUniform,this.updateIntArray=this._updateIntArrayForUniform,this.updateUIntArray=this._updateUIntArrayForUniform,this.updateMatrix=this._updateMatrixForUniform,this.updateMatrices=this._updateMatricesForUniform,this.updateVector3=this._updateVector3ForUniform,this.updateVector4=this._updateVector4ForUniform,this.updateColor3=this._updateColor3ForUniform,this.updateColor4=this._updateColor4ForUniform,this.updateDirectColor4=this._updateDirectColor4ForUniform,this.updateInt=this._updateIntForUniform,this.updateInt2=this._updateInt2ForUniform,this.updateInt3=this._updateInt3ForUniform,this.updateInt4=this._updateInt4ForUniform,this.updateUInt=this._updateUIntForUniform,this.updateUInt2=this._updateUInt2ForUniform,this.updateUInt3=this._updateUInt3ForUniform,this.updateUInt4=this._updateUInt4ForUniform)}get useUbo(){return!this._noUBO}get isSync(){return!this._needSync}isDynamic(){return this._dynamic}getData(){return this._bufferData}getBuffer(){return this._buffer}getUniformNames(){return this._uniformNames}_fillAlignment(e){let t;if(t=e<=2?e:4,this._uniformLocationPointer%t!=0){let e=this._uniformLocationPointer;this._uniformLocationPointer+=t-this._uniformLocationPointer%t;let r=this._uniformLocationPointer-e;for(let e=0;e<r;e++)this._data.push(0)}}addUniform(e,t,r=0){let i;if((r>0&&"number"==typeof t&&(this._uniformArraySizes[e]={strideSize:t,arraySize:r}),void 0===this._uniformLocations[e])&&(this._uniformNames.push(e),!this._noUBO)){if(r>0){if(t instanceof Array)throw"addUniform should not be use with Array in UBO: "+e;if(this._fillAlignment(4),16==t)t*=r;else{let e=4-t;t=t*r+e*r}i=[];for(let e=0;e<t;e++)i.push(0)}else{if(t instanceof Array)t=(i=t).length;else{i=[];for(let e=0;e<t;e++)i.push(0)}this._fillAlignment(t)}this._uniformSizes[e]=t,this._uniformLocations[e]=this._uniformLocationPointer,this._uniformLocationPointer+=t;for(let e=0;e<t;e++)this._data.push(i[e]);this._needSync=!0}}addMatrix(e,t){this.addUniform(e,Array.prototype.slice.call(t.asArray()))}addFloat2(e,t,r){this.addUniform(e,[t,r])}addFloat3(e,t,r,i){this.addUniform(e,[t,r,i])}addColor3(e,t){let r=[t.r,t.g,t.b];this.addUniform(e,r)}addColor4(e,t,r){let i=[t.r,t.g,t.b,r];this.addUniform(e,i)}addVector3(e,t){let r=[t.x,t.y,t.z];this.addUniform(e,r)}addMatrix3x3(e){this.addUniform(e,12)}addMatrix2x2(e){this.addUniform(e,8)}create(){this._noUBO||this._buffer||(this._fillAlignment(4),this._bufferData=new Float32Array(this._data),this._rebuild(),this._needSync=!0)}_getNamesDebug(){let e=[],t=0;for(let r in this._uniformLocations)if(e.push(r),10==++t)break;return e.join(",")}_rebuild(){!this._noUBO&&this._bufferData&&(this._dynamic?this._buffer=this._engine.createDynamicUniformBuffer(this._bufferData,this._name+"_UniformList:"+this._getNamesDebug()):this._buffer=this._engine.createUniformBuffer(this._bufferData,this._name+"_UniformList:"+this._getNamesDebug()),this._trackUBOsInFrame&&(this._buffers.push([this._buffer,this._engine._features.checkUbosContentBeforeUpload?this._bufferData.slice():void 0]),this._bufferIndex=this._buffers.length-1,this._createBufferOnWrite=!1))}_rebuildAfterContextLost(){this._trackUBOsInFrame&&(this._buffers=[],this._currentFrameId=0),this._rebuild()}get _numBuffers(){return this._buffers.length}get _indexBuffer(){return this._bufferIndex}get name(){return this._name}set name(e){this._name=e}get currentEffect(){return this._currentEffect}_buffersEqual(e,t){for(let r=0;r<e.length;++r)if(e[r]!==t[r])return!1;return!0}_copyBuffer(e,t){for(let r=0;r<e.length;++r)t[r]=e[r]}update(){if(!this._noUBO){if(this.bindUniformBuffer(),!this._buffer)return void this.create();if(!this._dynamic&&!this._needSync){this._createBufferOnWrite=this._trackUBOsInFrame;return}if(this._buffers&&this._buffers.length>1&&this._buffers[this._bufferIndex][1])if(this._buffersEqual(this._bufferData,this._buffers[this._bufferIndex][1])){this._needSync=!1,this._createBufferOnWrite=this._trackUBOsInFrame;return}else this._copyBuffer(this._bufferData,this._buffers[this._bufferIndex][1]);this._bufferUpdatedLastFrame=!0,this._engine.updateUniformBuffer(this._buffer,this._bufferData),this._engine._features._collectUbosUpdatedInFrame&&(i._UpdatedUbosInFrame[this._name]||(i._UpdatedUbosInFrame[this._name]=0),i._UpdatedUbosInFrame[this._name]++),this._needSync=!1,this._createBufferOnWrite=this._trackUBOsInFrame}}_createNewBuffer(){this._bufferIndex+1<this._buffers.length?(this._bufferIndex++,this._buffer=this._buffers[this._bufferIndex][0],this._createBufferOnWrite=!1,this._needSync=!0):this._rebuild()}_checkNewFrame(){this._trackUBOsInFrame&&this._currentFrameId!==this._engine.frameId&&(this._currentFrameId=this._engine.frameId,this._createBufferOnWrite=!1,this._buffers&&this._buffers.length>0?(1===this._buffers.length?this._needSync=!this._bufferUpdatedLastFrame:this._needSync=0!==this._bufferIndex,this._bufferIndex=0,this._buffer=this._buffers[this._bufferIndex][0]):this._bufferIndex=-1)}updateUniform(e,r,i){this._checkNewFrame();let a=this._uniformLocations[e];if(void 0===a){if(this._buffer)return void t.Logger.Error("Cannot add an uniform after UBO has been created. uniformName="+e);this.addUniform(e,i),a=this._uniformLocations[e]}if(this._buffer||this.create(),this._dynamic)for(let e=0;e<i;e++)this._bufferData[a+e]=r[e];else{let e=!1;for(let t=0;t<i;t++)(16!==i||this._engine._features.uniformBufferHardCheckMatrix)&&this._bufferData[a+t]===Math.fround(r[t])||(e=!0,this._createBufferOnWrite&&this._createNewBuffer(),this._bufferData[a+t]=r[t]);this._needSync=this._needSync||e}}updateUniformArray(e,i,a){this._checkNewFrame();let n=this._uniformLocations[e];if(void 0===n)return void t.Logger.Error("Cannot add an uniform Array dynamically. Please, add it using addUniform and make sure that uniform buffers are supported by the current engine.");this._buffer||this.create();let s=this._uniformArraySizes[e];if(this._dynamic)for(let e=0;e<a;e++)this._bufferData[n+e]=i[e];else{let e=!1,t=0,o=0;for(let f=0;f<a;f++)if(this._bufferData[n+4*o+t]!==r.Tools.FloatRound(i[f])&&(e=!0,this._createBufferOnWrite&&this._createNewBuffer(),this._bufferData[n+4*o+t]=i[f]),++t===s.strideSize){for(;t<4;t++)this._bufferData[n+4*o+t]=0;t=0,o++}this._needSync=this._needSync||e}}_cacheMatrix(e,t){this._checkNewFrame();let r=this._valueCache[e],i=t.updateFlag;return(void 0===r||r!==i)&&(this._valueCache[e]=i,!0)}_updateMatrix3x3ForUniform(e,t){for(let e=0;e<3;e++)i._TempBuffer[4*e]=t[3*e],i._TempBuffer[4*e+1]=t[3*e+1],i._TempBuffer[4*e+2]=t[3*e+2],i._TempBuffer[4*e+3]=0;this.updateUniform(e,i._TempBuffer,12)}_updateMatrix3x3ForEffect(e,t){this._currentEffect.setMatrix3x3(e,t)}_updateMatrix2x2ForEffect(e,t){this._currentEffect.setMatrix2x2(e,t)}_updateMatrix2x2ForUniform(e,t){for(let e=0;e<2;e++)i._TempBuffer[4*e]=t[2*e],i._TempBuffer[4*e+1]=t[2*e+1],i._TempBuffer[4*e+2]=0,i._TempBuffer[4*e+3]=0;this.updateUniform(e,i._TempBuffer,8)}_updateFloatForEffect(e,t,r=""){this._currentEffect.setFloat(e+r,t)}_updateFloatForUniform(e,t){i._TempBuffer[0]=t,this.updateUniform(e,i._TempBuffer,1)}_updateFloat2ForEffect(e,t,r,i=""){this._currentEffect.setFloat2(e+i,t,r)}_updateFloat2ForUniform(e,t,r){i._TempBuffer[0]=t,i._TempBuffer[1]=r,this.updateUniform(e,i._TempBuffer,2)}_updateFloat3ForEffect(e,t,r,i,a=""){this._currentEffect.setFloat3(e+a,t,r,i)}_updateFloat3ForUniform(e,t,r,a){i._TempBuffer[0]=t,i._TempBuffer[1]=r,i._TempBuffer[2]=a,this.updateUniform(e,i._TempBuffer,3)}_updateFloat4ForEffect(e,t,r,i,a,n=""){this._currentEffect.setFloat4(e+n,t,r,i,a)}_updateFloat4ForUniform(e,t,r,a,n){i._TempBuffer[0]=t,i._TempBuffer[1]=r,i._TempBuffer[2]=a,i._TempBuffer[3]=n,this.updateUniform(e,i._TempBuffer,4)}_updateFloatArrayForEffect(e,t,r=""){switch(this._uniformArraySizes[e]?.strideSize){case 2:this._currentEffect.setFloatArray2(e+r,t);break;case 3:this._currentEffect.setFloatArray3(e+r,t);break;case 4:this._currentEffect.setFloatArray4(e+r,t);break;default:this._currentEffect.setFloatArray(e+r,t)}}_updateFloatArrayForUniform(e,t){this.updateUniformArray(e,t,t.length)}_updateArrayForEffect(e,t){this._currentEffect.setArray(e,t)}_updateArrayForUniform(e,t){this.updateUniformArray(e,t,t.length)}_updateIntArrayForEffect(e,t){this._currentEffect.setIntArray(e,t)}_updateIntArrayForUniform(e,t){i._TempBufferInt32View.set(t),this.updateUniformArray(e,i._TempBuffer,t.length)}_updateUIntArrayForEffect(e,t){this._currentEffect.setUIntArray(e,t)}_updateUIntArrayForUniform(e,t){i._TempBufferUInt32View.set(t),this.updateUniformArray(e,i._TempBuffer,t.length)}_updateMatrixForEffect(e,t){this._currentEffect.setMatrix(e,t)}_updateMatrixForUniform(e,t){this._cacheMatrix(e,t)&&this.updateUniform(e,t.asArray(),16)}_updateMatricesForEffect(e,t){this._currentEffect.setMatrices(e,t)}_updateMatricesForUniform(e,t){this.updateUniform(e,t,t.length)}_updateVector3ForEffect(e,t){this._currentEffect.setVector3(e,t)}_updateVector3ForUniform(e,t){i._TempBuffer[0]=t.x,i._TempBuffer[1]=t.y,i._TempBuffer[2]=t.z,this.updateUniform(e,i._TempBuffer,3)}_updateVector4ForEffect(e,t){this._currentEffect.setVector4(e,t)}_updateVector4ForUniform(e,t){i._TempBuffer[0]=t.x,i._TempBuffer[1]=t.y,i._TempBuffer[2]=t.z,i._TempBuffer[3]=t.w,this.updateUniform(e,i._TempBuffer,4)}_updateColor3ForEffect(e,t,r=""){this._currentEffect.setColor3(e+r,t)}_updateColor3ForUniform(e,t){i._TempBuffer[0]=t.r,i._TempBuffer[1]=t.g,i._TempBuffer[2]=t.b,this.updateUniform(e,i._TempBuffer,3)}_updateColor4ForEffect(e,t,r,i=""){this._currentEffect.setColor4(e+i,t,r)}_updateDirectColor4ForEffect(e,t,r=""){this._currentEffect.setDirectColor4(e+r,t)}_updateColor4ForUniform(e,t,r){i._TempBuffer[0]=t.r,i._TempBuffer[1]=t.g,i._TempBuffer[2]=t.b,i._TempBuffer[3]=r,this.updateUniform(e,i._TempBuffer,4)}_updateDirectColor4ForUniform(e,t){i._TempBuffer[0]=t.r,i._TempBuffer[1]=t.g,i._TempBuffer[2]=t.b,i._TempBuffer[3]=t.a,this.updateUniform(e,i._TempBuffer,4)}_updateIntForEffect(e,t,r=""){this._currentEffect.setInt(e+r,t)}_updateIntForUniform(e,t){i._TempBufferInt32View[0]=t,this.updateUniform(e,i._TempBuffer,1)}_updateInt2ForEffect(e,t,r,i=""){this._currentEffect.setInt2(e+i,t,r)}_updateInt2ForUniform(e,t,r){i._TempBufferInt32View[0]=t,i._TempBufferInt32View[1]=r,this.updateUniform(e,i._TempBuffer,2)}_updateInt3ForEffect(e,t,r,i,a=""){this._currentEffect.setInt3(e+a,t,r,i)}_updateInt3ForUniform(e,t,r,a){i._TempBufferInt32View[0]=t,i._TempBufferInt32View[1]=r,i._TempBufferInt32View[2]=a,this.updateUniform(e,i._TempBuffer,3)}_updateInt4ForEffect(e,t,r,i,a,n=""){this._currentEffect.setInt4(e+n,t,r,i,a)}_updateInt4ForUniform(e,t,r,a,n){i._TempBufferInt32View[0]=t,i._TempBufferInt32View[1]=r,i._TempBufferInt32View[2]=a,i._TempBufferInt32View[3]=n,this.updateUniform(e,i._TempBuffer,4)}_updateUIntForEffect(e,t,r=""){this._currentEffect.setUInt(e+r,t)}_updateUIntForUniform(e,t){i._TempBufferUInt32View[0]=t,this.updateUniform(e,i._TempBuffer,1)}_updateUInt2ForEffect(e,t,r,i=""){this._currentEffect.setUInt2(e+i,t,r)}_updateUInt2ForUniform(e,t,r){i._TempBufferUInt32View[0]=t,i._TempBufferUInt32View[1]=r,this.updateUniform(e,i._TempBuffer,2)}_updateUInt3ForEffect(e,t,r,i,a=""){this._currentEffect.setUInt3(e+a,t,r,i)}_updateUInt3ForUniform(e,t,r,a){i._TempBufferUInt32View[0]=t,i._TempBufferUInt32View[1]=r,i._TempBufferUInt32View[2]=a,this.updateUniform(e,i._TempBuffer,3)}_updateUInt4ForEffect(e,t,r,i,a,n=""){this._currentEffect.setUInt4(e+n,t,r,i,a)}_updateUInt4ForUniform(e,t,r,a,n){i._TempBufferUInt32View[0]=t,i._TempBufferUInt32View[1]=r,i._TempBufferUInt32View[2]=a,i._TempBufferUInt32View[3]=n,this.updateUniform(e,i._TempBuffer,4)}setTexture(e,t){this._currentEffect.setTexture(e,t)}setTextureArray(e,t){this._currentEffect.setTextureArray(e,t)}bindTexture(e,t){this._currentEffect._bindTexture(e,t)}updateUniformDirectly(e,t){this.updateUniform(e,t,t.length),this.update()}bindToEffect(e,t){this._currentEffect=e,this._currentEffectName=t}bindUniformBuffer(){!this._noUBO&&this._buffer&&this._currentEffect&&this._currentEffect.bindUniformBuffer(this._buffer,this._currentEffectName)}unbindEffect(){this._currentEffect=void 0,this._currentEffectName=void 0}setDataBuffer(e){if(!this._buffers)return this._buffer===e;for(let t=0;t<this._buffers.length;++t)if(this._buffers[t][0]===e)return this._bufferIndex=t,this._buffer=e,this._createBufferOnWrite=!1,this._currentEffect=void 0,this._buffers.length>1&&this._buffers[t][1]&&this._bufferData.set(this._buffers[t][1]),this._valueCache={},this._currentFrameId=this._engine.frameId,!0;return!1}has(e){return void 0!==this._uniformLocations[e]}dispose(){if(this._noUBO)return;let e=this._engine._uniformBuffers,t=e.indexOf(this);if(-1!==t&&(e[t]=e[e.length-1],e.pop()),this._trackUBOsInFrame&&this._buffers)for(let e=0;e<this._buffers.length;++e){let t=this._buffers[e][0];this._engine._releaseBuffer(t)}else this._buffer&&this._engine._releaseBuffer(this._buffer)&&(this._buffer=null)}}i._UpdatedUbosInFrame={},i._MAX_UNIFORM_SIZE=256,i._TempBuffer=new Float32Array(i._MAX_UNIFORM_SIZE),i._TempBufferInt32View=new Int32Array(i._TempBuffer.buffer),i._TempBufferUInt32View=new Uint32Array(i._TempBuffer.buffer),e.s(["UniformBuffer",()=>i])},550121,e=>{"use strict";class t{static get UniqueId(){let e=this._UniqueIdCounter;return this._UniqueIdCounter++,e}}t._UniqueIdCounter=1,e.s(["UniqueIdGenerator",()=>t])}]);