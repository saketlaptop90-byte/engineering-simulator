import * as sharedMaterials from '../utils/materials.js';

export function createMicrotomeSlicer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMat = sharedMaterials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x999999 });
    const darkMat = sharedMaterials.darkMetalMaterial || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const bladeMat = sharedMaterials.shinyMetalMaterial || new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.1 });
    const tissueMat = sharedMaterials.accentMaterial || new THREE.MeshStandardMaterial({ color: 0xffaaaa });

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 1, 2);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.5, 0);
    group.add(base);

    // Handwheel
    const wheelGroup = new THREE.Group();
    wheelGroup.name = "MicrotomeWheel";
    wheelGroup.position.set(1.1, 0.8, 0);

    const wheelGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
    const wheel = new THREE.Mesh(wheelGeo, darkMat);
    wheel.rotation.y = Math.PI / 2;
    wheelGroup.add(wheel);

    const handleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
    const handle = new THREE.Mesh(handleGeo, baseMat);
    handle.position.set(0.1, 0.3, 0);
    handle.rotation.z = Math.PI / 2;
    wheelGroup.add(handle);
    group.add(wheelGroup);

    // Blade block
    const bladeBlockGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
    const bladeBlock = new THREE.Mesh(bladeBlockGeo, darkMat);
    bladeBlock.position.set(-0.3, 1.2, 0.4);
    group.add(bladeBlock);

    // Moving Specimen Head
    const headGroup = new THREE.Group();
    headGroup.name = "SpecimenHead";
    headGroup.position.set(-0.3, 1.2, -0.4);

    const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const head = new THREE.Mesh(headGeo, baseMat);
    headGroup.add(head);

    const tissueGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const tissue = new THREE.Mesh(tissueGeo, tissueMat);
    tissue.position.set(0, 0, 0.25);
    headGroup.add(tissue);

    group.add(headGroup);

    // Animations: Wheel rotates, Head moves down and up
    const rTimes = [];
    const rValues = [];
    let angle = 0;
    for (let t = 0; t <= 4; t += 0.1) {
        rTimes.push(t);
        angle += Math.PI * 0.1; // steady rotation
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
        rValues.push(q.x, q.y, q.z, q.w);
    }
    const wheelTrack = new THREE.QuaternionKeyframeTrack('MicrotomeWheel.quaternion', rTimes, rValues);

    const pTimes = [0, 1, 2, 3, 4];
    const pValues = [
        -0.3, 1.2, -0.4,
        -0.3, 0.9, -0.4, // move down (cut)
        -0.3, 1.2, -0.4, // back up
        -0.3, 0.9, -0.4,
        -0.3, 1.2, -0.4
    ];
    const headTrack = new THREE.VectorKeyframeTrack('SpecimenHead.position', pTimes, pValues);

    const clip = new THREE.AnimationClip('MicrotomeSlice', 4, [wheelTrack, headTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
