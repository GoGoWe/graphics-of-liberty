import * as THREE from "three";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky";
import { initWater } from "./water";
import { startSound } from "./sound";


function addSpotlight(scene, originx, originy, originz, targetx, targety, targetz, intensity, color = 0xeed760, fov = 30) {
    const spotLight = new THREE.SpotLight(color, intensity);
    spotLight.position.set(originx, originy, originz);

    const targetObject = new THREE.Object3D();
    scene.add(targetObject);
    targetObject.position.x = targetx;
    targetObject.position.y = targety;
    targetObject.position.z = targetz;
    spotLight.target = targetObject;
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = fov;

    scene.add(spotLight);
    return spotLight;
}

export function initEnvironment(scene, renderer, camera) {
    // Constants for the water, sun, sky and more
    const water = initWater(scene);
    const sunspotlight = addSpotlight(scene, 0, 200, -30, 0, 0, 0, 200000, 0xf4e99b, 1);
    const sun = new THREE.Vector3();
    const sky = new Sky();
    const sceneEnv = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let renderTarget;

    // Parameters for the sun
    const sunParamters = {
        elevation: 21,
        azimuth: -130,
        exposure: 0.3,
        rayleigh: 0.5,
        mieDirectionalG: 0.975,
    };

    /**
     * Update sun parameters, activate spotlights when sun turns to night
     */
    function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - sunParamters.elevation);
        const theta = THREE.MathUtils.degToRad(sunParamters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);
        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun);

        if (renderTarget !== undefined) renderTarget.dispose();

        sceneEnv.add(sky)
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        scene.add(sky);
        scene.environment = renderTarget.texture;
        sunspotlight.position.y = 1000 * Math.cos(phi);
        sunspotlight.position.x = 1000 * Math.sin(theta);
        sunspotlight.position.z = 1000 * Math.cos(theta);
        sunspotlight.updateMatrix()
        var togglebtn = $(".toggle-btn");

        if (!togglebtn.hasClass("active")) {
            let r = 0xf4 - (1 - Math.cos(phi)) * 0x90;
            let g = 0xe9 - (1 - Math.cos(phi)) * 0xc0;
            let b = 0xcb - (1 - Math.cos(phi)) * 0xc0;

            sunspotlight.color.set(r, g, b);
        }
    }

    /**
     * update sky parameters 
     */
    function skyParamChanged() {
        renderer.toneMappingExposure = sunParamters.exposure;
        sky.material.uniforms['rayleigh'].value = sunParamters.rayleigh;
        sky.material.uniforms['mieDirectionalG'].value = sunParamters.mieDirectionalG;
        updateSun()
    }

    // Standard sky settings
    sky.scale.setScalar(1000000);
    sky.castShadow = true;
    scene.add(sky);
    sky.material.uniforms['turbidity'].value = 10;
    sky.material.uniforms['mieCoefficient'].value = 0.005;

    // Start new GUI element to edit sky and water
    const gui = new GUI();
    gui.$title.textContent = "Environment Variables";

    // Open and set parameters for the sky
    const folderSky = gui.addFolder('Sky');

    folderSky.add(sunParamters, 'elevation', -1.5, 90, 0.1).onChange(updateSun).listen();
    folderSky.add(sunParamters, 'azimuth', - 180, 180, 0.1).onChange(updateSun).listen();
    folderSky.add(sunParamters, 'exposure', 0, 1, 0.0001).onChange(skyParamChanged).listen();
    folderSky.add(sunParamters, 'rayleigh', 0.0, 4, 0.001).onChange(skyParamChanged).listen();
    folderSky.add(sunParamters, 'mieDirectionalG', 0.0, 1, 0.001).onChange(skyParamChanged).listen();
    folderSky.open();

    // Open and set parameters for the water
    const waterUniforms = water.material.uniforms;
    const folderWater = gui.addFolder('Water');

    waterUniforms.distortionScale.value = 5;
    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
    waterUniforms.size.value = 5;
    folderWater.add(waterUniforms.size, 'value', 5, 30, 0.1).name('size');
    folderWater.open();

    gui.close();

    // Three spotlights to light the statue up at night
    let spotlight1 = addSpotlight(scene, 30, 20, 0, 0, 80, 0, 0);
    let spotlight2 = addSpotlight(scene, -30, 20, 0, 0, 80, 0, 0);
    let spotlight3 = addSpotlight(scene, 0, 20, 30, 0, 80, 0, 0);
    sunspotlight.castShadow = true;
    sunspotlight.shadow.mapSize.width = 8192;
    sunspotlight.shadow.mapSize.height = 8192;
    sunspotlight.shadow.camera.near = 0.5;
    sunspotlight.shadow.camera.far = 2000;
    sunspotlight.shadow.camera.focus = 1;//*/
    sunspotlight.shadow.bias = -0.000001

    // Easter Egg: If key "7" is held, sunset is shown
    document.addEventListener('keydown', (event) => {
        if (document.getElementById("status").textContent !== "Sweet") {
            if (event.key === '7') {
                document.getElementById("status").textContent = "Sweet";
                spotlight1.intensity = 5000;
                spotlight2.intensity = 5000;
                spotlight3.intensity = 5000;
                sunParamters.elevation = 1.5;
                sunParamters.azimuth = 157;
                sunParamters.exposure = 0.25;
                sunParamters.rayleigh = 2.6;
                sunParamters.mieDirectionalG = 1;
                skyParamChanged();
                updateSun();
                frankSinatra.stop();
                doves.setVolume(.3);
                aliciaKeys.offset = 68;
                aliciaKeys.setVolume(0.3);
                aliciaKeys.play();
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === '7') {
            const togglebtn = $(".toggle-btn");
            if (togglebtn.hasClass("active")) {
                setNight();
            } else {
                setDay();
            }
        }
    });

    // Add sounds to scene
    let aliciaKeys = startSound(camera,
        'public/Sounds/Empire State of Mind (Part II) Broken Down.mp3',
        false);

    let frankSinatra = startSound(camera,
        'public/Sounds/New York New York 2008 Remastered.mp3',
        false);

    let doves = startSound(camera, 'public/sounds/seagulls.mp3', true);

    /** Set sun parameters to day */
    function setDay() {
        spotlight1.intensity = 0;
        spotlight2.intensity = 0;
        spotlight3.intensity = 0;
        sunspotlight.intensity = 200000;
        sunspotlight.color.set(0xf4, 0xe9, 0x9b);
        sunParamters.elevation = 21;
        sunParamters.azimuth = -130;
        sunParamters.exposure = 0.3;
        sunParamters.rayleigh = 0.5;
        sunParamters.mieDirectionalG = .975;
        doves.setVolume(1);
        frankSinatra.stop();
        aliciaKeys.stop();
        console.log("day");
        document.getElementById("status").textContent = "Day";
        skyParamChanged();
        updateSun();
    }

    /** Set sun parameters to night */
    function setNight() {
        spotlight1.intensity = 10000;
        spotlight2.intensity = 10000;
        spotlight3.intensity = 10000;
        sunspotlight.intensity = 5000;
        sunspotlight.color.set(0xbb, 0xbb, 0xff);
        sunParamters.azimuth = -178.4;
        sunParamters.elevation = 8;
        sunParamters.exposure = 0.35;
        sunParamters.rayleigh = 0.1;
        sunParamters.mieDirectionalG = 1;
        aliciaKeys.stop();
        frankSinatra.stop();
        doves.setVolume(.6);
        console.log("night");
        document.getElementById("status").textContent = "Night";
        skyParamChanged();
        updateSun();
        frankSinatra.offset = 42.5;
        frankSinatra.setVolume(0.3);
        frankSinatra.play();
    }

    // Set Css class on toggle element and listen for changes
    // to change from day to night and vice verser
    $(document).ready(function () {
        var togglebtn = $(".toggle-btn");
        $(".switch").on("click", function () {
            togglebtn.toggleClass("active");
            if (togglebtn.hasClass("active")) {
                setNight();
            } else {
                setDay();
            }
            const uniforms = sky.material.uniforms;
            renderer.toneMappingExposure = sunParamters.exposure;
            uniforms['rayleigh'].value = sunParamters.rayleigh;
            uniforms['mieDirectionalG'].value = sunParamters.mieDirectionalG;
            skyParamChanged();
            updateSun();
        });
    });

    skyParamChanged()

    return water;
}