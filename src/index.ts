// eslint-disable-next-line simple-import-sort/imports
import DefaultTheme from 'vitepress/theme';
import './custom.css';

interface GithubVersion {
  name: string;
  html_url: string;
}

interface RecentUpdates {
  text: string;
  link: string;
  target: string;
}

/**
 * This function will fetch the most recent versions from the Github API and add them to the changelog dropdown
 * @param repositoryName The name of the repository to fetch the versions from
 * @param limit The number of versions to fetch, default is 5
 * @returns void
 */
const generateGithubVersions = async (repositoryName: string, limit = 5) => {
  const response = await fetch(`https://api.github.com/repos/finsweet/${repositoryName}/releases`);

  const versions = await response.json();

  const recentUpdates = versions.slice(0, limit).map((version: GithubVersion) => {
    return {
      text: version.name,
      link: version.html_url,
      target: '_blank',
    };
  });

  const navDropdowns = document?.querySelectorAll('.VPFlyout.VPNavBarMenuGroup');

  navDropdowns?.forEach((dropdown) => {
    const changelogNode = Array.from(dropdown?.childNodes).filter((node) => {
      return node?.textContent?.toLowerCase().includes('changelog');
    });

    if (changelogNode.length > 0) {
      const linkTemplateParent = dropdown?.querySelector<HTMLDivElement>('div.menu .items');

      if (!linkTemplateParent) return;

      const linkTemplate = linkTemplateParent?.children[0];
      const linkTemplateClone = linkTemplate?.cloneNode(true);

      linkTemplateParent.innerHTML = '';

      recentUpdates?.forEach((update: RecentUpdates) => {
        const link = linkTemplateClone?.cloneNode(true) as HTMLDivElement;

        if (!link) return;

        const linkText = link?.querySelector('a');

        if (!linkText) return;

        linkText.innerText = update.text;
        linkText.href = update.link;
        linkText.target = update.target;

        linkTemplateParent.appendChild(link);
      });
    }
  });
};

/**
 * This function returns list of items to show on the navbar
 */
const generateNavLinks = () => {
  return [
    {
      text: 'Finsweet Docs',
      items: [
        {
          text: 'ts-utils',
          active: true,
          link: 'https://fs-utils-test.vercel.app/get-started',
          target: '_blank',
        },
        { text: 'attributes', link: 'https://finsweet.com/attributes', target: '_blank' },
        { text: 'Wized', link: 'https://wized.com/', target: '_blank' },
      ],
    },
    {
      // TODO: there is an open issue for this: https://github.com/vuejs/vitepress/issues/1550
      // We are using a custom script to inject the version number into the navbar
      text: 'Changelog',
      id: 'fs-changelog',
      items: [{ text: ' A', link: '/item-1', target: '_blank', id: 'version-link' }],
    },
  ];
};

/**
 * This function generates the social links to show on the navbar
 * @returns array of social links
 */
const generateSocialLinks = () => {
  return [
    { icon: 'github', link: 'https://github.com/finsweet', target: '_blank' },
    { icon: 'twitter', link: 'https://twitter.com/thatsfinsweet', target: '_blank' },
    { icon: 'slack', link: 'https://finsweet.com/community/plus', target: '_blank' },
    { icon: 'linkedin', link: 'https://www.linkedin.com/company/finsweet/', target: '_blank' },
  ];
};

interface TableOfContents {
  text: string;
  link: string;
}
/**
 * This function generates the sidebar items
 * @returns array of sidebar items
 */
const generateSidebar = (tableOfCotents: TableOfContents[]) => {
  return [
    {
      text: 'Finsweet Docs',
      collapsed: false,
      items: [
        {
          text: 'ts-utils',
          active: true,
          link: 'https://fs-utils-test.vercel.app/get-started',
          target: '_blank',
        },
        { text: 'attributes', link: 'https://finsweet.com/attributes', target: '_blank' },
        { text: 'Wized', link: 'https://wized.com/', target: '_blank' },
      ],
    },
    {
      text: 'Table of Contents',
      collapsed: false,
      items: [...tableOfCotents],
    },
  ];
};

/**
 * This function generates the footer message and copyright
 * @returns object containing the footer message and copyright
 */
const generateFooterMessage = () => {
  return {
    message: 'Released under the ISC License.',
    copyright: 'Copyright © 2023-present Finsweet',
  };
};

export {
  DefaultTheme,
  generateFooterMessage,
  generateGithubVersions,
  generateNavLinks,
  generateSidebar,
  generateSocialLinks,
};
