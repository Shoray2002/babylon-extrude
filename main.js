import * as BABYLON from "babylonjs";
import { createCamera } from "./libs/camera.js";
import { createLight } from "./libs/lights.js";
import { createMainCube, createTempCube, createGround } from "./libs/meshes.js";
import { setupDragBehavior } from "./libs/behaviours.js";
const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true, { stencil: true });
const distanceArial = document.getElementById("distance");
const resetButton = document.getElementById("reset");

// scene variables
let mainCube,
  face,
  faceNormal,
  delta,
  tempCube,
  distance = 0,
  mainCubeMaterial,
  tempCubeMaterial,
  nbVertices,
  clr,
  dragBehavior;
let positions = [],
  colors = [],
  indices = [],
  oldFacePositions = [],
  newFacePositions = [],
  tempPositions = [];

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  scene.ambientColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  createCamera(scene, canvas);
  createLight(scene);
  createGround(scene);

  mainCube = createMainCube(scene);
  mainCubeMaterial = mainCube.material;
  positions = mainCube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  nbVertices = positions.length / 3;
  colors = [];
  clr = new BABYLON.Color4(0.85, 0.85, 0.85, 1);
  for (let i = 0; i < nbVertices; i++) {
    colors.push(clr.r, clr.g, clr.b, clr.a);
  }
  indices = mainCube.getIndices();
  if (!colors) {
    colors = new Array(4 * nbVertices);
    colors = colors.fill(1);
  }
  mainCube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
  dragBehavior = setupDragBehavior(scene, mainCube);

  scene.onPointerDown = function (ev, pickResult) {
    if (pickResult.hit && pickResult.pickedMesh.name === "box") {
      const box = pickResult.pickedMesh;
      face = Math.floor(pickResult.faceId / 2);
      const clickedFaceColor = new BABYLON.Color4(1, 0.1, 0, 1);
      const resetColor = new BABYLON.Color3(0.85, 0.85, 0.85);
      faceNormal = pickResult.getNormal(true);
      faceNormal = new BABYLON.Vector3(
        faceNormal.x,
        faceNormal.y,
        faceNormal.z
      );
      for (let i = 0; i < 6; i++) {
        const facet = 2 * Math.floor(i);
        const currentColor = i === face ? clickedFaceColor : resetColor;

        for (let j = 0; j < 6; j++) {
          const vertex = indices[3 * facet + j];
          const colorIndex = 4 * vertex;
          colors[colorIndex] = currentColor.r;
          colors[colorIndex + 1] = currentColor.g;
          colors[colorIndex + 2] = currentColor.b;
          colors[colorIndex + 3] = currentColor.a;
        }
      }
      mainCube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
      let faceVector = new BABYLON.Vector3(
        faceNormal.x,
        faceNormal.y,
        faceNormal.z
      );
      dragBehavior.options.dragAxis = faceVector;
    }
  };
  dragBehavior.onDragStartObservable.add((event) => {
    positions = mainCube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    indices = mainCube.getIndices();
    oldFacePositions = [];
    for (let i = 0; i < 6; i++) {
      const vertexIndex = indices[3 * face * 2 + i];
      const vertexPosition = new BABYLON.Vector3(
        positions[3 * vertexIndex],
        positions[3 * vertexIndex + 1],
        positions[3 * vertexIndex + 2]
      );
      if (!oldFacePositions.some((pos) => pos.equals(vertexPosition))) {
        oldFacePositions.push(vertexPosition);
      }
    }
  });
  dragBehavior.onDragObservable.add((event) => {
    delta = event.delta;
    let axis;
    if (faceNormal.x === 1 || faceNormal.x === -1) {
      axis = new BABYLON.Vector3(1, 0, 0);
    } else if (faceNormal.y === 1 || faceNormal.y === -1) {
      axis = new BABYLON.Vector3(0, 1, 0);
    } else if (faceNormal.z === 1 || faceNormal.z === -1) {
      axis = new BABYLON.Vector3(0, 0, 1);
    }
    const sign = Math.sign(delta.x + delta.y + delta.z);
    const extrudeVector = axis.scale(sign * delta.length());
    positions = mainCube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    indices = mainCube.getIndices();
    let newPositions = positions.slice();
    for (let i = 0; i < 6; i++) {
      const vertexIndex = indices[3 * face * 2 + i];
      const vertex = new BABYLON.Vector3(
        positions[3 * vertexIndex],
        positions[3 * vertexIndex + 1],
        positions[3 * vertexIndex + 2]
      );
      const newPosition = vertex.add(extrudeVector);
      newPositions[3 * vertexIndex] = newPosition.x;
      newPositions[3 * vertexIndex + 1] = newPosition.y;
      newPositions[3 * vertexIndex + 2] = newPosition.z;
    }
    newFacePositions = [];
    for (let i = 0; i < 6; i++) {
      const vertexIndex = indices[3 * face * 2 + i];
      const vertexPosition = new BABYLON.Vector3(
        positions[3 * vertexIndex],
        positions[3 * vertexIndex + 1],
        positions[3 * vertexIndex + 2]
      );
      if (!newFacePositions.some((pos) => pos.equals(vertexPosition))) {
        newFacePositions.push(vertexPosition);
      }
    }
    distance = newFacePositions[0].subtract(oldFacePositions[0]).length();
    distanceArial.innerText = distance.toFixed(2);

    indices = mainCube.getIndices();
    const sharedVertices = [];
    for (let i = 0; i < positions.length / 3; i++) {
      const currentPosition = new BABYLON.Vector3(
        positions[3 * i],
        positions[3 * i + 1],
        positions[3 * i + 2]
      );
      for (const facePosition of oldFacePositions) {
        if (currentPosition.equals(facePosition)) {
          sharedVertices.push(currentPosition);
          break;
        }
      }
    }
    tempPositions = positions.slice();
    for (let i = 0; i < oldFacePositions.length; i++) {
      const currentOldVertex = oldFacePositions[i];
      const currentNewVertex = newFacePositions[i];
      const delta = currentNewVertex.subtract(currentOldVertex);
      for (let j = 0; j < tempPositions.length / 3; j++) {
        const currentPosition = new BABYLON.Vector3(
          tempPositions[3 * j],
          tempPositions[3 * j + 1],
          tempPositions[3 * j + 2]
        );
        for (const sharedVertex of sharedVertices) {
          if (currentPosition.equals(sharedVertex)) {
            tempPositions[3 * j] += delta.x;
            tempPositions[3 * j + 1] += delta.y;
            tempPositions[3 * j + 2] += delta.z;
            break;
          }
        }
      }
    }
    if (tempCube) {
      tempCube.dispose();
    }
    tempCube = createTempCube(scene, mainCube.position);
    mainCube.setVerticesData(BABYLON.VertexBuffer.PositionKind, newPositions);
    tempCube.setVerticesData(BABYLON.VertexBuffer.PositionKind, tempPositions);
    tempCube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors); 
  });
  dragBehavior.onDragEndObservable.add((event) => {
    if (tempCube) {
      tempCube.dispose();
    }
    mainCube.setVerticesData(BABYLON.VertexBuffer.PositionKind, tempPositions);
    mainCube.enableEdgesRendering();
  });

  return scene;
};

const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

resetButton.addEventListener("click", () => {
  mainCube.dispose();
  mainCube = createMainCube(scene);
  positions = mainCube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  nbVertices = positions.length / 3;
  colors = [];
  clr = new BABYLON.Color4(0.85, 0.85, 0.85, 1);
  for (let i = 0; i < nbVertices; i++) {
    colors.push(clr.r, clr.g, clr.b, clr.a);
  }
  indices = mainCube.getIndices();
  if (!colors) {
    colors = new Array(4 * nbVertices);
    colors = colors.fill(1);
  }
  mainCube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
  mainCube.addBehavior(dragBehavior);
});
