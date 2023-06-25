// Import the BABYLON library and various functions from other modules
import * as BABYLON from "babylonjs";
import { createCamera } from "./libs/camera.js";
import { createLight } from "./libs/lights.js";
import {
  createMainCube,
  createTempCube,
  createGround,
  createLine,
} from "./libs/meshes.js";
import { setupDragBehavior } from "./libs/behaviours.js";

// Get the relevant elements from the DOM
const canvas = document.getElementById("canvas");
const distanceArial = document.getElementById("distance");
const resetButton = document.getElementById("reset");

// Create a new BABYLON engine instance with the canvas element, enable WebGL, and set the stencil option to true
const engine = new BABYLON.Engine(canvas, true, { stencil: true });

// Declare several variables and initialize them to empty arrays or zero values
let mainCube,
  camera,
  face,
  faceNormal,
  delta,
  tempCube,
  distance = 0,
  mainCubeMaterial,
  tempCubeMaterial,
  nbVertices,
  clr,
  dragBehavior,
  line;
let positions = [],
  colors = [],
  indices = [],
  oldFacePositions = [],
  newFacePositions = [],
  tempPositions = [];

/**
 * Creates a new BABYLON scene with a camera, light, ground, and a main cube with drag behavior.
 * The function sets up event listeners for pointer down, drag start, drag, and drag end.
 * During drag, the function calculates the extrude vector and updates the position of the main cube and the temporary cube.
 * The function also updates the color of the clicked face and displays the distance between the old and new face positions.
 * @returns {BABYLON.Scene} The newly created BABYLON scene.
 */
const createScene = function () {
  // Create a new BABYLON scene and set its background and ambient color
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  scene.ambientColor = new BABYLON.Color3(0.75, 0.75, 0.75);

  // Create a camera, light, and ground in the scene
  camera = createCamera(scene, canvas);
  createLight(scene);
  createGround(scene);

  // Create the main cube and set its color
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

  // Set up drag behavior for the main cube and event listeners for pointer down, drag start, drag, and drag end
  dragBehavior = setupDragBehavior(scene, mainCube);
  scene.onPointerDown = function (ev, pickResult) {
    // Check if the user clicked on the main cube
    if (pickResult.hit && pickResult.pickedMesh.name === "box") {
      // Get the clicked face index and set the clicked face color
      face = Math.floor(pickResult.faceId / 2);
      const clickedFaceColor = new BABYLON.Color4(1, 0.1, 0, 1);
      const resetColor = new BABYLON.Color3(0.85, 0.85, 0.85);
      // Get the normal vector of the clicked face
      faceNormal = pickResult.getNormal(true);
      faceNormal = new BABYLON.Vector3(
        faceNormal.x,
        faceNormal.y,
        faceNormal.z
      );
      // Loop through each face and vertex to update the colors array with the clicked face color
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
      // Update the main cube's vertex colors with the updated colors array
      mainCube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
      // Set the drag axis to the normal vector of the clicked face
      let faceVector = new BABYLON.Vector3(
        faceNormal.x,
        faceNormal.y,
        faceNormal.z
      );
      dragBehavior.options.dragAxis = faceVector;
    }
  };
  dragBehavior.onDragStartObservable.add((event) => {
    // Get the positions of the vertices of the clicked face before the drag starts
    positions = mainCube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    indices = mainCube.getIndices();
    oldFacePositions = [];
    // Loop through each vertex of the clicked face and add its position to the oldFacePositions array
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
    // Display the distance between the old and new face positions set by default to 0
    distanceArial.style.display = "block";
  });
  dragBehavior.onDragObservable.add((event) => {
    // Calculate the extrude vector based on the drag delta and the clicked face normal
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

    // Get the positions and indices of the main cube
    positions = mainCube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    indices = mainCube.getIndices();

    // Update the positions of the main cube vertices based on the extrude vector
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

    // Get the new positions of the clicked face vertices and calculate the distance between the old and new positions
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
    distanceArial.innerText = "Distance: " + distance.toFixed(2);

    // Get the shared vertices between the clicked face and the rest of the cube
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

    // Update the positions of the temporary cube vertices based on the shared vertices and the extrude vector
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

    // Create and update the temporary cube with the new positions and colors
    if (tempCube) {
      tempCube.dispose();
    }
    tempCube = createTempCube(scene, mainCube.position);
    tempCube.setVerticesData(BABYLON.VertexBuffer.PositionKind, tempPositions);
    tempCube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);

    // Update the positions of the main cube with the new positions
    mainCube.setVerticesData(BABYLON.VertexBuffer.PositionKind, newPositions);
  });
  dragBehavior.onDragEndObservable.add((event) => {
    // Dispose of the temporary cube, and update the position of the main cube
    if (tempCube) {
      tempCube.dispose();
    }
    // if (line) {
    //   line.dispose();
    // }

    // Update the position of the main cube using the new positions of the vertices
    if (tempPositions.length) {
      mainCube.setVerticesData(
        BABYLON.VertexBuffer.PositionKind,
        tempPositions
      );
    }
    // Enable edges rendering for the main cube and hide the distance display
    mainCube.enableEdgesRendering();
    distanceArial.style.display = "none";
  });

  // Return the newly created scene
  return scene;
};

/**
 * This creates a new scene using the createScene function, starts the render loop for the scene using the
 * engine.runRenderLoop method, and adds an event listener to the window object to detect when the window is resized
 * and call the engine.resize method.
 */
const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});
window.addEventListener("resize", function () {
  engine.resize();
});

/**
 * This adds a click event listener to the reset button.
 * When the button is clicked, it disposes of the current mainCube object, and sets the camera radius to 8,
 * clears the tempPositions array, creates a new mainCube object and assigns it to the mainCube variable,
 * gets the positions of the vertices of the mainCube object, calculates the number of vertices,
 * creates an array to store the colors of the vertices, creates a new color object with RGBA values
 * and assigns it to the clr variable, loops through each vertex and
 * adds the color to the colors array, gets the indices of the mainCube object.
 */
resetButton.addEventListener("click", () => {
  mainCube.dispose();
  camera.radius = 8;
  tempPositions = [];
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
