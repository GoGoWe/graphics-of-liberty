import {MeshBasicMaterial} from "three";

function setupModel(data) {
    return data.scene;
}
/** places object from path in scene*/
export async function loadObject(path, scene, loader, scalex, scaley, scalez, posx, posy, posz, rotx, roty, rotz) {
    const objData = await loader.loadAsync(path);

    let obj=setupModel(objData);
    //obj.material= new MeshBasicMaterial( { color: 0x505050 } );
    obj.position.set(posx, posy, posz);
    obj.scale.set(scalex,scaley,scalez);
    obj.rotation.set(rotx,roty,rotz);
    scene.add(obj);
    return obj;

    /*
    loader.load( path, function ( gltf ) {
        console.log(gltf);
        obj =gltf.scene;
        obj.material= new THREE.MeshBasicMaterial( { color: 0x505050 } );
        scene.add(obj);
        obj.scale.set(scalex,scaley,scalez);
        obj.rotation.set(rotx,roty,rotz);
        obj.position.set(posx,posy,posz);

    }, undefined, function ( error ) {

        console.error( error );
    } );//*/


}
