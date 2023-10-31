export function rotate(obj, renderZaehler, radius, startausrichtung){
    if(obj===null)return;
    obj.rotation.y = renderZaehler/100;
    obj.orientationY=obj.orientationY+=startausrichtung;
    obj.position.x = obj.position.x+Math.sin(renderZaehler/100-Math.PI/2+startausrichtung)*radius
    obj.position.z = obj.position.z+Math.sin(renderZaehler/100+startausrichtung)*radius
}