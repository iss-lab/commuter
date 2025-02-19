// @flow
import * as React from "react";
import Link from "next/link";
import { groupBy } from "lodash";
import {
  Entry,
  Listing,
  Icon,
  Name,
  LastSaved
} from "@nteract/directory-listing";

import { theme } from "../../theme";

export type DirectoryListingProps = {
  contents: Array<JupyterApi$Content>,
  basepath: string
};

const GroupedDirectoryListings = (props: DirectoryListingProps) => {
  const contents = props.contents.filter(row => !row.name.startsWith("."));
	const sortedContents = contents.sort((a, b) => {return new Date(b.last_modified) - new Date(a.last_modified)}).slice(0,100);
	console.log(sortedContents);
  if (sortedContents.length <= 25) {
    return <DirectoryListing contents={sortedContents} basepath={props.basepath} />;
  }

  const groups = groupBy(sortedContents, item => item.name[0].toUpperCase());
  // Filter out dotfiles
  delete groups["."];

  if (Object.keys(groups).length <= 1) {
    return <DirectoryListing contents={sortedContents} basepath={props.basepath} />;
  }

  const groupNames = Object.keys(groups).sort();

  const listings = groupNames.map(key => (
    <div key={key}>
      <div id={`group-${key}`} className="letterHeader">
        {key}
      </div>
      <DirectoryListing contents={groups[key]} basepath={props.basepath} />
      <style jsx>{`
        .letterHeader {
          padding-top: 1em;
          padding-bottom: 0.5em;
          padding-left: 6px;
        }
      `}</style>
    </div>
  ));

  return (
    <React.Fragment>
      <div className="letters">
        {groupNames.map(x => (
          <a href={`#group-${x}`} key={x}>
            {x.toUpperCase()}
          </a>
        ))}
      </div>
      {listings}
      <style jsx>{`
        a {
          text-decoration: none;
          padding-right: 1em;
          color: ${theme.link};
        }
        .letters {
          padding-bottom: 1em;
          padding-left: 6px;
        }
      `}</style>
    </React.Fragment>
  );
};

const DirectoryListing = (props: DirectoryListingProps) => {
  const base = props.basepath || "/";

  // filter out dotfiles
  const contents = props.contents.filter(entry => !entry.name.startsWith("."));

  return (
    <React.Fragment>
      <Listing>
        {contents.map((entry, index) => {
          const link = (
            <Link
              href={{
                pathname: "/view",
                query: { viewPath: entry.path }
              }}
              as={base + "/" + entry.path}
            >
              <a>{entry.name}</a>
            </Link>
          );
          return (
            <Entry key={index}>
              <Icon fileType={entry.type} />
              <Name>{link}</Name>
              <LastSaved lastModified={entry.last_modified} />
            </Entry>
          );
        })}
      </Listing>
    </React.Fragment>
  );
};

export default GroupedDirectoryListings;

// export default DirectoryListing;
