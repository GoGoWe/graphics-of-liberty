import * as THREE from "three";
import GUI from "lil-gui";
import {Sky} from "three/addons/objects/Sky";
import {initWater} from "./water";
import renderer from "three/addons/renderers/common/Renderer";
import exports from "three/addons/libs/tween.module";
import IESSpotLight from "three/addons/lights/IESSpotLight";
import {IESLoader} from "three/addons/loaders/IESLoader";
import {Euler} from "three";



export function initEnvironment(scene,renderer){

    /*let fogcolor=0xffffff;
    scene.fog = new THREE.FogExp2( fogcolor, 0.001 );*/

//Water
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
        elevation: 25,
        azimuth: -130,
        exposure: renderer.toneMappingExposure,
        rayleigh: 0.5,
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





    // generate parametersetter
    const gui = new GUI();

    const folderSky = gui.addFolder( 'Sky' );
    renderer.toneMappingExposure=0.5;
    folderSky.add( parameters, 'elevation', -1.5, 90, 0.1 ).onChange( updateSun ).listen();
    folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun ).listen();
    folderSky.add( parameters, 'exposure', 0, 1, 0.0001 ).onChange( skyParamChanged ).listen();
    folderSky.add( parameters, 'rayleigh', 0.0, 4, 0.001 ).onChange( skyParamChanged ).listen();
    folderSky.add( parameters, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( skyParamChanged ).listen();
    folderSky.open();
    skyParamChanged();

    const waterUniforms = water.material.uniforms;

    const folderWater = gui.addFolder( 'Water' );
    waterUniforms.distortionScale.value=5;
    folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
    waterUniforms.size.value=20;
    folderWater.add( waterUniforms.size, 'value', 5, 30, 0.1 ).name( 'size' );
    folderWater.open();


    $(document).ready(function () {
        //console.log("par2",par)
        var togglebtn = $(".toggle-btn");
        $(".switch").on("click", function (callback) {
            togglebtn.toggleClass("active");
            if (togglebtn.hasClass("active")) {

                parameters.azimuth= -178.4;
                parameters.elevation= 8;
                parameters.exposure= 0.35;
                parameters.rayleigh= 0.2;
                parameters.mieDirectionalG= 1;
                console.log("night");

            } else {
                parameters.elevation= 81;
                parameters.exposure= 0.5;
                parameters.rayleigh= 0.5;
                parameters.mieDirectionalG= 975;

                console.log("day");
            }
            const uniforms = sky.material.uniforms;
            renderer.toneMappingExposure = parameters.exposure;
            uniforms[ 'rayleigh' ].value = parameters.rayleigh;
            uniforms[ 'mieDirectionalG' ].value = parameters.mieDirectionalG;
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
        });
    });


//spotlight

    // white spotlight shining from the side, modulated by a texture, casting a shadow

    function addSpotlight(originx,originy,originz,targetx,targety,targetz){
        const spotLight = new THREE.SpotLight( 0xffffff ,20000);
        spotLight.position.set( originx, originy, originz );

        const targetObject = new THREE.Object3D();
        scene.add(targetObject);
        targetObject.position.x=targetx;
        targetObject.position.y=targety;
        targetObject.position.z=targetz;
        spotLight.target = targetObject;
        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        scene.add( spotLight );
    }
    addSpotlight(20,20,0,0,80,0);
    addSpotlight(-20,20,0,0,80,0);




    return water;
}
