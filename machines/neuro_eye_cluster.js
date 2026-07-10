import { darkSteel, aluminum, copper } from '../utils/materials.js';

export function createEyeCluster(THREE) {
    const group = new THREE.Group();
    group.name = "EyeCluster";

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32), darkSteel);
    base.rotation.x = Math.PI / 2;
    group.add(base);

    const eyeGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const pupilGeo = new THREE.SphereGeometry(0.1, 16, 16);

    const tracks = [];
    const times = [0, 1.0, 2.0];

    for(let i=0; i<3; i++) {
        const eyePivot = new THREE.Group();
        eyePivot.name = `Eye_${i}`;
        const angle = (i / 3) * Math.PI * 2;
        eyePivot.position.set(Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0.2);
        
        const eye = new THREE.Mesh(eyeGeo, aluminum);
        const pupil = new THREE.Mesh(pupilGeo, copper);
        pupil.name = `Pupil_${i}`;
        pupil.position.set(0, 0, 0.15);
        pupil.scale.set(1, 1, 0.1);
        
        eye.add(pupil);
        eyePivot.add(eye);
        group.add(eyePivot);

        // Pupil dilation
        const scaleNormal = [1, 1, 0.1];
        const scaleDilated = [1.5, 1.5, 0.1];
        const scaleValues = i % 2 === 0 ? 
            [...scaleNormal, ...scaleDilated, ...scaleNormal] : 
            [...scaleDilated, ...scaleNormal, ...scaleDilated];

        tracks.push(new THREE.VectorKeyframeTrack(`Pupil_${i}.scale`, times, scaleValues));

        // Eye rotation/focus
        const qCenter = new THREE.Quaternion().identity();
        const qLook = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0.2, 0));
        const rotValues = [...qCenter.toArray(), ...qLook.toArray(), ...qCenter.toArray()];
        
        tracks.push(new THREE.QuaternionKeyframeTrack(`Eye_${i}.quaternion`, times, rotValues));
    }

    const clip = new THREE.AnimationClip('FocusAndDilate', 2.0, tracks);

    return { group, animationClips: [clip] };
}
