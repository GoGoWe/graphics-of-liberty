import * as THREE from "three";
export function loadObject(path, scene, loader,scalex,scaley,scalez){
    let obj
    loader.load( path, obj=function ( gltf ) {
        console.log(gltf);
        const object =gltf.scene;
        object.material= new THREE.MeshBasicMaterial( { color: 0x505050 } );
        scene.add(object);
        object.scale.set(scalex,scaley,scalez)
        return object;

    }, undefined, function ( error ) {

        console.error( error );

    } );//*/
    return obj
}