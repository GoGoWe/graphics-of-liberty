import * as THREE from "three";
import GUI from "lil-gui";
import {Sky} from "three/addons/objects/Sky";
import {initWater} from "./water";



export function initEnvironment(scene,renderer){

let water=initWater(scene);
//Sky


    const sky = new Sky();
    sky.scale.setScalar( 1000000 );
    scene.add( sky );

    let sun = new THREE.Vector3();
    const sceneEnv = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    let renderTarget;
    const parameters = {
        elevation: 2,
        azimuth: -130,
        exposure: renderer.toneMappingExposure,
        rayleigh: 2,
        mieDirectionalG: 0.975,
    };

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;


    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        if ( renderTarget !== undefined ) renderTarget.dispose();

        sceneEnv.add( sky );
        renderTarget = pmremGenerator.fromScene( sceneEnv );
        scene.add( sky );

        scene.environment = renderTarget.texture;

    }

    updateSun();

        function skyParamChanged(){
            const uniforms = sky.material.uniforms;
            renderer.toneMappingExposure = parameters.exposure;
            uniforms[ 'rayleigh' ].value = parameters.rayleigh;
            uniforms[ 'mieDirectionalG' ].value = parameters.mieDirectionalG;
        }

    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }

        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }

        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }


    //Directional Light
    const dircolor = 0xFFFFFF;
    const dirintensity = 1;
    const dirlight = new THREE.DirectionalLight( dircolor, dirintensity );
    dirlight.position.set( 0, 10, 0 );
    dirlight.target.position.set( -5, 0, 0 );
    scene.add( dirlight );
    scene.add( dirlight.target );

    const amcolor = 0xFFFFFF;
    const amintensity = 1;
    const amlight = new THREE.AmbientLight( dircolor, dirintensity );
    scene.add( amlight );


    // generate parametersetter
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(dirlight, 'color'), 'value').name('color');
    gui.add(dirlight, 'intensity', 0, 2, 0.01);
    gui.add( dirlight.target.position, 'x', - 10, 10, .01 );
    gui.add( dirlight.target.position, 'z', - 10, 10, .01 );
    gui.add( dirlight.target.position, 'y', 0, 10, .01 );

    gui.addColor(new ColorGUIHelper(amlight, 'color'), 'value').name('color');
    gui.add(amlight, 'intensity', 0, 2, 0.01);


    const folderSky = gui.addFolder( 'Sky' );
    renderer.toneMappingExposure=0.5;
    folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
    folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
    folderSky.add( parameters, 'exposure', 0, 1, 0.0001 ).onChange( skyParamChanged );
    folderSky.add( parameters, 'rayleigh', 0.0, 4, 0.001 ).onChange( skyParamChanged );
    folderSky.add( parameters, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( skyParamChanged );
    folderSky.open();
    skyParamChanged();

    const waterUniforms = water.material.uniforms;

    const folderWater = gui.addFolder( 'Water' );
    waterUniforms.distortionScale.value=5;
    folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
    waterUniforms.size.value=20;
    folderWater.add( waterUniforms.size, 'value', 5, 30, 0.1 ).name( 'size' );
    folderWater.open();

    return water;
}