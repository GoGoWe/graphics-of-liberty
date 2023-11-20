import * as THREE from "three";

let audioInterfaces = null

/** Initialize and AudioListener to play audio files in the scene
 * @param {THREE.Object3D} sceneObject - The object the AudioListener should be added to 
 * @returns {Array} - Returns an audioLoaded and audioListener to load and playback audio files
*/
function createAudioListener(sceneObject){
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    sceneObject.add( listener );

    return [audioLoader, listener];
}

/** Initialize audio interface if needed and load an audio file
 * @param {THREE.Object3D} sceneObject - The object the AudioListener should be added to 
 * @param {String} path - The path the audio file is located 
 * @param {Boolean} playOnLoad - Should the music be played directly after the file was loaded?
 * @returns {THREE.Audio} - returns an audio object that controls the playback of the loaded file
 */
export function startSound(sceneObject, path, playOnLoad){
    audioInterfaces = (audioInterfaces === null) ? createAudioListener(sceneObject) : audioInterfaces
    const audioObject = new THREE.Audio( audioInterfaces[1] );

    audioInterfaces[0].load( path, function( buffer ) {
        audioObject.setBuffer( buffer );
        audioObject.setLoop( true );
        audioObject.setVolume( 1 );
        if(playOnLoad) audioObject.play();
    });

    return audioObject;
}