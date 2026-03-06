"use client";

import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/XR/webXRDefaultExperience";

import { useEffect, useRef } from "react";

import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import "@babylonjs/core/Cameras/universalCamera";
import "@babylonjs/core/Cameras/Inputs/freeCameraVirtualJoystickInput";

import "@babylonjs/core/Meshes/groundMesh";
import "@babylonjs/core/Lights/directionalLight";

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

    SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;

    await loadScene("/scene/", "example.babylon", scene, scriptsMap);

    const canvas = engine.getRenderingCanvas();

    // =========================
    // CAMERA DESKTOP + MOBILE
    // =========================

    if (scene.activeCamera && canvas) {

      const camera = scene.activeCamera as BABYLON.UniversalCamera;

      camera.attachControl(canvas, true);

      camera.speed = 0.15;
      camera.angularSensibility = 4000;

      scene.collisionsEnabled = true;
      camera.checkCollisions = true;

      camera.ellipsoid = new Vector3(0.4, 0.9, 0.4);

      camera.inputs.addVirtualJoystick();
    }

    // =========================
    // ATIVAR COLISÃO EM TODOS MESHES
    // =========================

    scene.meshes.forEach(mesh => {
      mesh.checkCollisions = true;
    });

    const floor = scene.getMeshByName("Floor");

    // =========================
    // XR
    // =========================

    const xr = await scene.createDefaultXRExperienceAsync({

      uiOptions: {
        sessionMode: "immersive-vr",
        referenceSpaceType: "local-floor",
      },

      optionalFeatures: true,
      floorMeshes: floor ? [floor] : [],

    });

    // =========================
    // CORREÇÃO ALTURA QUEST
    // =========================

    let fixHeight = false;

    xr.baseExperience.onStateChangedObservable.add((state) => {

      if (state === BABYLON.WebXRState.IN_XR) {
        fixHeight = true;
      } else {
        fixHeight = false;
      }

    });

    scene.onBeforeRenderObservable.add(() => {

      if (fixHeight) {

        const xrCamera = xr.baseExperience.camera;

        if (xrCamera.position.y < 1.6) {
          xrCamera.position.y = 1.7;
        }

      }

    });

    const fm = xr.baseExperience.featuresManager;

    // =========================
    // TELEPORT VR
    // =========================

    fm.enableFeature(
      BABYLON.WebXRFeatureName.TELEPORTATION,
      "latest",
      {
        xrInput: xr.input,
        floorMeshes: floor ? [floor] : [],
      }
    );

    // =========================
    // BOTÃO EXIT VR
    // =========================

    const exitButton = document.createElement("button");

    exitButton.innerText = "Exit VR";

    exitButton.style.position = "absolute";
    exitButton.style.bottom = "20px";
    exitButton.style.left = "20px";
    exitButton.style.padding = "12px 20px";
    exitButton.style.fontSize = "18px";
    exitButton.style.background = "#000";
    exitButton.style.color = "#fff";
    exitButton.style.border = "none";
    exitButton.style.borderRadius = "6px";
    exitButton.style.zIndex = "1000";
    exitButton.style.display = "none";

    document.body.appendChild(exitButton);

    exitButton.onclick = async () => {

      if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {

        await xr.baseExperience.exitXRAsync();

      }

    };

    xr.baseExperience.onStateChangedObservable.add((state) => {

      if (state === BABYLON.WebXRState.IN_XR) {
        exitButton.style.display = "block";
      } else {
        exitButton.style.display = "none";
      }

    });

    // =========================
    // RENDER LOOP
    // =========================

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