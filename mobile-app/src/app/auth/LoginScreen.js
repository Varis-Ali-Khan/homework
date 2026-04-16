import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../redux/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

const { width: SW } = Dimensions.get('window');

const TOOLS = [
  { icon: '🔧', label: 'Plumbing',    color: '#60A5FA', from: 'left'  },
  { icon: '🖌️', label: 'Painting',    color: '#C084FC', from: 'right' },
  { icon: '🔨', label: 'Carpentry',   color: '#FBBF24', from: 'left'  },
  { icon: '⚡',  label: 'Electrical', color: '#F87171', from: 'right' },
  { icon: '🪛',  label: 'Repair',     color: '#34D399', from: 'left'  },
  { icon: '🏠',  label: 'Home Care',  color: '#FB923C', from: 'right' },
];

// ── Spinning arc ring (decorative) ──────────────────
function SpinRing({ size, colorA, colorB, speed, reverse }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange:  [0, 1],
    outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position:     'absolute',
        width:        size,
        height:       size,
        borderRadius: size / 2,
        borderWidth:  2,
        borderTopColor:    colorA,
        borderRightColor:  colorB,
        borderBottomColor: 'transparent',
        borderLeftColor:   'transparent',
        transform: [{ rotate }],
      }}
    />
  );
}

// ── Animated tool card ────────────────────────────────
function ToolCard({ icon, label, color, from, delay }) {
  const translateX  = useRef(new Animated.Value(from === 'left' ? -110 : 110)).current;
  const opacity     = useRef(new Animated.Value(0)).current;
  const scale       = useRef(new Animated.Value(0.5)).current;
  const glowOpacity = useRef(new Animated.Value(0.08)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(translateX, {
          toValue:  0,
          tension:  70,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue:  1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue:  1,
          tension:  70,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Glow pulse loop after card is visible
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.22, duration: 1100, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.06, duration: 1100, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.toolCard,
        { borderColor: color, opacity, transform: [{ scale }, { translateX }] },
      ]}
    >
      {/* Inner glow layer */}
      <Animated.View
        style={[styles.toolGlow, { backgroundColor: color, opacity: glowOpacity }]}
      />
      <Text style={styles.toolIcon}>{icon}</Text>
      <Text style={[styles.toolLabel, { color }]}>{label}</Text>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused,  setPassFocused]  = useState(false);
  const [splashDone,   setSplashDone]   = useState(false);

  const dispatch           = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { colors }         = useTheme();

  // Splash animated values
  const splashOpacity  = useRef(new Animated.Value(1)).current;
  const titleOpacity   = useRef(new Animated.Value(0)).current;
  const titleScale     = useRef(new Animated.Value(0.25)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const progressWidth  = useRef(new Animated.Value(0)).current;
  const loadingTextOp  = useRef(new Animated.Value(0)).current;

  // Login form animated values
  const loginOpacity   = useRef(new Animated.Value(0)).current;
  const loginTranslate = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    // 1. App name springs in
    Animated.sequence([
      Animated.parallel([
        Animated.spring(titleScale, {
          toValue:  1,
          tension:  50,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue:  1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 2. Underline expands + tagline fades in
      Animated.parallel([
        Animated.timing(underlineWidth, {
          toValue:  140,
          duration: 450,
          useNativeDriver: false,
        }),
        Animated.timing(taglineOpacity, {
          toValue:  1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      // 3. Loading text appears
      Animated.timing(loadingTextOp, {
        toValue:  1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar fills over full splash duration
    Animated.timing(progressWidth, {
      toValue:  SW - 48,
      duration: 3500,
      useNativeDriver: false,
    }).start();

    // Fade splash out after 3.5s → slide login in
    const exitTimer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue:  0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setSplashDone(true);
        Animated.parallel([
          Animated.timing(loginOpacity, {
            toValue:  1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(loginTranslate, {
            toValue:  0,
            tension:  50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3500);

    return () => clearTimeout(exitTimer);
  }, []);

  useEffect(() => {
    if (error) Alert.alert('Login Failed', error);
  }, [error]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    dispatch(loginRequest({ email, password }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Persistent background blobs */}
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />
      <View style={styles.bgBlob3} />

      {/* ── Login Form (always in tree, invisible until splash exits) ── */}
      <KeyboardAvoidingView
        style={styles.loginWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents={splashDone ? 'auto' : 'none'}
      >
        <Animated.View
          style={[
            styles.inner,
            { opacity: loginOpacity, transform: [{ translateY: loginTranslate }] },
          ]}
        >
          <Text style={[styles.welcomeText, { color: colors.accent }]}>Welcome back</Text>
          <Text style={[styles.appName, { color: colors.text }]}>homework</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Sign in to continue</Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Email or Phone</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                emailFocused && { borderColor: colors.accent },
              ]}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={colors.placeholder}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Password</Text>
              <TouchableOpacity>
                <Text style={[styles.forgotText, { color: colors.accent }]}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                passFocused && { borderColor: colors.accent },
              ]}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.placeholder}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
            />
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* OR divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Sign up */}
          <TouchableOpacity
            style={[styles.outlineButton, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.8}
          >
            <Text style={[styles.outlineButtonText, { color: colors.textSecondary }]}>Create an account</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* ── Splash Overlay ─────────────────────────────────── */}
      {!splashDone && (
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.splash, { opacity: splashOpacity }]}
          pointerEvents="none"
        >
          {/* Blobs repeated so they show during splash */}
          <View style={styles.bgBlob1} />
          <View style={styles.bgBlob2} />
          <View style={styles.bgBlob3} />

          {/* Spinning rings + title */}
          <View style={styles.ringZone}>
            <SpinRing size={200} colorA="#3B82F6" colorB="#3B82F620" speed={4500} />
            <SpinRing size={160} colorA="#C084FC" colorB="#C084FC20" speed={3200} reverse />
            <SpinRing size={120} colorA="#34D399" colorB="#34D39920" speed={2400} />

            <Animated.Text
              style={[
                styles.splashTitle,
                {
                  opacity:   titleOpacity,
                  transform: [{ scale: titleScale }],
                },
              ]}
            >
              homework
            </Animated.Text>
          </View>

          {/* Animated underline */}
          <Animated.View style={[styles.titleUnderline, { width: underlineWidth }]} />

          {/* Tagline */}
          <Animated.Text style={[styles.splashTagline, { opacity: taglineOpacity }]}>
            Find trusted professionals near you
          </Animated.Text>

          {/* Tool grid */}
          <View style={styles.toolsGrid}>
            {TOOLS.map((tool, i) => (
              <ToolCard
                key={tool.label}
                icon={tool.icon}
                label={tool.label}
                color={tool.color}
                from={tool.from}
                delay={600 + i * 270}
              />
            ))}
          </View>

          {/* Loading progress */}
          <View style={styles.progressArea}>
            <Animated.Text style={[styles.loadingText, { opacity: loadingTextOp }]}>
              Loading your services...
            </Animated.Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D18',
  },

  // Background decorative blobs
  bgBlob1: {
    position:        'absolute',
    width:           SW * 0.9,
    height:          SW * 0.9,
    borderRadius:    SW * 0.45,
    backgroundColor: '#1D4ED8',
    opacity:         0.055,
    top:             -SW * 0.28,
    right:           -SW * 0.28,
  },
  bgBlob2: {
    position:        'absolute',
    width:           SW * 0.75,
    height:          SW * 0.75,
    borderRadius:    SW * 0.375,
    backgroundColor: '#7C3AED',
    opacity:         0.05,
    bottom:          -SW * 0.22,
    left:            -SW * 0.22,
  },
  bgBlob3: {
    position:        'absolute',
    width:           SW * 0.4,
    height:          SW * 0.4,
    borderRadius:    SW * 0.2,
    backgroundColor: '#059669',
    opacity:         0.035,
    top:             '45%',
    right:           -SW * 0.1,
  },

  // ── Splash ──────────────────────────────────────────
  splash: {
    backgroundColor: '#070D18',
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 24,
  },
  ringZone: {
    width:           200,
    height:          200,
    alignItems:      'center',
    justifyContent:  'center',
  },
  splashTitle: {
    fontSize:        40,
    fontWeight:      '800',
    color:           '#F1F5F9',
    letterSpacing:   -1,
    textShadowColor: '#3B82F6',
    textShadowRadius: 28,
    textShadowOffset: { width: 0, height: 0 },
  },
  titleUnderline: {
    height:          3,
    borderRadius:    2,
    backgroundColor: '#3B82F6',
    marginTop:       14,
    marginBottom:    10,
    shadowColor:     '#3B82F6',
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    10,
    elevation:       5,
  },
  splashTagline: {
    fontSize:      13,
    color:         '#3D5270',
    marginBottom:  32,
    letterSpacing: 0.5,
  },

  // Tool cards
  toolsGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    justifyContent: 'center',
    width:         '100%',
  },
  toolCard: {
    width:           '28%',
    aspectRatio:     1,
    backgroundColor: '#0C1525',
    borderRadius:    18,
    borderWidth:     1.5,
    alignItems:      'center',
    justifyContent:  'center',
    margin:          '2%',
    overflow:        'hidden',
  },
  toolGlow: {
    position:     'absolute',
    top:          0,
    left:         0,
    right:        0,
    bottom:       0,
    borderRadius: 18,
  },
  toolIcon: {
    fontSize:     28,
    marginBottom: 5,
  },
  toolLabel: {
    fontSize:      10,
    fontWeight:    '700',
    letterSpacing: 0.4,
  },

  // Progress bar
  progressArea: {
    position: 'absolute',
    bottom:   52,
    left:     24,
    right:    24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize:      11,
    color:         '#2D3F55',
    marginBottom:  10,
    letterSpacing: 0.5,
  },
  progressTrack: {
    width:           '100%',
    height:          2,
    backgroundColor: '#111E30',
    borderRadius:    2,
    overflow:        'hidden',
  },
  progressFill: {
    height:          '100%',
    backgroundColor: '#3B82F6',
    borderRadius:    2,
    shadowColor:     '#3B82F6',
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.9,
    shadowRadius:    6,
  },

  // ── Login Form ────────────────────────────────────
  loginWrapper: { flex: 1 },
  inner: {
    flex:              1,
    justifyContent:    'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize:      13,
    color:         '#3B82F6',
    fontWeight:    '600',
    letterSpacing: 0.6,
    textAlign:     'center',
    marginBottom:  4,
    textTransform: 'uppercase',
  },
  appName: {
    fontSize:         44,
    fontWeight:       '800',
    color:            '#F1F5F9',
    textAlign:        'center',
    letterSpacing:    -1.5,
    marginBottom:     6,
    textShadowColor:  '#3B82F6',
    textShadowRadius: 22,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    fontSize:      14,
    color:         '#3D5270',
    textAlign:     'center',
    marginBottom:  36,
    letterSpacing: 0.3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize:      11,
    fontWeight:    '700',
    color:         '#3D5270',
    marginBottom:  8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  labelRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   8,
  },
  forgotText: {
    fontSize:   12,
    color:      '#3B82F6',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0C1525',
    borderWidth:     1.5,
    borderColor:     '#162030',
    borderRadius:    14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize:        15,
    color:           '#E2E8F0',
  },
  inputFocused: {
    borderColor:   '#3B82F6',
    shadowColor:   '#3B82F6',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius:  10,
    elevation:     6,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius:    14,
    paddingVertical: 16,
    alignItems:      'center',
    marginTop:       6,
    shadowColor:     '#3B82F6',
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.45,
    shadowRadius:    16,
    elevation:       8,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color:         '#fff',
    fontWeight:    '700',
    fontSize:      16,
    letterSpacing: 0.4,
  },
  dividerRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex:            1,
    height:          1,
    backgroundColor: '#111E30',
  },
  dividerText: {
    fontSize:        11,
    color:           '#2D3F55',
    fontWeight:      '700',
    marginHorizontal: 16,
    letterSpacing:   1.5,
  },
  outlineButton: {
    borderWidth:     1.5,
    borderColor:     '#162030',
    borderRadius:    14,
    paddingVertical: 15,
    alignItems:      'center',
  },
  outlineButtonText: {
    color:      '#64748B',
    fontWeight: '600',
    fontSize:   15,
  },
});
