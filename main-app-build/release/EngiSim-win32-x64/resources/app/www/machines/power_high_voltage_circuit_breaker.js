import { 
  metalMaterial, 
  darkMetalMaterial, 
  copperMaterial, 
  insulatorMaterial, 
  casingMaterial, 
  highlightMaterial 
} from '../utils/materials.js';

export function createHighVoltageCircuitBreaker(THREE) {
    const group = new THREE.Group();
    group.name = "HighVoltageCircuitBreaker";

    const animationClips = [];

    // Base Support
    const baseGeom = new THREE.BoxGeometry(2, 0.5, 1);
    const base = new THREE.Mesh(baseGeom, darkMetalMaterial);
    base.position.y = 0.25;
    group.add(base);

    // Vertical Support Column (Insulator)
    const supportGeom = new THREE.CylinderGeometry(0.2, 0.3, 3, 16);
    const support = new THREE.Mesh(supportGeom, insulatorMaterial);
    support.position.y = 2;
    group.add(support);

    // Horizontal Interrupter Chamber
    const chamberGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    const chamber = new THREE.Mesh(chamberGeom, insulatorMaterial);
    chamber.rotation.z = Math.PI / 2;
    chamber.position.y = 3.5;
    group.add(chamber);

    // Terminals
    const termGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const term1 = new THREE.Mesh(termGeom, metalMaterial);
    term1.position.set(-2, 3.5, 0);
    group.add(term1);
    
    const term2 = new THREE.Mesh(termGeom, metalMaterial);
    term2.position.set(2, 3.5, 0);
    group.add(term2);

    // Moving Contact Mechanism (Internal, modeled as an external indicator for animation)
    const indicatorGroup = new THREE.Group();
    indicatorGroup.name = "BreakerIndicator";
    indicatorGroup.position.set(0, 3.5, 0.5);
    group.add(indicatorGroup);

    const indicatorArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.1), highlightMaterial);
    indicatorArm.position.y = -0.5;
    indicatorGroup.add(indicatorArm);

    // Animation: Breaker Open/Close
    const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI / 4);
    const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    
    const trackName = `${indicatorGroup.name}.quaternion`;
    const times = [0, 0.1, 2, 2.1, 4];
    const values = [
        ...qClosed.toArray(), 
        ...qOpen.toArray(), 
        ...qOpen.toArray(), 
        ...qClosed.toArray(), 
        ...qClosed.toArray()
    ];
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Operate', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
