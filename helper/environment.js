import * as THREE from "three";
import GUI from "lil-gui";
import {Sky} from "three/addons/objects/Sky";
import {initWater} from "./water";
import {initSound, startSound} from "./sound";
import {cos, lights, sin} from "three/nodes";


function addSpotlight(scene,originx,originy,originz,targetx,targety,targetz, intensity, color=0xeed760,fov=30){
    const spotLight = new THREE.SpotLight( color ,intensity);
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
    spotLight.shadow.camera.fov = fov;

    scene.add( spotLight );
    return spotLight;
}

export function initEnvironment(scene,renderer,camera){
    let sunspotlight=addSpotlight(scene,0,200,-30,0,0,0,200000,0xf4e99b,1);
    // Water
    let water=initWater(scene);
    // Sky
    const sky = new Sky();
    sky.scale.setScalar( 1000000 );
    sky.castShadow=true;
    scene.add( sky );
    let sun = new THREE.Vector3();
    const sceneEnv = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    let renderTarget;
    const parameters = {
        elevation: 21,
        azimuth: -130,
        exposure: 0.3,
        rayleigh: 0.5,
        mieDirectionalG: 0.975,
    };


    sky.material.uniforms[ 'turbidity' ].value = 10;
    sky.material.uniforms[ 'mieCoefficient' ].value = 0.005;

    function updateSun() {
        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );
        console.log(sky.material.uniforms[ 'sunPosition' ].value)
        sun.setFromSphericalCoords( 1, phi, theta );
        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun );
        if ( renderTarget !== undefined ) renderTarget.dispose();
        sceneEnv.add( sky )
        renderTarget = pmremGenerator.fromScene( sceneEnv );
        scene.add( sky );
        scene.environment = renderTarget.texture;
        sunspotlight.position.y=1000*Math.cos(phi);
        sunspotlight.position.x=1000*Math.sin(theta);
        sunspotlight.position.z=1000*Math.cos(theta);
        console.log(sunspotlight.position)
        sunspotlight.updateMatrix()
        var togglebtn = $(".toggle-btn");
        if (!togglebtn.hasClass("active")) {
            let r=0xf4-(1-Math.cos(phi))*0x90;
            let g=0xe9-(1-Math.cos(phi))*0xc0;
            let b=0xcb-(1-Math.cos(phi))*0xc0;

            console.log("rgb",r,g,b )
            sunspotlight.color.set(r,g,b);
        }
    }

    updateSun();


    function skyParamChanged(){
        renderer.toneMappingExposure = parameters.exposure;
        sky.material.uniforms[ 'rayleigh' ].value = parameters.rayleigh;
        sky.material.uniforms[ 'mieDirectionalG' ].value = parameters.mieDirectionalG;
        updateSun()
    }

    class ColorGUIHelper {

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


    folderSky.add( parameters, 'elevation', -1.5, 90, 0.1 ).onChange( updateSun ).listen();
    folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun ).listen();
    folderSky.add( parameters, 'exposure', 0, 1, 0.0001 ).onChange( skyParamChanged ).listen();
    folderSky.add( parameters, 'rayleigh', 0.0, 4, 0.001 ).onChange( skyParamChanged ).listen();
    folderSky.add( parameters, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( skyParamChanged ).listen();
    folderSky.open();


    const waterUniforms = water.material.uniforms;

    const folderWater = gui.addFolder( 'Water' );
    waterUniforms.distortionScale.value=5;
    folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
    waterUniforms.size.value=5;
    folderWater.add( waterUniforms.size, 'value', 5, 30, 0.1 ).name( 'size' );
    folderWater.open();


    //spotlight

    // white spotlight shining from the side, modulated by a texture, casting a shadow


    let spotlight1 =addSpotlight(scene,30,20,0,0,80,0, 0);
    let spotlight2= addSpotlight(scene,-30,20,0,0,80,0,0);
    let spotlight3= addSpotlight(scene,0,20,30,0,80,0,0);
    sunspotlight.castShadow=true;
    sunspotlight.shadow.mapSize.width=80192;
    sunspotlight.shadow.mapSize.height=80192;
    sunspotlight.shadow.camera.near=0.5;
    sunspotlight.shadow.camera.far=2000;
    sunspotlight.shadow.camera.focus=1;//*/
    sunspotlight.shadow.bias=-0.000005





    //sound
    let [audioloader,listener]=initSound(camera);
    let aliciaKeys=startSound(camera,'public/Sounds/Empire State of Mind (Part II) Broken Down.mp3',audioloader, listener ,false);
    aliciaKeys.pause();
    let doves=startSound(camera,'public/sounds/seagulls.mp3',audioloader,listener,true);

    $(document).ready(function () {
        //console.log("par2",par)
        var togglebtn = $(".toggle-btn");
        $(".switch").on("click", function (callback) {
            togglebtn.toggleClass("active");
            if (togglebtn.hasClass("active")) {
                spotlight1.intensity=10000;
                spotlight2.intensity=10000;
                spotlight3.intensity=10000;
                sunspotlight.intensity=5000;
                sunspotlight.color.set(0xbb,0xbb,0xff);
                parameters.azimuth= -178.4;
                parameters.elevation= 8;
                parameters.exposure= 0.35;
                parameters.rayleigh= 0.1;
                parameters.mieDirectionalG= 1;
                doves.setVolume(0.5);
                aliciaKeys.offset=68;
                aliciaKeys.setVolume(0.1);
                aliciaKeys.play();
                console.log("night");

            } else {
                spotlight1.intensity=0;
                spotlight2.intensity=0;
                spotlight3.intensity=0;
                sunspotlight.intensity=200000;
                sunspotlight.color.set(0xf4,0xe9,0x9b);
                parameters.elevation= 21;
                parameters.azimuth= -130;
                parameters.exposure= 0.3;
                parameters.rayleigh= 0.5;
                parameters.mieDirectionalG= .975;
                doves.setVolume(0.5)
                aliciaKeys.stop()
                console.log("day");
            }
            const uniforms = sky.material.uniforms;
            renderer.toneMappingExposure = parameters.exposure;
            uniforms[ 'rayleigh' ].value = parameters.rayleigh;
            uniforms[ 'mieDirectionalG' ].value = parameters.mieDirectionalG;
            skyParamChanged();
            updateSun();
        });
    });
   skyParamChanged()

    return water;
}