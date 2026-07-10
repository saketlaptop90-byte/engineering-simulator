import { whitePlastic, darkSteel, aluminum, blueAccent } from '../utils/materials.js';

export function createCRACUnit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Unit
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.0), whitePlastic);
    body.position.y = 1.25;
    group.add(body);

    // Front Display
    const display = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), darkSteel);
    display.position.set(0, 2.0, 0.501);
    group.add(display);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.15), blueAccent);
    screen.position.set(0, 2.0, 0.502);
    group.add(screen);

    // Louvers (Vents)
    const louverGroup = new THREE.Group();
    louverGroup.position.set(0, 1.5, 0.5);
    for (let i = 0; i < 10; i++) {
        const louverPivot = new THREE.Group();
        louverPivot.position.set(0, -0.4 + i * 0.08, 0);
        louverPivot.name = `Louver_${i}`;

        const louver = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.1), aluminum);
        louverPivot.add(louver);
        louverGroup.add(louverPivot);

        // Oscillate louver
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.2);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.2);
        const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.2);
        
        const qValues = [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ];
        const track = new THREE.QuaternionKeyframeTrack(`${louverPivot.name}.quaternion`, [0, 2, 4], qValues);
        animationClips.push(new THREE.AnimationClip(`OscillateLouver_${i}`, 4, [track]));
    }
    group.add(louverGroup);

    // Internal Blower Fan (visible through a grille)
    const grille = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), darkSteel);
    grille.position.set(0, 0.5, 0.501);
    group.add(grille);

    const fanPivot = new THREE.Group();
    fanPivot.position.set(0, 0.5, 0.51); // slightly in front for visibility
    fanPivot.name = 'CRAC_Fan';

    const fanMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16), aluminum);
    fanMesh.rotation.x = Math.PI / 2;
    fanPivot.add(fanMesh);
    group.add(fanPivot);

    const q1f = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2f = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q3f = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 2);
    
    const qValuesF = [
        q1f.x, q1f.y, q1f.z, q1f.w,
        q2f.x, q2f.y, q2f.z, q2f.w,
        q3f.x, q3f.y, q3f.z, q3f.w
    ];
    const trackF = new THREE.QuaternionKeyframeTrack(`${fanPivot.name}.quaternion`, [0, 0.25, 0.5], qValuesF);
    animationClips.push(new THREE.AnimationClip('SpinCRACFan', 0.5, [trackF]));

    return { group, animationClips };
}
