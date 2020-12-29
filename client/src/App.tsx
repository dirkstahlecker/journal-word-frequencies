import React from 'react';
import './App.css';
import {observer} from "mobx-react";
import {makeObservable, observable, runInAction} from "mobx";
import { JournalReader, JournalReaderMachine } from './JournalReader';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import { JournalWriter, JournalWriterMachine } from './JournalWriter';
import { MarkupUtils } from './MarkupUtils';

export class AppMachine
{
  @observable testData: any = null;

  public journalReaderMachine: JournalReaderMachine = new JournalReaderMachine();
  public journalWriterMachine: JournalWriterMachine = new JournalWriterMachine();

  constructor()
  {
    makeObservable(this);
  }

  public handleEasyMarkupGeneratorSubmit = (): void => {
    document.getElementById("firstName");
    const firstName: string | null = (document.getElementById("firstName") as HTMLInputElement).value;
    const lastName: string = (document.getElementById("lastName") as HTMLInputElement).value;
    const displayName: string = (document.getElementById("displayName") as HTMLInputElement).value;

    const currentMarkupHack = MarkupUtils.makeMarkup(firstName, lastName, displayName);
    (document.getElementById("placeToSelectText") as HTMLInputElement).value = currentMarkupHack;

    var copyText = document.getElementById("displayCopyArea") as HTMLElement;
    // this.selectElementContents(copyText);
    document.execCommand("copy");

    (document.getElementById("firstName") as HTMLInputElement).value = "";
    (document.getElementById("firstName") as HTMLInputElement).focus();
    (document.getElementById("lastName") as HTMLInputElement).value = "";
    (document.getElementById("displayName") as HTMLInputElement).value = "";
  };
}

export interface AppProps
{

}

@observer
class App extends React.Component<AppProps>
{
  private machine: AppMachine = new AppMachine();

  // private async fetchData(): Promise<void>
  // {
  //   const testDataRaw = await fetch('/test');
  //   const td = await testDataRaw.json();

  //   runInAction(() => this.machine.testData = td.message);
  // }

  componentDidMount()
  {
    // this.fetchData();
  }

  render()
  {
    return <div className="App">
      <span style={{width: "100%", height: "100%", display: "inline-block", verticalAlign: "top"}}
            tabIndex={0}
            id="mainApp"
      >
        <Tabs>
          <TabList>
            <Tab>
              Write
            </Tab>
            <Tab>
              Read
            </Tab>
            <Tab>
              Add Markup
            </Tab>
            <Tab>
              Stats
            </Tab>
            <Tab>
              Graph Testing
            </Tab>
          </TabList>

          <TabPanel>
            <JournalWriter machine={this.machine.journalWriterMachine}/>
          </TabPanel>
          <TabPanel>
            <JournalReader machine={this.machine.journalReaderMachine}/>
          </TabPanel>
          <TabPanel>
            <div onKeyDown={(e: any) => {
              if (e.key === "Enter")
              {
                e.preventDefault();
                this.machine.handleEasyMarkupGeneratorSubmit();
              }
            }}>
              First Name: <input type="text" id="firstName" autoFocus={true}/>
              <br />
              Last Name: <input type="text" id="lastName" />
              <br />
              Display Name: <input type="text" id="displayName" />
              <br />
              {/* <button onClick={this.machine.handleEasyMarkupGeneratorSubmit}>Submit</button> */}
              <br />
              <br />
              <div id="displayCopyArea">
                <input id="placeToSelectText" />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            {/* <Stats
              machine={new StatsMachine("TODO")}
            /> */}
          </TabPanel>
          <TabPanel>

          </TabPanel>
        </Tabs>

      </span>
    </div>
  }
}

export default App;
