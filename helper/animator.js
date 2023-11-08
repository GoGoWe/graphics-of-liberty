export function rotate(obj, renderZaehler, radius, startausrichtung, startX,startY, startZ){
    if(obj===null)return;
    obj.rotation.y = renderZaehler/1000;
    obj.orientationY=obj.orientationY+startausrichtung;
    obj.position.y=startY;
    obj.position.x = startX+Math.sin(renderZaehler/1000+startausrichtung)*radius*25;
    obj.position.z = startZ+Math.sin(renderZaehler/1000+Math.PI/2+startausrichtung)*radius*20
}