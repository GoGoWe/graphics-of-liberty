
/** Load objects from path asynchronous into the scene 
 * @param {String} path - Path where the 3D object can be found
 * @param {THREE.Scene} scene - Scene where the loaded 3D object should be placed into  
 * @param {THREE.Loader} loader - The loader that is responsible to load the given file (e.g GLTFLoader for gltf files)
 * @param {THREE.Vector3} scale - The scale of the object as vactor
*/
export async function loadObject(path, scene, loader, scale, pos, rot) {
    const objData = await loader.loadAsync(path);
    let obj = objData.scene;
    obj.position.copy(pos);
    obj.scale.set(scale[0], scale[1], scale[2]);
    obj.rotation.set(rot[0], rot[1], rot[2]);
    scene.add(obj);
    return obj;
}
