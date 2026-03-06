"use client";

import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/XR/webXRDefaultExperience";

import { useEffect, useRef } from "react";

import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

import HavokPhysics from "@babylonjs/havok";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import "@babylonjs/core/Cameras/universalCamera";
import "@babylonjs/core/Meshes/groundMesh";

import "@babylonjs/core/Lights/directionalLight";

import "@babylonjs/core/Physics";

import "@babylonjs/materials/sky";

import { loadScene } from "babylonjs-editor-tools";
import { scriptsMap } from "@/scripts/scripts";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true, {
      antialias: true,
      adaptToDeviceRatio: true,
      powerPreference: "high-performance",
    });

    const scene = new Scene(engine);

    handleLoad(engine, scene);

    const resize = () => engine.resize();
    window.addEventListener("resize", resize);

    return () => {
      scene.dispose();
      engine.dispose();
      window.removeEventListener("resize", resize);
    };
  }, []);

  async function handleLoad(engine: Engine, scene: Scene) {
    // Física Havok
    const havok = await HavokPhysics();

    scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new HavokPlugin(true, havok)
    );

    SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;

    await loadScene("/scene/", "example.babylon", scene, scriptsMap);

    const canvas = engine.getRenderingCanvas();

    if (scene.activeCamera && canvas) {
      scene.activeCamera.attachControl(canvas, true);

      // altura inicial da câmera
      scene.activeCamera.position = new Vector3(0, 1.7, -5);
    }

    // pegar chão
    const floor = scene.getMeshByName("Floor");

    // XR
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-vr",
        referenceSpaceType: "local-floor",
      },
      optionalFeatures: true,
      floorMeshes: floor ? [floor] : [],
    });

    const fm = xr.baseExperience.featuresManager;

    // teleport
    fm.enableFeature(
      BABYLON.WebXRFeatureName.TELEPORTATION,
      "latest",
      {
        xrInput: xr.input,
        floorMeshes: floor ? [floor] : [],
      }
    );

    engine.runRenderLoop(() => {
      scene.render();
    });
  }

  return (
    <main className="flex w-screen h-screen">
      <canvas
        ref={canvasRef}
        className="w-full h-full outline-none"
      />
    </main>
  );
}