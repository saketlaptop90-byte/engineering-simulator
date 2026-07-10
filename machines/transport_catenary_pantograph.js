import { metalMaterial } from '../utils/materials.js';

export function createCatenaryPantograph(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base mount (on top of train)
    const baseGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const baseMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x777777 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Lower Arm
    const lowerArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    lowerArmGeo.translate(0, 0.75, 0);
    const lowerArm = new THREE.Mesh(lowerArmGeo, baseMat);
    lowerArm.position.set(0, 0.1, 0);
    base.add(lowerArm);

    // Upper Arm
    const upperArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    upperArmGeo.translate(0, 0.75, 0);
    const upperArm = new THREE.Mesh(upperArmGeo, baseMat);
    upperArm.position.set(0, 1.5, 0); // attached to end of lower arm
    lowerArm.add(upperArm);

    // Contact Shoe
    const shoeGeo = new THREE.BoxGeometry(1.2, 0.1, 0.2);
    const shoe = new THREE.Mesh(shoeGeo, baseMat);
    shoe.position.set(0, 1.5, 0);
    upperArm.add(shoe);

    // Animation: Extend and compress (pantograph adjusting to wire height)
    // lowerArm rotates Z, upperArm rotates Z opposite to keep shoe horizontal
    const times = [0, 2, 4];
    
    // Lower arm rotation (lean forward)
    const lowerVals = [Math.PI/6, Math.PI/4, Math.PI/6];
    const lowerTrack = new THREE.NumberKeyframeTrack(`${lowerArm.uuid}.rotation[z]`, times, lowerVals);

    // Upper arm rotation (bend back)
    const upperVals = [-Math.PI/3, -Math.PI/2, -Math.PI/3];
    const upperTrack = new THREE.NumberKeyframeTrack(`${upperArm.uuid}.rotation[z]`, times, upperVals);

    // Keep shoe horizontal (counter-rotate)
    const shoeVals = [Math.PI/6, Math.PI/4, Math.PI/6];
    const shoeTrack = new THREE.NumberKeyframeTrack(`${shoe.uuid}.rotation[z]`, times, shoeVals);

    const clip = new THREE.AnimationClip('AdjustHeight', 4, [lowerTrack, upperTrack, shoeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
