import { materials } from '../utils/materials.js';

export function createHighVoltageInsulator(THREE) {
    const group = new THREE.Group();
    
    const matCeramic = materials?.ceramic || new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.2, metalness: 0.1 });
    const matMetal = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.8 });
    const matArc = materials?.glow || new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });

    // Main central rod
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.5, 8);
    const rod = new THREE.Mesh(rodGeo, matMetal);
    group.add(rod);

    // Insulator disks (sheds)
    const diskGeo = new THREE.TorusGeometry(0.2, 0.08, 8, 24);
    const diskFillGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 24);
    
    for (let i = 0; i < 12; i++) {
        const disk = new THREE.Mesh(diskGeo, matCeramic);
        disk.rotation.x = Math.PI / 2;
        disk.position.y = -1.5 + i * 0.25;
        
        const diskFill = new THREE.Mesh(diskFillGeo, matCeramic);
        diskFill.position.y = -1.5 + i * 0.25;
        
        group.add(disk);
        group.add(diskFill);
    }

    // Top and bottom connectors
    const connectorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
    const topConnector = new THREE.Mesh(connectorGeo, matMetal);
    topConnector.position.y = 1.6;
    group.add(topConnector);

    const bottomConnector = new THREE.Mesh(connectorGeo, matMetal);
    bottomConnector.position.y = -1.6;
    group.add(bottomConnector);

    // Corona ring at the bottom
    const ringGeo = new THREE.TorusGeometry(0.4, 0.03, 16, 32);
    const coronaRing = new THREE.Mesh(ringGeo, matMetal);
    coronaRing.rotation.x = Math.PI / 2;
    coronaRing.position.y = -1.7;
    group.add(coronaRing);

    // Spark / Arc effect for animation
    const arcGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const arc = new THREE.Mesh(arcGeo, matArc);
    arc.position.set(0.4, -1.7, 0);
    arc.name = "sparkArc";
    group.add(arc);

    // Animations: Swaying of the string and sparking of the corona ring
    const times = [0, 1, 2, 3, 4];
    
    // Sway animation using quaternion
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05, 0, 0));
    const q5 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const rotValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q5.x, q5.y, q5.z, q5.w
    ];
    const swayTrack = new THREE.QuaternionKeyframeTrack('.quaternion', times, rotValues);

    // Arc flashing animation (scale)
    const arcScaleValues = [
        1, 1, 1,
        0.1, 0.1, 0.1,
        1.5, 1.5, 1.5,
        0.1, 0.1, 0.1,
        1, 1, 1
    ];
    const arcTrack = new THREE.VectorKeyframeTrack('sparkArc.scale', times, arcScaleValues);

    const clip = new THREE.AnimationClip('InsulatorAction', 4, [swayTrack, arcTrack]);

    return { group, animationClips: [clip] };
}
