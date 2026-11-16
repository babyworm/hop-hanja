use tauri::Config;

pub fn automatic_updates_enabled(config: &Config) -> bool {
    config
        .plugins
        .0
        .get("updater")
        .and_then(|updater| updater.get("endpoints"))
        .and_then(serde_json::Value::as_array)
        .is_some_and(|endpoints| !endpoints.is_empty())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shipping_fork_does_not_check_an_update_feed() {
        let config = serde_json::from_str(include_str!("../tauri.conf.json")).unwrap();
        assert!(!automatic_updates_enabled(&config));
    }

    #[test]
    fn missing_updater_configuration_disables_checks() {
        assert!(!automatic_updates_enabled(&Config::default()));
    }

    #[test]
    fn an_explicit_feed_can_enable_checks() {
        let mut config = Config::default();
        config.plugins.0.insert(
            "updater".into(),
            serde_json::json!({"endpoints": ["https://example.com/latest.json"]}),
        );
        assert!(automatic_updates_enabled(&config));
    }
}
