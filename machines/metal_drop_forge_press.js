import * as materials from '../utils/materials.js';

export function createDropForgePress(THREE) {
    const group = new THREE.Group();
    group.name = 'DropForgePress';
    const animationClips = [];

    // Base/Anvil
    const baseGeo = new THREE.BoxGeometry(3, 1, 3);
    const darkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.8, roughness: 0.5});
    const base = new THREE.Mesh(baseGeo, darkMetal);
    base.position.y = 0.5;
    group.add(base);

    // Workpiece (Hot metal part)
    const workGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
    const hotMetal = materials.hotSteel || new THREE.MeshStandardMaterial({color: 0xff4400, emissive: 0xff2200});
    const workpiece = new THREE.Mesh(workGeo, hotMetal);
    workpiece.position.y = 1.25;
    workpiece.name = 'Workpiece';
    group.add(workpiece);

    // Frame Columns
    const colGeo = new THREE.BoxGeometry(0.5, 5, 0.5);
    const col1 = new THREE.Mesh(colGeo, darkMetal);
    col1.position.set(-1.25, 3.5, -1.25);
    group.add(col1);
    
    const col2 = new THREE.Mesh(colGeo, darkMetal);
    col2.position.set(1.25, 3.5, -1.25);
    group.add(col2);

    const col3 = new THREE.Mesh(colGeo, darkMetal);
    col3.position.set(-1.25, 3.5, 1.25);
    group.add(col3);

    const col4 = new THREE.Mesh(colGeo, darkMetal);
    col4.position.set(1.25, 3.5, 1.25);
    group.add(col4);

    // Top Header
    const headGeo = new THREE.BoxGeometry(3, 1, 3);
    const header = new THREE.Mesh(headGeo, darkMetal);
    header.position.y = 6.5;
    group.add(header);

    // Hammer
    const hammerGeo = new THREE.BoxGeometry(2, 2, 2);
    const hammerMat = materials.shinySteel || new THREE.MeshStandardMaterial({color: 0x999999, metalness: 0.7});
    const hammer = new THREE.Mesh(hammerGeo, hammerMat);
    hammer.position.y = 4.5;
    hammer.name = 'Hammer';
    group.add(hammer);

    // Impact Sparks
    const sparkGeo = new THREE.SphereGeometry(0.8, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({color: 0xffaa00, transparent: true, opacity: 0.5});
    const sparks = new THREE.Mesh(sparkGeo, sparkMat);
    sparks.position.y = 1.5;
    sparks.name = 'Sparks';
    group.add(sparks);

    // Animations
    const duration = 2;
    const times = [0, 0.5, 0.6, 0.7, 1.5, 2];
    
    // Hammer dropping fast, rising slow
    const hammerPos = new THREE.NumberKeyframeTrack('Hammer.position[y]', times, [4.5, 4.5, 2.5, 2.5, 4.5, 4.5]);
    
    // Workpiece squishing
    const workScale = new THREE.VectorKeyframeTrack('Workpiece.scale', times, [
        1,1,1,   1,1,1,   1.2,0.4,1.2,   1.2,0.4,1.2,   1,1,1,   1,1,1
    ]);

    // Sparks flashing exactly at impact (t=0.6)
    const sparkScale = new THREE.VectorKeyframeTrack('Sparks.scale', times, [
        0,0,0,   0,0,0,   1,0.2,1,       0,0,0,         0,0,0,   0,0,0
    ]);

    const clip = new THREE.AnimationClip('ForgeCycle', duration, [hammerPos, workScale, sparkScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
