import * as BABYLON from "babylonjs";

const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true, { stencil: true });

let face, faceNormal;
const dial = document.getElementById("extrude");

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  scene.ambientColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    0,
    20,
    BABYLON.Vector3.Zero(),
    scene
  );

  camera.setPosition(new BABYLON.Vector3(2, 5, 8));
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 1;

  var cube = BABYLON.MeshBuilder.CreateBox(
    "box",
    { width: 1, height: 1, depth: 1, updatable: true },
    scene
  );
  cube.position.y = 0.52;
  var material = new BABYLON.StandardMaterial(scene);
  // material.wireframe = true;
  cube.material = material;
  cube.material.backFaceCulling = false;

  var positions = cube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  var nbVertices = positions.length / 3;
  var colors = [];
  var clr = new BABYLON.Color4(0.85, 0.85, 0.85, 1);
  for (var i = 0; i < nbVertices; i++) {
    colors.push(clr.r, clr.g, clr.b, clr.a);
  }
  var indices = cube.getIndices();
  if (!colors) {
    var colors = new Array(4 * nbVertices);
    colors = colors.fill(1);
  }
  cube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
  cube.enableEdgesRendering();
  cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  cube.edgesWidth = 2.0;

  const dragBehavior = new BABYLON.PointerDragBehavior({
    dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
  });
  cube.addBehavior(dragBehavior);
  dragBehavior.moveAttached = false;

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 100, height: 100 },
    scene
  );
  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.9, 0.937, 0.9);
  ground.material.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material.backFaceCulling = false;

  scene.onPointerDown = function (ev, pickResult) {
    if (pickResult.hit && pickResult.pickedMesh.name === "box") {
      const box = pickResult.pickedMesh;
      face = Math.floor(pickResult.faceId / 2);
      const clickedFaceColor = new BABYLON.Color4(0.83, 0.33, 0, 1);
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
      cube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
      let faceVector = new BABYLON.Vector3(
        faceNormal.x,
        faceNormal.y,
        faceNormal.z
      );
      dragBehavior.options.dragAxis = faceVector;
    }
  };

  dragBehavior.onDragObservable.add((event) => {
    const delta = event.delta;
    let axis;
    if (faceNormal.x === 1) {
      axis = new BABYLON.Vector3(1, 0, 0);
    } else if (faceNormal.y === 1) {
      axis = new BABYLON.Vector3(0, 1, 0);
    } else if (faceNormal.z === 1) {
      axis = new BABYLON.Vector3(0, 0, 1);
    } else if (faceNormal.x === -1) {
      axis = new BABYLON.Vector3(-1, 0, 0);
    } else if (faceNormal.y === -1) {
      axis = new BABYLON.Vector3(0, -1, 0);
    } else if (faceNormal.z === -1) {
      axis = new BABYLON.Vector3(0, 0, -1);
    }
    console.log(delta);
    const sign = Math.sign(delta.x + delta.y + delta.z);
    console.log(sign);
    const extrudeVector = axis.scale(sign * delta.length());
    const positions = cube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const indices = cube.getIndices();
    const newPositions = positions.slice();
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

    cube.setVerticesData(BABYLON.VertexBuffer.PositionKind, newPositions);
    cube.enableEdgesRendering();
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
