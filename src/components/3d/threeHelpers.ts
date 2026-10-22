import * as THREE from 'three';

export function detectSoftwareGl(): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Creates the lovable Robot BIT composite 3D model (6-8 parts)
 */
export function createBitRobot(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'BitRobot';

  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Clean white
    roughness: 0.25,
    metalness: 0.1
  });

  const cyanMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan glow accent
    roughness: 0.3,
    metalness: 0.5,
    emissive: 0x0891b2,
    emissiveIntensity: 0.3
  });

  const darkScreenMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Dark screen
    roughness: 0.2,
    metalness: 0.8
  });

  const eyeGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8 // Bright glowing eyes
  });

  const metalJointMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.4,
    metalness: 0.8
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.6
  });

  // 1. Hover Base / Thruster ring
  const baseRingGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.15, 16);
  const baseRing = new THREE.Mesh(baseRingGeo, cyanMat);
  baseRing.position.y = 0.1;
  root.add(baseRing);

  // 2. Torso / Body
  const torsoGeo = new THREE.CylinderGeometry(0.4, 0.42, 0.65, 16);
  const torso = new THREE.Mesh(torsoGeo, bodyMat);
  torso.position.y = 0.5;
  root.add(torso);

  // Chest badge (BIT logo)
  const badgeGeo = new THREE.BoxGeometry(0.25, 0.16, 0.05);
  const badge = new THREE.Mesh(badgeGeo, goldAccentMat);
  badge.position.set(0, 0.55, 0.41);
  root.add(badge);

  // 3. Neck joint
  const neckGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12);
  const neck = new THREE.Mesh(neckGeo, metalJointMat);
  neck.position.y = 0.88;
  root.add(neck);

  // 4. Head
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.y = 1.25;

  const headGeo = new THREE.BoxGeometry(0.7, 0.55, 0.6);
  const head = new THREE.Mesh(headGeo, bodyMat);
  headGroup.add(head);

  // Face screen
  const screenGeo = new THREE.PlaneGeometry(0.55, 0.38);
  const screen = new THREE.Mesh(screenGeo, darkScreenMat);
  screen.position.set(0, 0, 0.305);
  headGroup.add(screen);

  // Eyes (Two glowing blue rounded dots)
  const eyeLeftGeo = new THREE.PlaneGeometry(0.12, 0.1);
  const eyeLeft = new THREE.Mesh(eyeLeftGeo, eyeGlowMat);
  eyeLeft.position.set(-0.14, 0.04, 0.31);
  headGroup.add(eyeLeft);

  const eyeRightGeo = new THREE.PlaneGeometry(0.12, 0.1);
  const eyeRight = new THREE.Mesh(eyeRightGeo, eyeGlowMat);
  eyeRight.position.set(0.14, 0.04, 0.31);
  headGroup.add(eyeRight);

  // Smile / expression line
  const smileGeo = new THREE.PlaneGeometry(0.18, 0.04);
  const smile = new THREE.Mesh(smileGeo, eyeGlowMat);
  smile.position.set(0, -0.09, 0.31);
  headGroup.add(smile);

  // 5. Antennas (Top center)
  const stalkGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
  const stalk = new THREE.Mesh(stalkGeo, metalJointMat);
  stalk.position.set(0, 0.38, 0);
  headGroup.add(stalk);

  const bulbGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const bulb = new THREE.Mesh(bulbGeo, cyanMat);
  bulb.position.set(0, 0.48, 0);
  headGroup.add(bulb);

  // Ear headphones
  const earGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12);
  const earL = new THREE.Mesh(earGeo, cyanMat);
  earL.rotation.z = Math.PI / 2;
  earL.position.set(-0.38, 0, 0);
  headGroup.add(earL);

  const earR = new THREE.Mesh(earGeo, cyanMat);
  earR.rotation.z = Math.PI / 2;
  earR.position.set(0.38, 0, 0);
  headGroup.add(earR);

  root.add(headGroup);

  // 6. Arms (Floating robotic hands)
  const armGeo = new THREE.SphereGeometry(0.1, 10, 10);
  const handL = new THREE.Mesh(armGeo, cyanMat);
  handL.position.set(-0.55, 0.45, 0.1);
  root.add(handL);

  const handR = new THREE.Mesh(armGeo, cyanMat);
  handR.position.set(0.55, 0.45, 0.1);
  root.add(handR);

  return root;
}
