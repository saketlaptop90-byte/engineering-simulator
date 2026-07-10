import { materials } from '../utils/materials.js';

export function createInductionMotor(THREE) {
    const group = new THREE.Group();
    
    const matCasing = materials?.casing || new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.7 });
    const matRotor = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x95a5a6, metalness: 0.9, roughness: 0.2 });
    const matCopper = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.4 });
    const matShaft = materials?.steel || new THREE.MeshStandardMaterial({ color: 0xbdc3c7, metalness: 1.0, roughness: 0.3 });

    // Motor body
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const body = new THREE.Mesh(bodyGeo, matCasing);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Cooling fins
    for (let i = 0; i < 16; i++) {
        const finGeo = new THREE.BoxGeometry(1.8, 0.2, 0.1);
        const fin = new THREE.Mesh(finGeo, matCasing);
        const angle = (i / 16) * Math.PI * 2;
        fin.position.y = Math.sin(angle) * 1.05;
        fin.position.z = Math.cos(angle) * 1.05;
        fin.rotation.x = -angle;
        group.add(fin);
    }

    // End bells
    const bellGeo = new THREE.CylinderGeometry(1, 0.8, 0.3, 32);
    const leftBell = new THREE.Mesh(bellGeo, matCasing);
    leftBell.position.x = -1.15;
    leftBell.rotation.z = Math.PI / 2;
    group.add(leftBell);

    const rightBell = new THREE.Mesh(bellGeo, matCasing);
    rightBell.position.x = 1.15;
    rightBell.rotation.z = Math.PI / 2;
    group.add(rightBell);

    // Stator windings (visible inside if we cut away, but we'll add some copper bits extending)
    const windingGeo = new THREE.TorusGeometry(0.7, 0.15, 16, 32);
    const winding1 = new THREE.Mesh(windingGeo, matCopper);
    winding1.position.x = 1.0;
    winding1.rotation.y = Math.PI / 2;
    group.add(winding1);

    const winding2 = new THREE.Mesh(windingGeo, matCopper);
    winding2.position.x = -1.0;
    winding2.rotation.y = Math.PI / 2;
    group.add(winding2);

    // Rotor and Shaft group
    const rotatingPart = new THREE.Group();
    rotatingPart.name = "rotorGroup";
    
    const shaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 16);
    const shaft = new THREE.Mesh(shaftGeo, matShaft);
    shaft.rotation.z = Math.PI / 2;
    rotatingPart.add(shaft);

    // Rotor core visible at the end
    const rotorGeo = new THREE.CylinderGeometry(0.68, 0.68, 1.8, 32);
    const rotor = new THREE.Mesh(rotorGeo, matRotor);
    rotor.rotation.z = Math.PI / 2;
    rotatingPart.add(rotor);

    // Fan at the non-drive end
    const fanGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(fanGeo, matCasing);
        blade.position.x = -1.5;
        blade.rotation.x = (i / 4) * Math.PI;
        rotatingPart.add(blade);
    }

    group.add(rotatingPart);

    // Base mount
    const baseGeo = new THREE.BoxGeometry(1.5, 0.2, 1.2);
    const baseMount = new THREE.Mesh(baseGeo, matCasing);
    baseMount.position.y = -1.1;
    group.add(baseMount);

    // Animation: Rotor spinning around X-axis continuously
    const rotTimes = [0, 0.25, 0.5, 0.75, 1.0];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI*1.5);
    const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI*2);
    
    const rotValuesQ = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q5.x, q5.y, q5.z, q5.w
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('rotorGroup.quaternion', rotTimes, rotValuesQ);
    const clip = new THREE.AnimationClip('spin', 1.0, [track]);

    return { group, animationClips: [clip] };
}
