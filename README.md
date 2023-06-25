# Babylon Extrude

This is a simple Babylon.js application that allows users to extrude or intrude a cube from its faces to modify its shape

<!-- demo video -->
<img alt="Demo" src="./assets/demo.gif" width="800px">

## Demo
Checkout the demo at [Babylon Extrude](https://babylon-extrude.netlify.app/)


## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Install Node.js and npm using this [helper](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if not already.
3. Open a terminal and navigate to the cloned repository's directory.
4. Install the dependencies by running `npm install`.
5. Start the development server by running `npm run dev` (more info in [package.json](package.json)).
6. Open your web browser and navigate to the link shown in the terminal.

## Usage
Once you have the project running, you can use the check out the following controls and features:

- Use the mouse to move the camera around the scene.
- Use the right mouse button to pan the camera around the scene.
- Use the scroll wheel to zoom in and out.
- Click on a face of the cube to select it and then drag the mouse to extrude or intrude the face. Successive and Multiple of such operations are also allowed.
- View the extrusion/intrusion distance in the top center of the screen.
- Press the "Reset" button to reset the cube to its default shape and the camera to its default zoom level.

## Cons
The project currently only supports single pointer input hence might cause glitches on multi pointer input devices like mobile touchscreens

## Contributing

If you'd like to contribute to this project, feel free to submit a pull request. Please make sure your code adheres to the existing coding style and passes the existing unit tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project was inspired by the Babylon.js documentation and the many helpful contributors in the Babylon.js community.
