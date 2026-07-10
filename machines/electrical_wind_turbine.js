import { materials } from '../utils/materials.js';

export function createWindTurbine(THREE) {
    const group = new THREE.Group();

    const matTower = materials?.whiteMetal || new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.5, metalness: 0.3 });
    const matBlade = materials?.fiberglass || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const matNacelle = materials?.whiteMetal || new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.5 });
    const matHub = materials?.greyMetal || new THREE.MeshStandardMaterial({ color: 0xbdc3c7, roughness: 0.6 });

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.5, 1.2, 20, 16);
    const tower = new THREE.Mesh(towerGeo, matTower);
    tower.position.y = 10;
    group.add(tower);

    // Nacelle
    const nacelleGeo = new THREE.BoxGeometry(1.5, 1.5, 4);
    const nacelle = new THREE.Mesh(nacelleGeo, matNacelle);
    nacelle.position.y = 20.5;
    nacelle.position.z = -1;
    group.add(nacelle);

    // Rotor group
    const rotorGroup = new THREE.Group();
    rotorGroup.name = "rotorGroup";
    rotorGroup.position.set(0, 20.5, 1.2);
    group.add(rotorGroup);

    // Hub
    const hubGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const hub = new THREE.Mesh(hubGeo, matHub);
    rotorGroup.add(hub);

    // Blades
    const bladeGeo = new THREE.BoxGeometry(0.6, 12, 0.2);
    
    for (let i = 0; i < 3; i++) {
        const bladePivot = new THREE.Group();
        const bladeMesh = new THREE.Mesh(bladeGeo, matBlade);
        bladeMesh.position.y = 6.5;
        // Aerodynamic twist
        bladeMesh.rotation.y = 0.2; 
        bladePivot.add(bladeMesh);
        
        bladePivot.rotation.z = (i / 3) * Math.PI * 2;
        rotorGroup.add(bladePivot);
    }

    // Aviation light on top of nacelle
    const lightGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const matLight = materials?.redLight || new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const light = new THREE.Mesh(lightGeo, matLight);
    light.position.set(0, 21.4, -2);
    light.name = "aviationLight";
    group.add(light);

    // Animations: Rotor spinning continuously around Z-axis, light blinking
    const rotTimes = [0, 1, 2, 3, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI*1.5);
    const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI*2);
    
    const rotValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q5.x, q5.y, q5.z, q5.w
    ];
    const rotTrack = new THREE.QuaternionKeyframeTrack('rotorGroup.quaternion', rotTimes, rotValues);

    const lightTimes = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];
    const lightScales = [
        1,1,1,
        0,0,0,
        1,1,1,
        0,0,0,
        1,1,1,
        0,0,0,
        1,1,1,
        0,0,0,
        1,1,1
    ];
    const lightTrack = new THREE.VectorKeyframeTrack('aviationLight.scale', lightTimes, lightScales);

    const clip = new THREE.AnimationClip('TurbineAction', 4.0, [rotTrack, lightTrack]);

    return { group, animationClips: [clip] };
}
