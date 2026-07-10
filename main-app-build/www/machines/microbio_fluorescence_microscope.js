import * as materials from '../utils/materials.js';

export function createFluorescenceMicroscope(THREE) {
    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const darkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
    const plastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 });
    const glowingBlue = materials.glowingBlue || new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0055ff, emissiveIntensity: 2 });

    const group = new THREE.Group();
    group.name = "FluorescenceMicroscope";

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, darkMetal);
    base.position.y = 0.25;
    group.add(base);

    // Arm
    const armGeo = new THREE.BoxGeometry(0.8, 3, 0.8);
    const arm = new THREE.Mesh(armGeo, metal);
    arm.position.set(0, 2, -1);
    group.add(arm);

    // Stage
    const stageGeo = new THREE.BoxGeometry(1.5, 0.1, 1.5);
    const stage = new THREE.Mesh(stageGeo, plastic);
    stage.position.set(0, 1.5, 0);
    stage.name = "FocusStage";
    group.add(stage);

    // Objective Lenses (Rotating turret)
    const turretGroup = new THREE.Group();
    turretGroup.position.set(0, 2.5, 0);
    turretGroup.name = "LensTurret";
    
    const turretBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const turretBase = new THREE.Mesh(turretBaseGeo, darkMetal);
    turretBase.rotation.x = Math.PI / 2;
    turretGroup.add(turretBase);

    const lensGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 16);
    const lens = new THREE.Mesh(lensGeo, metal);
    lens.position.set(0, -0.3, 0.3);
    turretGroup.add(lens);

    group.add(turretGroup);

    // Fluorescence Light Source
    const lightGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const lightSource = new THREE.Mesh(lightGeo, glowingBlue);
    lightSource.position.set(0, 3, -1.5);
    group.add(lightSource);

    // Animations: Stage moving up/down (focus), Turret rotating
    const times = [0, 2, 4];
    const stageTrack = new THREE.VectorKeyframeTrack(stage.name + '.position', times, [0, 1.3, 0, 0, 1.7, 0, 0, 1.3, 0]);

    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI * 2));
    const turretTrack = new THREE.QuaternionKeyframeTrack(turretGroup.name + '.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    const focusClip = new THREE.AnimationClip("FocusAndSwitch", 4, [stageTrack, turretTrack]);

    return { group, animationClips: [focusClip] };
}
