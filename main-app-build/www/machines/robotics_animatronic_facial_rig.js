import { aluminum, carbonFiber, blackPlastic, yellowAccent } from '../utils/materials.js';

export function createAnimatronicFacialRig(THREE) {
    const group = new THREE.Group();
    group.name = "AnimatronicFacialRig";

    // Skull Base
    const skullGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const skull = new THREE.Mesh(skullGeo, aluminum);
    group.add(skull);

    // Jaw Pivot
    const jawPivot = new THREE.Group();
    jawPivot.name = "JawPivot";
    jawPivot.position.set(0, -0.5, 1.2);
    skull.add(jawPivot);

    const jawGeo = new THREE.BoxGeometry(1.2, 0.4, 1);
    const jaw = new THREE.Mesh(jawGeo, carbonFiber);
    jaw.position.set(0, -0.2, 0);
    jawPivot.add(jaw);

    // Eye Brows
    const browGeo = new THREE.BoxGeometry(0.8, 0.1, 0.1);
    
    const leftBrowPivot = new THREE.Group();
    leftBrowPivot.name = "LeftBrowPivot";
    leftBrowPivot.position.set(-0.6, 0.8, 1.4);
    skull.add(leftBrowPivot);
    const leftBrow = new THREE.Mesh(browGeo, blackPlastic);
    leftBrowPivot.add(leftBrow);

    const rightBrowPivot = new THREE.Group();
    rightBrowPivot.name = "RightBrowPivot";
    rightBrowPivot.position.set(0.6, 0.8, 1.4);
    skull.add(rightBrowPivot);
    const rightBrow = new THREE.Mesh(browGeo, blackPlastic);
    rightBrowPivot.add(rightBrow);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.3, 16, 16);
    
    const leftEyePivot = new THREE.Group();
    leftEyePivot.name = "LeftEyePivot";
    leftEyePivot.position.set(-0.6, 0.4, 1.3);
    skull.add(leftEyePivot);
    const leftEye = new THREE.Mesh(eyeGeo, yellowAccent);
    leftEyePivot.add(leftEye);

    const rightEyePivot = new THREE.Group();
    rightEyePivot.name = "RightEyePivot";
    rightEyePivot.position.set(0.6, 0.4, 1.3);
    skull.add(rightEyePivot);
    const rightEye = new THREE.Mesh(eyeGeo, yellowAccent);
    rightEyePivot.add(rightEye);

    // Animations (Emoting: talking, surprised, angry)
    const duration = 4;
    const qCenter = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    // Jaw Talking
    const jOpen = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 6, 0, 0));
    const jawTrack = new THREE.QuaternionKeyframeTrack('JawPivot.quaternion', [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4], [
        ...qCenter.toArray(), ...jOpen.toArray(), ...qCenter.toArray(), ...jOpen.toArray(),
        ...qCenter.toArray(), ...jOpen.toArray(), ...qCenter.toArray(), ...jOpen.toArray(), ...qCenter.toArray()
    ]);

    // Brows Angry to Surprised
    const bAngryLeft = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 8));
    const bAngryRight = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 8));
    const bSurprise = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 8, 0, 0));

    const lBrowTrack = new THREE.QuaternionKeyframeTrack('LeftBrowPivot.quaternion', [0, 1, 2, 3, 4], [
        ...qCenter.toArray(), ...bAngryLeft.toArray(), ...qCenter.toArray(), ...bSurprise.toArray(), ...qCenter.toArray()
    ]);
    const rBrowTrack = new THREE.QuaternionKeyframeTrack('RightBrowPivot.quaternion', [0, 1, 2, 3, 4], [
        ...qCenter.toArray(), ...bAngryRight.toArray(), ...qCenter.toArray(), ...bSurprise.toArray(), ...qCenter.toArray()
    ]);

    // Eyes darting
    const eLeft = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 6, 0));
    const eRight = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 6, 0));

    const lEyeTrack = new THREE.QuaternionKeyframeTrack('LeftEyePivot.quaternion', [0, 1.5, 2, 3.5, 4], [
        ...qCenter.toArray(), ...eLeft.toArray(), ...qCenter.toArray(), ...eRight.toArray(), ...qCenter.toArray()
    ]);
    const rEyeTrack = new THREE.QuaternionKeyframeTrack('RightEyePivot.quaternion', [0, 1.5, 2, 3.5, 4], [
        ...qCenter.toArray(), ...eLeft.toArray(), ...qCenter.toArray(), ...eRight.toArray(), ...qCenter.toArray()
    ]);

    const emoteClip = new THREE.AnimationClip('Emote', duration, [jawTrack, lBrowTrack, rBrowTrack, lEyeTrack, rEyeTrack]);

    return { group, animationClips: [emoteClip] };
}
