import * as THREE from "three";

function setupModel(data) {
    return data.scene;
}
/** places object from path in scene*/
export async function loadObject(path, scene, loader, scalex, scaley, scalez, posx, posy, posz, rotx, roty, rotz) {
    const objData = await loader.loadAsync(path);
    let obj=setupModel(objData);
    obj.position.set(posx, posy, posz);
    obj.scale.set(scalex,scaley,scalez);
    obj.rotation.set(rotx,roty,rotz);
    scene.add(obj);
    return obj;




}
