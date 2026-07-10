import { allMaterials as mat, tinted } from '../utils/materials.js';

export function createPockelsCellModulator(THREE) {
    const group = new THREE.Group();
    group.name = "Pockels Cell Modulator";
    const animationClips = [];

    // Housing
    const housingGeo = new THREE.BoxGeometry(2, 2, 4);
    const housing = new THREE.Mesh(housingGeo, mat.aluminum);
    group.add(housing);

    const holeGeo = new THREE.CylinderGeometry(0.5, 0.5, 4.01, 32);
    // Note: We use basic constructive approach instead of CSG. We'll build the housing with 4 pieces if we want a hole.
    // For simplicity, we just use a tube geometry or black center.
    const tubeGeo = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0, 0, -2.1), new THREE.Vector3(0, 0, 2.1)),
        20, 0.4, 16, false
    );
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.BackSide });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tube);

    // KDP Crystal
    const crystalGeo = new THREE.BoxGeometry(0.6, 0.6, 1.5);
    const crystalMat = tinted(mat.glass, 0xccccff);
    crystalMat.emissive = new THREE.Color(0x0000ff);
    crystalMat.emissiveIntensity = 0.2;
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    group.add(crystal);

    // Electrodes
    const electrodeGeo = new THREE.BoxGeometry(0.7, 0.05, 1.5);
    const topElectrode = new THREE.Mesh(electrodeGeo, mat.copper);
    topElectrode.position.set(0, 0.35, 0);
    group.add(topElectrode);

    const bottomElectrode = new THREE.Mesh(electrodeGeo, mat.copper);
    bottomElectrode.position.set(0, -0.35, 0);
    group.add(bottomElectrode);

    // Wiring
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const wireTop = new THREE.Mesh(wireGeo, mat.redAccent);
    wireTop.position.set(0, 1.35, 0);
    group.add(wireTop);

    const wireBot = new THREE.Mesh(wireGeo, mat.blackPlastic);
    wireBot.position.set(0, -1.35, 0);
    group.add(wireBot);

    // Input Light (Linear Polarization)
    const inLightGroup = new THREE.Group();
    inLightGroup.position.set(0, 0, -4);
    group.add(inLightGroup);
    
    const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 16);
    const beam = new THREE.Mesh(beamGeo, new THREE.MeshStandardMaterial({
        color: 0x00ff00, emissive: 0x00ff00, transparent: true, opacity: 0.3
    }));
    beam.rotation.x = Math.PI / 2;
    group.add(beam);

    // Polarization vectors (Input)
    for (let z = -4; z <= -1.5; z += 0.5) {
        const arrowGroup = new THREE.Group();
        const arrowStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
        const arrowHeadGeo = new THREE.ConeGeometry(0.06, 0.15);
        
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        
        const stem = new THREE.Mesh(arrowStemGeo, arrowMat);
        const head1 = new THREE.Mesh(arrowHeadGeo, arrowMat);
        head1.position.y = 0.3;
        const head2 = new THREE.Mesh(arrowHeadGeo, arrowMat);
        head2.position.y = -0.3;
        head2.rotation.x = Math.PI;

        arrowGroup.add(stem, head1, head2);
        arrowGroup.position.z = z;
        group.add(arrowGroup);
    }

    // Polarization vectors (Output - Animated)
    const outArrows = [];
    for (let z = 1.5; z <= 4; z += 0.5) {
        const arrowGroup = new THREE.Group();
        const arrowStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
        const arrowHeadGeo = new THREE.ConeGeometry(0.06, 0.15);
        
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        
        const stem = new THREE.Mesh(arrowStemGeo, arrowMat);
        const head1 = new THREE.Mesh(arrowHeadGeo, arrowMat);
        head1.position.y = 0.3;
        const head2 = new THREE.Mesh(arrowHeadGeo, arrowMat);
        head2.position.y = -0.3;
        head2.rotation.x = Math.PI;

        arrowGroup.add(stem, head1, head2);
        arrowGroup.position.z = z;
        group.add(arrowGroup);
        outArrows.push(arrowGroup);
    }

    // Animation
    // Voltage changes -> Crystal glows more -> Polarization rotates
    const times = [];
    const rotValsList = outArrows.map(() => []);
    const glowVals = [];

    for (let i = 0; i <= 40; i++) {
        const t = i * 0.1; // 4 seconds
        times.push(t);
        
        // Modulating voltage (sine wave)
        const voltage = (Math.sin(t * Math.PI) + 1) / 2; // 0 to 1
        glowVals.push(0.2 + voltage * 0.8);
        
        const rotationAngle = voltage * Math.PI / 2; // Rotates 0 to 90 degrees

        outArrows.forEach((arr, idx) => {
            // Slight phase shift along Z for wave effect
            const zPhase = idx * 0.1;
            const finalAngle = rotationAngle + zPhase * voltage; 
            
            // Quaternion for Z rotation
            const quat = new THREE.Quaternion();
            quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), finalAngle);
            rotValsList[idx].push(quat.x, quat.y, quat.z, quat.w);
        });
    }

    const tracks = [];
    tracks.push(new THREE.NumberKeyframeTrack(`${crystal.material.uuid}.emissiveIntensity`, times, glowVals));
    
    outArrows.forEach((arr, idx) => {
        tracks.push(new THREE.QuaternionKeyframeTrack(`${arr.uuid}.quaternion`, times, rotValsList[idx]));
    });

    const clip = new THREE.AnimationClip('PockelsModulation', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
