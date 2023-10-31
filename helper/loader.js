import * as THREE from "three";

/** places object from path in scene*/
export function loadObject(path, scene, loader,scalex,scaley,scalez,posx,posy,posz,rotx,roty,rotz){
    let obj
    loader.load( path, obj=function ( gltf ) {
        const object =gltf.scene;
        object.material= new THREE.MeshBasicMaterial( { color: 0x505050 } );
        scene.add(object);
        object.scale.set(scalex,scaley,scalez);
        object.rotation.set(rotx,roty,rotz);
        object.position.set(posx,posy,posz)
        return object;

    }, undefined, function ( error ) {

        console.error( error );

    } );//*/
    return obj
}