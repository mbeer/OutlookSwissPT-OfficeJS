# Contributing to Swiss Public Transport Timetable

Thank you for your interest! This is a personal project, but contributions are welcome.

## Reporting Issues

- Use [GitHub Issues](https://github.com/mbeer/OutlookSwissPT-OfficeJS/issues) for bug reports
- Include your Outlook version, OS, and browser (if using Outlook on the web)
- Provide screenshots if the issue is UI-related
- Describe steps to reproduce the issue

## Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Follow existing code style (see project structure in README.md)
4. Test your changes in Outlook before submitting
5. Write clear, descriptive commit messages
6. Submit a pull request with a detailed description of changes

## Development Setup

See [README.md](README.md) for installation and build instructions.

To start development:
```bash
npm install
npm start -- desktop --app outlook
```

The development server runs on `https://localhost:3000/` with auto-reload.

## Documentation Contributions

- User documentation is primarily available in **German (de-CH)**
- The add-in UI supports 5 languages: English, German, French, Italian, Romansh
- Help wanted: Contribute documentation translations for additional languages
- Update or add screenshots in `src/docs/screenshots/` if UI changes significantly
- Test documentation in all supported Outlook versions (Windows, Mac, Web)

## Translation Contributions

We welcome documentation translations! To contribute a new language:

1. Copy `src/docs/de-CH.md` to `src/docs/[locale].md` (e.g., `en-GB.md`)
2. Translate all text to your target language
3. Capture installation screenshots for your locale (steps 1-3 in German UI):
   - `src/docs/screenshots/step-1-[locale].png`
   - `src/docs/screenshots/step-2-[locale].png`
   - `src/docs/screenshots/step-3-[locale].png`
4. Update the screenshot references in your translated documentation
5. Submit a pull request with the translated file and screenshots

**Supported locales**: en-GB, fr-CH, it-CH, rm-CH (and others)

## Code Style

- Use vanilla JavaScript (no frameworks)
- Follow the existing formatting and naming conventions
- Add comments for complex logic
- Ensure IE 11 compatibility (via Babel transpilation)
- Test in Outlook before committing

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
