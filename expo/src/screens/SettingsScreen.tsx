import React from 'react';
import {View, Text, StyleSheet, ScrollView, Switch, Alert, Platform} from 'react-native';
import {colors} from '@/constants/colors';
import {Button} from '@/components/Button';
import {useCVStore} from '@/hooks/useCVStore';
import {
  Settings,
  Trash2,
  Download,
  Upload,
  HelpCircle,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const {cvs} = useCVStore();

  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);

  const handleExportData = () => {
    if (Platform.OS === 'web') {
      // For web (including Windows browsers), use a more compatible approach
      const dataStr = JSON.stringify(cvs, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'cv-data.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      // For native platforms
      Alert.alert(
        'Export Data',
        'This would export all CV data as a JSON file in a real app.',
        [{text: 'OK'}],
      );
    }
  };

  const handleImportData = () => {
    if (Platform.OS === 'web') {
      // For web (including Windows browsers)
      alert(
        'This would open a file picker to import CV data from a JSON file.',
      );
    } else {
      Alert.alert(
        'Import Data',
        'This would allow importing CV data from a JSON file in a real app.',
        [{text: 'OK'}],
      );
    }
  };

  const handleClearData = () => {
    if (Platform.OS === 'web') {
      // For web (including Windows browsers)
      if (
        confirm(
          'Are you sure you want to delete all CVs? This action cannot be undone.',
        )
      ) {
        // In a real app, this would clear all data
        alert('All CV data has been deleted.');
      }
    } else {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to delete all CVs? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              // In a real app, this would clear all data
              Alert.alert('Data Cleared', 'All CV data has been deleted.');
            },
          },
        ],
      );
    }
  };

  const handleGetHelp = () => {
    if (Platform.OS === 'web') {
      // For web (including Windows browsers)
      alert(
        'This would open the help documentation or support contact form in a real app.',
      );
    } else {
      Alert.alert(
        'Help & Support',
        'This would open the help documentation or support contact form in a real app.',
        [{text: 'OK'}],
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{false: colors.gray[300], true: colors.primary}}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{false: colors.gray[300], true: colors.primary}}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto-save Drafts</Text>
          <Switch
            value={autoSave}
            onValueChange={setAutoSave}
            trackColor={{false: colors.gray[300], true: colors.primary}}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{cvs.length}</Text>
            <Text style={styles.statLabel}>CVs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {cvs.reduce((total, cv) => total + cv.skills.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Skills</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {cvs.reduce((total, cv) => total + cv.experience.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Jobs</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            title="Export Data"
            onPress={handleExportData}
            icon={<Download size={16} color={colors.white} />}
            fullWidth
          />

          <Button
            title="Import Data"
            onPress={handleImportData}
            icon={<Upload size={16} color={colors.primary} />}
            variant="outline"
            fullWidth
          />

          <Button
            title="Clear All Data"
            onPress={handleClearData}
            icon={<Trash2 size={16} color={colors.error} />}
            variant="outline"
            fullWidth
            disabled={cvs.length === 0}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutContainer}>
          <Settings size={40} color={colors.primary} />
          <Text style={styles.appName}>CV Manager</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            A powerful tool for managing, parsing, and querying CVs.
          </Text>

          <Button
            title="Get Help"
            onPress={handleGetHelp}
            icon={<HelpCircle size={16} color={colors.primary} />}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  buttonGroup: {
    gap: 8,
  },
  aboutContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
});