import * as THREE from "three";

export function initSound(camera){
    const listener = new THREE.AudioListener();
    camera.add( listener );


    const sound = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sounds/seagulls.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        sound.play();
    });


}