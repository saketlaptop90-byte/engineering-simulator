import * as materials from '../utils/materials.js';

export function createRadiosondeWeatherBalloon(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matBalloon = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, transparent: true, opacity: 0.9 });
    const matBox = materials.whitePaint || new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const matString = new THREE.LineBasicMaterial({ color: 0x000000 });

    const balloonGroup = new THREE.Group();
    balloonGroup.name = "balloonGroup";
    group.add(balloonGroup);

    // Balloon
    const balloonGeom = new THREE.SphereGeometry(3, 32, 32);
    balloonGeom.scale(1, 1.2, 1);
    const balloon = new THREE.Mesh(balloonGeom, matBalloon);
    balloon.position.y = 10;
    balloonGroup.add(balloon);

    // String
    const points = [];
    points.push(new THREE.Vector3(0, 7, 0));
    points.push(new THREE.Vector3(0, 0, 0));
    const stringGeom = new THREE.BufferGeometry().setFromPoints(points);
    const string = new THREE.Line(stringGeom, matString);
    balloonGroup.add(string);

    // Radiosonde Box
    const boxGeom = new THREE.BoxGeometry(1, 1.5, 1);
    const box = new THREE.Mesh(boxGeom, matBox);
    box.position.y = -0.75;
    balloonGroup.add(box);

    // Animation (swaying)
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.1));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.1));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.1));

    const track = new THREE.QuaternionKeyframeTrack('balloonGroup.quaternion', [0, 2, 4], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    
    // bobbing
    const trackPos = new THREE.VectorKeyframeTrack('balloonGroup.position', [0, 2, 4], [
        0, 0, 0,
        0, 0.5, 0,
        0, 0, 0
    ]);

    const clip = new THREE.AnimationClip('Sway', 4, [track, trackPos]);
    animationClips.push(clip);

    return { group, animationClips };
}
