"use client";

import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/XR/webXRDefaultExperience";

import { useEffect, useRef } from "react";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import "@babylonjs/core/Cameras/universalCamera";
import "@babylonjs/core/Cameras/Inputs/freeCameraVirtualJoystickInput";

import "@babylonjs/core/Meshes/Builders/capsuleBuilder";

import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";

import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";

import { loadScene } from "babylonjs-editor-tools";
import { scriptsMap } from "@/scripts/scripts";

export default function Home() {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true, {
      antialias: true,
      adaptToDeviceRatio: true,
    });

    const scene = new Scene(engine);

    init(engine, scene);

    const resize = () => engine.resize();
    window.addEventListener("resize", resize);

    return () => {
      scene.dispose();
      engine.dispose();
      window.removeEventListener("resize", resize);
    };

  }, []);

  async function init(engine: Engine, scene: Scene) {

    // =====================
    // PHYSICS
    // =====================

    const havok = await HavokPhysics();

    scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new HavokPlugin(true, havok)
    );

    scene.gravity = new Vector3(0, -0.5, 0);
    scene.collisionsEnabled = true;

    // =====================
    // LOAD SCENE
    // =====================

    SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;

    await loadScene("/scene/", "example.babylon", scene, scriptsMap);

    // =====================
    // PLAYER CONTROLLER
    // =====================

    const player = BABYLON.MeshBuilder.CreateCapsule(
      "player",
      {
        height: 1.8,
        radius: 0.4
      },
      scene
    );

    player.position = new Vector3(0, 0.9, -5);
    player.checkCollisions = true;
    player.isVisible = false;

    // =====================
    // CAMERA
    // =====================

    const camera = new BABYLON.UniversalCamera(
      "camera",
      new Vector3(0, 0.9, 0),
      scene
    );

    camera.parent = player;

    const canvas = engine.getRenderingCanvas();

    if (canvas) {

      camera.attachControl(canvas, true);

      camera.speed = 0.15;
      camera.angularSensibility = 4000;

      camera.inputs.addVirtualJoystick();

    }

    scene.activeCamera = camera;

    camera.applyGravity = true;
    camera.checkCollisions = true;

    camera.ellipsoid = new Vector3(0.4, 0.9, 0.4);

    // =====================
    // COLISÃO EM TODOS MESHES
    // =====================

    scene.meshes.forEach(mesh => {
      mesh.checkCollisions = true;
    });

    const floor = scene.getMeshByName("Floor");

    // =====================
    // XR
    // =====================

    const xr = await scene.createDefaultXRExperienceAsync({

      uiOptions: {
        sessionMode: "immersive-vr",
        referenceSpaceType: "local-floor",
      },

      floorMeshes: floor ? [floor] : [],

    });

    xr.baseExperience.sessionManager.onXRSessionInit.add(() => {

      const xrCamera = xr.baseExperience.camera;

      xrCamera.position.y = 1.7;

    });

    const fm = xr.baseExperience.featuresManager;

    fm.enableFeature(
      BABYLON.WebXRFeatureName.TELEPORTATION,
      "latest",
      {
        xrInput: xr.input,
        floorMeshes: floor ? [floor] : [],
      }
    );

    // =====================
    // RENDER LOOP
    // =====================

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