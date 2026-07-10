import { castIron, brass, steel } from '../utils/materials.js';

export function createCentrifugalPump(THREE) {
    const group = new THREE.Group();
    group.name = "CentrifugalPump";

    // Casing (half cutaway)
    const casingGeo = new THREE.TorusGeometry(3, 1, 16, 64, Math.PI * 1.5);
    const casing = new THREE.Mesh(casingGeo, castIron);
    group.add(casing);
    
    // Inlet/Outlet pipes
    const inletGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const inlet = new THREE.Mesh(inletGeo, castIron);
    inlet.rotation.x = Math.PI / 2;
    inlet.position.set(0, 0, 2.5);
    group.add(inlet);

    const outletGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    const outlet = new THREE.Mesh(outletGeo, castIron);
    outlet.position.set(4, 3, 0);
    group.add(outlet);

    // Impeller Group
    const impellerGroup = new THREE.Group();
    impellerGroup.name = "Impeller";
    group.add(impellerGroup);

    // Impeller back plate
    const backPlateGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);
    backPlateGeo.rotateX(Math.PI / 2);
    const backPlate = new THREE.Mesh(backPlateGeo, brass);
    backPlate.position.z = -0.5;
    impellerGroup.add(backPlate);

    // Impeller Blades (curved)
    const numBlades = 6;
    for (let i = 0; i < numBlades; i++) {
        const bladeShape = new THREE.Shape();
        bladeShape.moveTo(0.5, 0);
        bladeShape.quadraticCurveTo(1.5, 0.5, 2.4, 1.5);
        bladeShape.lineTo(2.2, 1.8);
        bladeShape.quadraticCurveTo(1.3, 0.6, 0.4, 0.2);
        bladeShape.lineTo(0.5, 0);

        const extrudeSettings = { depth: 0.8, bevelEnabled: false };
        const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
        const blade = new THREE.Mesh(bladeGeo, brass);
        
        blade.rotation.z = (i / numBlades) * Math.PI * 2;
        blade.position.z = -0.4;
        impellerGroup.add(blade);
    }

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 32);
    shaftGeo.rotateX(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.position.z = -2;
    impellerGroup.add(shaft);

    // Animation
    const numSteps = 16;
    const times = [];
    const values = [];
    const duration = 1.0;
    for(let i=0; i<=numSteps; i++) {
        times.push((i / numSteps) * duration);
        const angle = (i / numSteps) * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        values.push(...q.toArray());
    }

    const track = new THREE.QuaternionKeyframeTrack('Impeller.quaternion', times, values);
    const clip = new THREE.AnimationClip('SpinImpeller', duration, [track]);

    return { group, animationClips: [clip] };
}
