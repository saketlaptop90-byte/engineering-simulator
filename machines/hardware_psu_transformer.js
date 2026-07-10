import * as materials from '../utils/materials.js';

export function createPSUTransformer(THREE) {
    const group = new THREE.Group();
    const clips = [];

    // Base plate
    const baseGeo = new THREE.BoxGeometry(8, 0.4, 8);
    const base = new THREE.Mesh(baseGeo, materials.greenPCB);
    group.add(base);

    // Ferrite Core (E-I type core)
    const coreMat = materials.castIron;
    const coreBottom = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 3), coreMat);
    coreBottom.position.set(0, 0.7, 0);
    group.add(coreBottom);

    const coreLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 3), coreMat);
    coreLeft.position.set(-2.5, 3.2, 0);
    group.add(coreLeft);

    const coreRight = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 3), coreMat);
    coreRight.position.set(2.5, 3.2, 0);
    group.add(coreRight);

    const coreCenter = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4, 3), coreMat);
    coreCenter.position.set(0, 3.2, 0);
    group.add(coreCenter);

    const coreTop = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 3), coreMat);
    coreTop.position.set(0, 5.7, 0);
    group.add(coreTop);

    // Primary Coil (thick copper wire wrapper around center)
    const priGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.5, 32);
    const priMat = materials.wireCoil.clone();
    priMat.emissive = new THREE.Color(0xff8800);
    const primaryCoil = new THREE.Mesh(priGeo, priMat);
    primaryCoil.position.set(0, 2.5, 0);
    primaryCoil.name = "PrimaryCoil";
    group.add(primaryCoil);

    // Secondary Coil (gold colored wire around center)
    const secGeo = new THREE.CylinderGeometry(2.0, 2.0, 1.5, 32);
    const secMat = materials.gold.clone();
    secMat.emissive = new THREE.Color(0x0088ff);
    const secondaryCoil = new THREE.Mesh(secGeo, secMat);
    secondaryCoil.position.set(0, 4.0, 0);
    secondaryCoil.name = "SecondaryCoil";
    group.add(secondaryCoil);

    // Insulation tape
    const tapeGeo = new THREE.CylinderGeometry(2.1, 2.1, 3.2, 32);
    const tapeMat = materials.yellowAccent;
    const tape = new THREE.Mesh(tapeGeo, tapeMat);
    tape.position.set(0, 3.25, 0);
    group.add(tape);

    // Magnetic flux animation (pulsing coils)
    const times = [0, 0.25, 0.5, 0.75, 1];
    const priVals = [0.1, 0.6, 0.1, 0.6, 0.1];
    const secVals = [0.6, 0.1, 0.6, 0.1, 0.6]; // Alternating phase
    
    const priTrack = new THREE.NumberKeyframeTrack('PrimaryCoil.material.emissiveIntensity', times, priVals);
    const secTrack = new THREE.NumberKeyframeTrack('SecondaryCoil.material.emissiveIntensity', times, secVals);
    
    clips.push(new THREE.AnimationClip('TransformerFlux', 1, [priTrack, secTrack]));

    return { group, animationClips: clips };
}
