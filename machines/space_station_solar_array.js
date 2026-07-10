import { aluminum, titanium, glass, gold } from '../utils/materials.js';

export function createSolarArrayTruss(THREE) {
    const group = new THREE.Group();
    group.name = 'SolarArrayTruss';

    // Main Truss structure
    const trussGeo = new THREE.BoxGeometry(0.5, 0.5, 12);
    const truss = new THREE.Mesh(trussGeo, aluminum);
    group.add(truss);

    // Solar panels array pivot
    const panels = new THREE.Group();
    panels.name = 'PanelsPivot';
    
    // Left solar panel
    const leftPanelGeo = new THREE.BoxGeometry(5, 0.05, 8);
    const leftPanel = new THREE.Mesh(leftPanelGeo, gold);
    leftPanel.position.set(3, 0, 0);
    panels.add(leftPanel);

    // Right solar panel
    const rightPanelGeo = new THREE.BoxGeometry(5, 0.05, 8);
    const rightPanel = new THREE.Mesh(rightPanelGeo, gold);
    rightPanel.position.set(-3, 0, 0);
    panels.add(rightPanel);
    
    group.add(panels);

    // Animation: Solar Array Tracking (Rotating continuously to face the sun)
    const times = [0, 10, 20];
    
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
    
    const quatValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const track = new THREE.QuaternionKeyframeTrack('PanelsPivot.quaternion', times, quatValues);
    const clip = new THREE.AnimationClip('SolarTracking', 20, [track]);

    return { group, animationClips: [clip] };
}
