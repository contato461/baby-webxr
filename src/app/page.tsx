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
import "@babylonjs/core/Cameras/Inputs/freeCameraVirtualJoystickInput";

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

    // =========================
    // FÍSICA HAVOK
    // =========================
    const havok = await HavokPhysics();

    scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new HavokPlugin(true, havok)
    );

    SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;

    await loadScene("/scene/", "example.babylon", scene, scriptsMap);

    const canvas = engine.getRenderingCanvas();

    // =========================
    // CAMERA DESKTOP + MOBILE
    // =========================
    if (scene.activeCamera && canvas) {

      const camera = scene.activeCamera as BABYLON.UniversalCamera;

      camera.attachControl(canvas, true);

      // posição inicial
      camera.position = new Vector3(0, 1.7, -5);

      camera.speed = 0.15;
      camera.angularSensibility = 4000;

      // colisão
      scene.collisionsEnabled = true;

      camera.checkCollisions = true;
      camera.applyGravity = true;

      camera.ellipsoid = new Vector3(0.5, 0.9, 0.5);

      // joystick mobile
      camera.inputs.addVirtualJoystick();
    }

    // =========================
    // PEGAR CHÃO
    // =========================
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

    // corrigir altura no VR
    xr.baseExperience.sessionManager.onXRSessionInit.add(() => {

      const xrCamera = xr.baseExperience.camera;

      xrCamera.position.y = 1.7;

    });

    const fm = xr.baseExperience.featuresManager;

    // =========================
    // TELEPORT
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
    // LOOP RENDER
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