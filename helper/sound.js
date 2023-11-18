import * as THREE from "three";

export function initSound(camera){
    const listener = new THREE.AudioListener();
    camera.add( listener );

    const audioLoader = new THREE.AudioLoader();


    return [audioLoader, listener];
}

export function startSound(camera,path, audioLoader,listener, playwithload){

    const sound = new THREE.Audio( listener );
    audioLoader.load( path, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 1 );
        if(playwithload) sound.play();
    });
    return sound;

}