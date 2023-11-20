
/** Load objects from path asynchronous into the scene 
 * @param {String} path - Path where the 3D object can be found
 * @param {THREE.Scene} scene - Scene where the loaded 3D object should be placed into  
 * @param {THREE.Loader} loader - The loader that is responsible to load the given file (e.g GLTFLoader for gltf files)
 * @param {THREE.Vector3} scale - The scale of the object as Vector3
 * @param {THREE.Vector3} pos - The position of the object as Vector3
 * @param {THREE.Vector3} rot - The rotation of the object as Vector3
*/
export async function loadObject(path, scene, loader, scale, pos, rot) {
    const objData = await loader.loadAsync(path);
    let obj = objData.scene;
    obj.position.copy(pos);
    obj.scale.copy(scale);
    obj.rotation.setFromVector3(rot);
    scene.add(obj);
    return obj;
}
