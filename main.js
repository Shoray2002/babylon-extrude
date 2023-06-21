import * as BABYLON from "babylonjs";
const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true, { stencil: true });
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
  cube.position.y = 1;
  var material = new BABYLON.StandardMaterial(scene);
  material.alpha = 1;
  material.diffuseColor = new BABYLON.Color3(0.85, 0.85, 0.85);
  material.wireframe = true
  cube.material = material;

  cube.enableEdgesRendering();
  cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  cube.edgesWidth = 2.0;

  var indices = cube.getIndices();
  var positions = cube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  var colors = cube.getVerticesData(BABYLON.VertexBuffer.ColorKind);
  var nbVertices = positions.length / 3;
  if (!colors) {
    var colors = new Array(4 * nbVertices);
    colors = colors.fill(1);
  }
  scene.onPointerDown = function (ev, pickResult) {
    if (pickResult.hit && pickResult.pickedMesh.name == "box") {
      var box = pickResult.pickedMesh;
      var face = pickResult.faceId / 2;
      console.log(pickResult.faceId);
      // var facet = 2 * Math.floor(face);
      // var clr = new BABYLON.Color4((face + 1) / 6, (6 - face) / 6, 0, 1);
      // var vertex;
      // for (var i = 0; i < 6; i++) {
      //   vertex = indices[3 * facet + i];
      //   colors[4 * vertex] = clr.r;
      //   colors[4 * vertex + 1] = clr.g;
      //   colors[4 * vertex + 2] = clr.b;
      //   colors[4 * vertex + 3] = clr.a;
      // }
      // cube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);

      // set other faces to white
      // for (var i = 0; i < 6; i++) {
      //   if (i != face) {
      //     facet = 2 * Math.floor(i);
      //     clr = new BABYLON.Color4(0, 1, 0, 1);
      //     for (var j = 0; j < 6; j++) {
      //       vertex = indices[3 * facet + j];
      //       colors[4 * vertex] = clr.r;
      //       colors[4 * vertex + 1] = clr.g;
      //       colors[4 * vertex + 2] = clr.b;
      //       colors[4 * vertex + 3] = clr.a;
      //     }
      //   }
      // }
      // cube.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
    }
  };

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 100, height: 100 },
    scene
  );
  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.9, 0.937, 0.9);
  ground.material.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material.backFaceCulling = false;

  return scene;
};
const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
